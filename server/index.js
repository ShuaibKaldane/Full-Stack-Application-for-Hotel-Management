import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { query, dbError } from './db.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const secret = process.env.JWT_SECRET || 'development-secret-change-me';
app.use(cors({ origin: process.env.CLIENT_ORIGIN || true }));
app.use(express.json());

const asyncRoute = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
const cleanUser = ({ id, name, email, role, phone }) => ({ id, name, email, role, phone });
function auth(req, res, next) {
  const token = req.headers.authorization?.startsWith('Bearer ') && req.headers.authorization.slice(7);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try { req.user = jwt.verify(token, secret); next(); } catch { res.status(401).json({ error: 'Invalid or expired token.' }); }
}
const roles = (...allowed) => (req, res, next) => allowed.includes(req.user.role)
  ? next() : res.status(403).json({ error: 'You do not have permission for this action.' });
function issue(user) { return jwt.sign(cleanUser(user), secret, { expiresIn: '7d' }); }
function required(body, fields) { return fields.find((field) => !body[field] && body[field] !== 0); }

app.get('/api/health', (req, res) => res.json({ ok: true, service: 'hotel-management-api' }));

app.post('/api/auth/register', asyncRoute(async (req, res) => {
  const missing = required(req.body, ['name', 'email', 'password']);
  if (missing) return res.status(400).json({ error: `${missing} is required.` });
  if (String(req.body.password).length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  const hash = await bcrypt.hash(req.body.password, 12);
  try {
    const result = await query('INSERT INTO users (name,email,password_hash,role,phone) VALUES (?,?,?,?,?)', [req.body.name, String(req.body.email).toLowerCase(), hash, 'customer', req.body.phone || null]);
    const user = { id: result.insertId, name: req.body.name, email: String(req.body.email).toLowerCase(), role: 'customer', phone: req.body.phone || null };
    res.status(201).json({ user, token: issue(user) });
  } catch (error) { if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: 'An account with this email already exists.' }); throw error; }
}));

app.post('/api/auth/login', asyncRoute(async (req, res) => {
  if (!req.body.email || !req.body.password) return res.status(400).json({ error: 'Email and password are required.' });
  const rows = await query('SELECT id,name,email,password_hash,role,phone FROM users WHERE email=? LIMIT 1', [String(req.body.email).toLowerCase()]);
  if (!rows[0] || !(await bcrypt.compare(req.body.password, rows[0].password_hash))) return res.status(401).json({ error: 'Invalid email or password.' });
  const user = cleanUser(rows[0]); res.json({ user, token: issue(user) });
}));
app.get('/api/auth/me', auth, asyncRoute(async (req, res) => { const rows = await query('SELECT id,name,email,role,phone FROM users WHERE id=?', [req.user.id]); res.json({ user: rows[0] || null }); }));
app.get('/api/users', auth, roles('admin', 'super_admin'), asyncRoute(async (req, res) => { res.json(await query('SELECT id,name,email,role,phone FROM users ORDER BY name')); }));

app.get('/api/properties', asyncRoute(async (req, res) => {
  const rows = await query(`SELECT p.*, COUNT(r.id) AS room_count FROM properties p LEFT JOIN rooms r ON r.property_id=p.id GROUP BY p.id ORDER BY p.created_at DESC`); res.json(rows);
}));
app.post('/api/properties', auth, roles('super_admin', 'admin'), asyncRoute(async (req, res) => {
  const missing = required(req.body, ['name', 'city']); if (missing) return res.status(400).json({ error: `${missing} is required.` });
  const result = await query('INSERT INTO properties (name,description,address,city,image_url) VALUES (?,?,?,?,?)', [req.body.name, req.body.description || null, req.body.address || null, req.body.city, req.body.imageUrl || null]); res.status(201).json({ id: result.insertId });
}));
app.get('/api/rooms', asyncRoute(async (req, res) => { const where = req.query.propertyId ? ' WHERE r.property_id=?' : ''; res.json(await query(`SELECT r.*,p.name AS property_name FROM rooms r JOIN properties p ON p.id=r.property_id${where} ORDER BY r.id`, req.query.propertyId ? [req.query.propertyId] : [])); }));
app.post('/api/rooms', auth, roles('super_admin', 'admin'), asyncRoute(async (req, res) => { const missing = required(req.body, ['propertyId','roomNumber','roomType','price']); if (missing) return res.status(400).json({ error: `${missing} is required.` }); const result = await query('INSERT INTO rooms (property_id,room_number,room_type,price,capacity,description) VALUES (?,?,?,?,?,?)', [req.body.propertyId, req.body.roomNumber, req.body.roomType, req.body.price, req.body.capacity || 2, req.body.description || null]); res.status(201).json({ id: result.insertId }); }));

app.get('/api/bookings', auth, asyncRoute(async (req, res) => { const admin = ['admin','super_admin'].includes(req.user.role); const sql = `SELECT b.*,u.name AS customer_name,u.email,r.room_number,r.room_type,p.name AS property_name FROM hotel_bookings b JOIN users u ON u.id=b.user_id JOIN rooms r ON r.id=b.room_id JOIN properties p ON p.id=r.property_id ${admin ? '' : 'WHERE b.user_id=?'} ORDER BY b.created_at DESC`; res.json(await query(sql, admin ? [] : [req.user.id])); }));
app.post('/api/bookings', auth, asyncRoute(async (req, res) => { const missing = required(req.body, ['roomId','checkIn','checkOut']); if (missing) return res.status(400).json({ error: `${missing} is required.` }); if (new Date(req.body.checkOut) <= new Date(req.body.checkIn)) return res.status(400).json({ error: 'Check-out must be after check-in.' }); const userId = ['admin','super_admin'].includes(req.user.role) && req.body.userId ? req.body.userId : req.user.id; const conflicts = await query("SELECT id FROM hotel_bookings WHERE room_id=? AND status IN ('pending','confirmed') AND check_in < ? AND check_out > ? LIMIT 1", [req.body.roomId, req.body.checkOut, req.body.checkIn]); if (conflicts.length) return res.status(409).json({ error: 'That room is already booked for the selected dates.' }); const result = await query('INSERT INTO hotel_bookings (user_id,room_id,check_in,check_out,guests,status,notes) VALUES (?,?,?,?,?,?,?)', [userId, req.body.roomId, req.body.checkIn, req.body.checkOut, req.body.guests || 1, req.body.status || 'pending', req.body.notes || null]); res.status(201).json({ id: result.insertId }); }));
app.patch('/api/bookings/:id', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => { await query('UPDATE hotel_bookings SET status=? WHERE id=?', [req.body.status, req.params.id]); res.json({ ok: true }); }));

app.get('/api/menu-items', asyncRoute(async (req, res) => res.json(await query('SELECT * FROM menu_items WHERE available=1 ORDER BY category,name'))));
app.post('/api/menu-items', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => { const missing = required(req.body, ['name','price']); if (missing) return res.status(400).json({ error: `${missing} is required.` }); const result = await query('INSERT INTO menu_items (name,description,category,price,available) VALUES (?,?,?,?,?)', [req.body.name, req.body.description || null, req.body.category || 'General', req.body.price, req.body.available !== false]); res.status(201).json({ id: result.insertId }); }));
app.post('/api/orders', auth, asyncRoute(async (req, res) => { const missing = required(req.body, ['items']); if (missing || !Array.isArray(req.body.items) || !req.body.items.length) return res.status(400).json({ error: 'At least one order item is required.' }); const connection = await (await import('./db.js')).pool?.getConnection(); if (!connection) throw new Error('Database is not configured.'); try { await connection.beginTransaction(); const ids = req.body.items.map((item) => item.menuItemId); const [menu] = await connection.query(`SELECT id,price FROM menu_items WHERE id IN (${ids.map(() => '?').join(',')})`, ids); const total = req.body.items.reduce((sum, item) => sum + Number(menu.find((m) => m.id === Number(item.menuItemId))?.price || 0) * Number(item.quantity || 1), 0); const [order] = await connection.execute('INSERT INTO food_orders (user_id,total,status,notes) VALUES (?,?,?,?)', [req.user.id, total, 'pending', req.body.notes || null]); for (const item of req.body.items) { const found = menu.find((m) => m.id === Number(item.menuItemId)); if (!found) throw new Error('One or more menu items are invalid.'); await connection.execute('INSERT INTO food_order_items (order_id,menu_item_id,quantity,unit_price) VALUES (?,?,?,?)', [order.insertId, item.menuItemId, item.quantity || 1, found.price]); } await connection.commit(); res.status(201).json({ id: order.insertId, total }); } catch (error) { await connection.rollback(); throw error; } finally { connection.release(); } }));
app.get('/api/orders', auth, asyncRoute(async (req, res) => { const admin = ['admin','super_admin'].includes(req.user.role); res.json(await query(`SELECT o.*,u.name AS customer_name FROM food_orders o JOIN users u ON u.id=o.user_id ${admin ? '' : 'WHERE o.user_id=?'} ORDER BY o.created_at DESC`, admin ? [] : [req.user.id])); }));

app.get('/api/cab-bookings', auth, asyncRoute(async (req, res) => { const admin = ['admin','super_admin'].includes(req.user.role); res.json(await query(`SELECT c.*,u.name AS customer_name FROM cab_bookings c JOIN users u ON u.id=c.user_id ${admin ? '' : 'WHERE c.user_id=?'} ORDER BY c.pickup_at DESC`, admin ? [] : [req.user.id])); }));
app.post('/api/cab-bookings', auth, asyncRoute(async (req, res) => { const missing = required(req.body, ['pickupLocation','dropoffLocation','pickupAt']); if (missing) return res.status(400).json({ error: `${missing} is required.` }); const result = await query('INSERT INTO cab_bookings (user_id,pickup_location,dropoff_location,pickup_at,passengers,vehicle_type,status,notes) VALUES (?,?,?,?,?,?,?,?)', [req.user.id, req.body.pickupLocation, req.body.dropoffLocation, req.body.pickupAt, req.body.passengers || 1, req.body.vehicleType || 'Sedan', 'pending', req.body.notes || null]); res.status(201).json({ id: result.insertId }); }));

// =====================================================
// HOUSEKEEPING TASKS
// =====================================================
app.get('/api/housekeeping-tasks', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  const { status, priority } = req.query;
  const filters = [];
  const params = [];
  if (status) { filters.push('status=?'); params.push(status); }
  if (priority) { filters.push('priority=?'); params.push(priority); }
  const where = filters.length ? ` WHERE ${filters.join(' AND ')}` : '';
  const rows = await query(`SELECT * FROM housekeeping_tasks${where} ORDER BY FIELD(priority,'urgent','high','normal','low'), FIELD(status,'pending','in_progress','completed'), due_at ASC`, params);
  res.json(rows);
}));
app.post('/api/housekeeping-tasks', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  const missing = required(req.body, ['property','roomNumber','taskType']);
  if (missing) return res.status(400).json({ error: `${missing} is required.` });
  const result = await query(
    'INSERT INTO housekeeping_tasks (property,room_number,task_type,status,priority,assignee,notes,due_at) VALUES (?,?,?,?,?,?,?,?)',
    [req.body.property, req.body.roomNumber, req.body.taskType, 'pending', req.body.priority || 'normal', req.body.assignee || null, req.body.notes || null, req.body.dueAt || null]
  );
  res.status(201).json({ id: result.insertId });
}));
app.patch('/api/housekeeping-tasks/:id', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  const fields = [];
  const params = [];
  for (const key of ['status','priority','assignee','notes','dueAt']) {
    if (req.body[key] !== undefined) {
      const column = key === 'dueAt' ? 'due_at' : (key === 'assignee' ? 'assignee' : key);
      fields.push(`${column}=?`);
      params.push(req.body[key]);
    }
  }
  if (!fields.length) return res.status(400).json({ error: 'No updatable fields provided.' });
  params.push(req.params.id);
  await query(`UPDATE housekeeping_tasks SET ${fields.join(', ')} WHERE id=?`, params);
  res.json({ ok: true });
}));
app.delete('/api/housekeeping-tasks/:id', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  await query('DELETE FROM housekeeping_tasks WHERE id=?', [req.params.id]);
  res.json({ ok: true });
}));

// =====================================================
// RESTAURANT / KITCHEN
// =====================================================
app.patch('/api/orders/:id/status', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  const allowed = ['pending','preparing','ready','completed','cancelled'];
  if (!allowed.includes(req.body.status)) return res.status(400).json({ error: 'Invalid status.' });
  await query('UPDATE food_orders SET status=? WHERE id=?', [req.body.status, req.params.id]);
  res.json({ ok: true });
}));
app.get('/api/restaurant/stats', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  const rows = await query(`SELECT status, COUNT(*) AS count, COALESCE(SUM(total),0) AS revenue FROM food_orders GROUP BY status`);
  const summary = { pending: 0, preparing: 0, ready: 0, completed: 0, cancelled: 0, revenue: 0 };
  for (const row of rows) {
    const count = Number(row.count);
    if (summary[row.status] !== undefined) summary[row.status] = count;
    summary.revenue += Number(row.revenue);
  }
  const today = await query(`SELECT COUNT(*) AS count, COALESCE(SUM(total),0) AS revenue FROM food_orders WHERE DATE(created_at)=CURRENT_DATE`);
  const pendingList = await query(`SELECT id,status,total,created_at FROM food_orders WHERE status IN ('pending','preparing','ready') ORDER BY created_at ASC LIMIT 6`);
  summary.todayCount = Number(today[0]?.count || 0);
  summary.todayRevenue = Number(today[0]?.revenue || 0);
  summary.queue = pendingList;
  res.json(summary);
}));

// =====================================================
// PAYMENTS
// =====================================================
function generateReference() { return 'TXN' + Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString().slice(-4); }

app.get('/api/payments', auth, asyncRoute(async (req, res) => {
  const admin = ['admin','super_admin'].includes(req.user.role);
  const where = admin ? '' : 'WHERE p.user_id=?';
  const rows = await query(
    `SELECT p.*, u.name AS customer_name FROM payments p JOIN users u ON u.id=p.user_id ${where} ORDER BY p.created_at DESC`,
    admin ? [] : [req.user.id]
  );
  res.json(rows);
}));
app.post('/api/payments', auth, asyncRoute(async (req, res) => {
  const missing = required(req.body, ['amount', 'method']);
  if (missing) return res.status(400).json({ error: `${missing} is required.` });
  if (!['card','upi','wallet','cash'].includes(req.body.method)) return res.status(400).json({ error: 'Invalid payment method.' });
  const amount = Number(req.body.amount);
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: 'Amount must be greater than zero.' });
  // Simulated fraud / validation rules
  if (req.body.method === 'card') {
    const digits = String(req.body.cardNumber || '').replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(digits)) return res.status(400).json({ error: 'Card number must be 13 to 19 digits.' });
    if (!/^\d{2}\/\d{2}$/.test(req.body.cardExpiry || '')) return res.status(400).json({ error: 'Card expiry must be MM/YY.' });
    if (!/^\d{3,4}$/.test(req.body.cardCvc || '')) return res.status(400).json({ error: 'Card CVC must be 3 or 4 digits.' });
  } else if (req.body.method === 'upi') {
    if (!/^[\w.-]+@[\w.-]+$/.test(req.body.upiId || '')) return res.status(400).json({ error: 'Enter a valid UPI handle (example@bank).' });
  }
  const cardLast4 = req.body.method === 'card' ? String(req.body.cardNumber).replace(/\s+/g, '').slice(-4) : null;
  const result = await query(
    'INSERT INTO payments (user_id, booking_id, order_id, amount, method, status, description, card_last4, reference) VALUES (?,?,?,?,?,?,?,?,?)',
    [req.user.id, req.body.bookingId || null, req.body.orderId || null, amount, req.body.method, 'completed', req.body.description || null, cardLast4, generateReference()]
  );
  res.status(201).json({ id: result.insertId, reference: null, status: 'completed' });
}));
app.get('/api/payments/stats', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  const totals = await query(`SELECT COALESCE(SUM(amount),0) AS total FROM payments WHERE status='completed'`);
  const byMethod = await query(`SELECT method, COALESCE(SUM(amount),0) AS total, COUNT(*) AS count FROM payments WHERE status='completed' GROUP BY method`);
  const recent = await query(`SELECT p.*, u.name AS customer_name FROM payments p JOIN users u ON u.id=p.user_id ORDER BY p.created_at DESC LIMIT 8`);
  res.json({ totalRevenue: Number(totals[0]?.total || 0), byMethod, recent });
}));
app.post('/api/payments/:id/refund', auth, roles('super_admin','admin'), asyncRoute(async (req, res) => {
  await query('UPDATE payments SET status=? WHERE id=?', ['refunded', req.params.id]);
  res.json({ ok: true });
}));

app.use((error, req, res, next) => { console.error(error); res.status(error.code === 'ER_DUP_ENTRY' ? 409 : 503).json({ error: dbError(error) }); });
app.listen(port, () => console.log(`Hotel API listening on http://localhost:${port}`));

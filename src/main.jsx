
const seedPayments = [
  { id: 'p1', customer_name: 'Jordan Lee', amount: 855.00, method: 'card', status: 'completed', description: 'Reservation · Harbor House · Deluxe King', card_last4: '4242', reference: 'TXN89F2A04', created_at: new Date(Date.now() - 86400000*3).toISOString() },
  { id: 'p2', customer_name: 'Jordan Lee', amount: 48.50, method: 'upi', status: 'completed', description: 'In-room dining · Pacific cod', card_last4: null, reference: 'TXNK3P7M2', created_at: new Date(Date.now() - 86400000*2).toISOString() },
  { id: 'p3', customer_name: 'Aanya Patel', amount: 320.00, method: 'card', status: 'pending', description: 'Reservation · Napa Valley escape', card_last4: '1881', reference: 'TXNQ7R3X9', created_at: new Date(Date.now() - 86400000*1).toISOString() },
  { id: 'p4', customer_name: 'Marcus Reed', amount: 1240.00, method: 'card', status: 'completed', description: 'Reservation · The Juniper Lodge · Garden Suite', card_last4: '9920', reference: 'TXNB4H2J1', created_at: new Date(Date.now() - 86400000*6).toISOString() },
  { id: 'p5', customer_name: 'Eliza Tan', amount: 76.00, method: 'wallet', status: 'completed', description: 'In-room dining · Miso salmon bowl', card_last4: null, reference: 'TXN5X9P1K', created_at: new Date(Date.now() - 86400000*4).toISOString() },
  { id: 'p6', customer_name: 'Daniel Cohen', amount: 24.00, method: 'card', status: 'failed', description: 'In-room dining · Avocado toast', card_last4: '0011', reference: 'TXNF2X6KK', created_at: new Date(Date.now() - 86400000*5).toISOString() }
];
import React, { useEffect, useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { ArrowRight, Banknote, BedDouble, Bell, Building2, CalendarDays, Car, Check, ChevronDown, Clock3, Coffee, Compass, CreditCard, Crown, LayoutDashboard, LogOut, MapPin, Menu, Moon, Plus, Receipt, Search, ShieldCheck, Sparkles, SprayCan, Star, Tag, Trash2, Utensils, Users, Wallet, Wrench, X } from 'lucide-react'
import './styles.css'

const seedUsers = [{ id: 'u1', name: 'Super Admin', email: 'admin@gmail.com', password: 'test1234', role: 'super_admin' }, { id: 'u2', name: 'Jordan Lee', email: 'customer@example.com', password: 'customer123', role: 'customer' }]
const properties = [
  { id: 1, name: 'Harbor House', city: 'San Francisco, California', type: 'Boutique hotel', rating: 4.9, price: 285, image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=900&q=80', tags: ['Ocean view', 'Breakfast included'] },
  { id: 2, name: 'The Juniper Lodge', city: 'Big Sur, California', type: 'Lodge & retreat', rating: 4.8, price: 340, image: 'https://images.unsplash.com/photo-1582610116397-edb318620f90?auto=format&fit=crop&w=900&q=80', tags: ['Spa', 'Forest trails'] },
  { id: 3, name: 'Casa Sol', city: 'Palm Springs, California', type: 'Design resort', rating: 4.7, price: 220, image: 'https://images.unsplash.com/photo-1601918774946-25832a4be0d6?auto=format&fit=crop&w=900&q=80', tags: ['Pool', 'Pet friendly'] }
]
const dishes = [{ name: 'Avocado toast', meal: 'Breakfast', price: 15, desc: 'Sourdough, poached egg, chili oil', icon: '🥑' }, { name: 'Lemon ricotta pancakes', meal: 'Breakfast', price: 17, desc: 'Berry compote, maple, whipped cream', icon: '🥞' }, { name: 'Miso salmon bowl', meal: 'Lunch', price: 24, desc: 'Jasmine rice, edamame, sesame greens', icon: '🍣' }, { name: 'Garden caesar', meal: 'Lunch', price: 16, desc: 'Little gem, parmesan, sourdough crumb', icon: '🥗' }, { name: 'Wild mushroom pasta', meal: 'Dinner', price: 28, desc: 'Tagliatelle, truffle, aged pecorino', icon: '🍝' }, { name: 'Pacific cod', meal: 'Dinner', price: 32, desc: 'Saffron broth, fennel, lemon', icon: '🐟' }]
const cabs = [{ name: 'Golden Gate & Sausalito', time: '4 hours', price: 160, image: 'https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&w=700&q=80' }, { name: 'City lights by night', time: '3 hours', price: 125, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=700&q=80' }, { name: 'Napa Valley escape', time: '8 hours', price: 320, image: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=700&q=80' }]

const local = { users: () => JSON.parse(localStorage.getItem('hh_users') || 'null') || seedUsers, bookings: () => JSON.parse(localStorage.getItem('hh_bookings') || '[]'), orders: () => JSON.parse(localStorage.getItem('hh_orders') || '[]'), cabs: () => JSON.parse(localStorage.getItem('hh_cabs') || '[]'), payments: () => JSON.parse(localStorage.getItem('hh_payments') || 'null') || seedPayments, tasks: () => JSON.parse(localStorage.getItem('hh_tasks') || 'null') || [
  { id: 1, property: 'Harbor House', room_number: '201', task_type: 'clean', status: 'completed', priority: 'high', assignee: 'Maya Chen', notes: 'Deep clean after checkout', due_at: new Date(Date.now() + 3600000).toISOString() },
  { id: 2, property: 'Harbor House', room_number: '208', task_type: 'inspect', status: 'in_progress', priority: 'normal', assignee: 'Daniel Park', notes: 'Mid-stay inspection', due_at: new Date(Date.now() + 7200000).toISOString() },
  { id: 3, property: 'Harbor House', room_number: '312', task_type: 'maintenance', status: 'pending', priority: 'urgent', assignee: null, notes: 'Air conditioning unit not cooling', due_at: new Date(Date.now() + 10800000).toISOString() },
  { id: 4, property: 'Harbor House', room_number: '105', task_type: 'restock', status: 'pending', priority: 'low', assignee: null, notes: 'Restock toiletries and towels', due_at: new Date(Date.now() + 14400000).toISOString() },
  { id: 5, property: 'Harbor House', room_number: '402', task_type: 'turndown', status: 'pending', priority: 'normal', assignee: null, notes: 'Evening turndown service', due_at: new Date(Date.now() + 21600000).toISOString() },
  { id: 6, property: 'Harbor House', room_number: '215', task_type: 'clean', status: 'in_progress', priority: 'normal', assignee: 'Sara Lin', notes: 'Standard clean', due_at: new Date(Date.now() + 5400000).toISOString() }
] }
const seedKitchen = [
  { id: 'k1', order_number: 'A12', customer_name: 'Jordan Lee', room: '208', items: [{ name: 'Avocado toast', qty: 2, price: 15 }, { name: 'Miso salmon bowl', qty: 1, price: 24 }], total: 54, status: 'pending', type: 'Room service', created_at: new Date(Date.now() - 600000).toISOString(), notes: 'No sesame' },
  { id: 'k2', order_number: 'A13', customer_name: 'Aanya Patel', room: '312', items: [{ name: 'Garden caesar', qty: 1, price: 16 }, { name: 'Pacific cod', qty: 1, price: 32 }], total: 48, status: 'preparing', type: 'Restaurant', created_at: new Date(Date.now() - 900000).toISOString(), notes: '' },
  { id: 'k3', order_number: 'A14', customer_name: 'Marcus Reed', room: '105', items: [{ name: 'Lemon ricotta pancakes', qty: 2, price: 17 }], total: 34, status: 'ready', type: 'Room service', created_at: new Date(Date.now() - 1200000).toISOString(), notes: 'Extra maple syrup' },
  { id: 'k4', order_number: 'A15', customer_name: 'Eliza Tan', room: '402', items: [{ name: 'Wild mushroom pasta', qty: 2, price: 28 }], total: 56, status: 'completed', type: 'Restaurant', created_at: new Date(Date.now() - 1800000).toISOString(), notes: '' },
  { id: 'k5', order_number: 'A16', customer_name: 'Daniel Cohen', room: '201', items: [{ name: 'Avocado toast', qty: 1, price: 15 }, { name: 'Miso salmon bowl', qty: 1, price: 24 }], total: 39, status: 'pending', type: 'Room service', created_at: new Date(Date.now() - 300000).toISOString(), notes: '' }
]
async function api(path, options = {}, fallback) { try { const token = localStorage.getItem('hh_token'); const response = await fetch(`/api${path}`, { ...options, headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...(options.headers || {}) } }); if (!response.ok) throw new Error('API unavailable'); return await response.json() } catch { return typeof fallback === 'function' ? fallback() : fallback } }
function persist(key, data) { localStorage.setItem(`hh_${key}`, JSON.stringify(data)); return data }

function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('hh_session') || 'null'))
  const [favorites, setFavorites] = useState(() => JSON.parse(localStorage.getItem('hh_favorites') || '[]'))
  const [authMode, setAuthMode] = useState('login')
  const [toast, setToast] = useState('')
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 2800) }
  const toggleFavorite = (id) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      localStorage.setItem('hh_favorites', JSON.stringify(next))
      return next
    })
  }
  const authenticate = async (data, mode) => {
    const users = local.users()
    if (mode === 'signup') { if (users.some(u => u.email === data.email)) return notify('An account with this email already exists.'); const result = await api('/auth/register', { method: 'POST', body: JSON.stringify(data) }, null); const next = result?.user || { id: `u${Date.now()}`, name: data.name, email: data.email, password: data.password, role: 'customer' }; if (result?.token) localStorage.setItem('hh_token', result.token); persist('users', [...users, next]); setUser(next); localStorage.setItem('hh_session', JSON.stringify(next)); return }
    const result = await api('/auth/login', { method: 'POST', body: JSON.stringify(data) }, () => { const found = users.find(u => u.email.toLowerCase() === data.email.toLowerCase() && u.password === data.password); return found ? { user: found } : null })
    const found = result?.user || result
    if (!found) return notify('Please check your email and password.'); if (result?.token) localStorage.setItem('hh_token', result.token); setUser(found); localStorage.setItem('hh_session', JSON.stringify(found)); notify(`Welcome back, ${found.name.split(' ')[0]}`)
  }
  if (!user) return <><Auth mode={authMode} setMode={setAuthMode} onSubmit={authenticate} />{toast && <div className="toast">{toast}</div>}</>
  return <><Portal user={user} favorites={favorites} toggleFavorite={toggleFavorite} logout={() => { setUser(null); localStorage.removeItem('hh_session') }} notify={notify} />{toast && <div className="toast">{toast}</div>}</>
}

function Auth({ mode, setMode, onSubmit }) {
  const signup = mode === 'signup'
  return <div className="auth-shell"><div className="auth-visual"><div className="brand light"><span className="brand-mark"><Sparkles size={17} /></span> harbor house</div><div className="visual-copy"><p className="eyebrow">STAY CURIOUS</p><h1>Arrive as a guest.<br /><i>Leave as family.</i></h1><p>Thoughtful stays, local flavors, and the city at your doorstep.</p></div><div className="visual-foot"><span>San Francisco · Est. 1987</span><span>★★★★★</span></div></div><div className="auth-panel"><div className="auth-form"><div className="mobile-logo brand"><span className="brand-mark"><Sparkles size={17} /></span> harbor house</div><p className="eyebrow">{signup ? 'CREATE YOUR ACCOUNT' : 'WELCOME BACK'}</p><h2>{signup ? 'Make yourself at home.' : 'Your next stay awaits.'}</h2><p className="auth-sub">{signup ? 'Join Harbor House for a more personal stay.' : 'Sign in to manage your stays and experiences.'}</p><form onSubmit={e => { e.preventDefault(); const d = Object.fromEntries(new FormData(e.currentTarget)); onSubmit(d, mode) }}>{signup && <Field label="Full name" name="name" placeholder="Your name" required />}<Field label="Email address" name="email" type="email" placeholder="you@example.com" required /><Field label="Password" name="password" type="password" placeholder="••••••••" required /><div className="form-meta"><label className="check"><input type="checkbox" defaultChecked /> <span>Remember me</span></label>{!signup && <a href="#" onClick={e => e.preventDefault()}>Forgot password?</a>}</div><button className="primary-btn wide" type="submit">{signup ? 'Create account' : 'Sign in'} <ArrowRight size={17} /></button></form><p className="switch-auth">{signup ? 'Already have an account?' : 'New to Harbor House?'} <button onClick={() => setMode(signup ? 'login' : 'signup')}>{signup ? 'Sign in' : 'Create an account'}</button></p><div className="demo-note"><ShieldCheck size={15} /> Super admin: admin@gmail.com · test1234</div></div></div></div>
}
function Field({ label, ...props }) { return <label className="field"><span>{label}</span><input {...props} /></label> }

function Portal({ user, favorites, toggleFavorite, logout, notify }) {
  const admin = ['admin', 'super_admin'].includes(user.role)
  const [page, setPage] = useState(admin ? 'Overview' : 'Discover')
  const [bookings, setBookings] = useState(local.bookings)
  const [orders, setOrders] = useState(local.orders)
  const [cabBookings, setCabBookings] = useState(local.cabs)
  const [cart, setCart] = useState([])
  const [showBooking, setShowBooking] = useState(false)
  const [search, setSearch] = useState('')
  const addBooking = (event) => { event.preventDefault(); const d = Object.fromEntries(new FormData(event.currentTarget)); const next = [{ id: Date.now(), userId: user.id, guest: d.guest || user.name, property: d.property, room: d.room, checkIn: d.checkIn, checkOut: d.checkOut, status: 'Reserved', total: d.room === 'Garden Suite' ? 920 : 855 }, ...bookings]; setBookings(persist('bookings', next)); setShowBooking(false); notify('Stay reserved — we look forward to welcoming you.') }
  const [tasks, setTasks] = useState(local.tasks)
  const [showTask, setShowTask] = useState(false)
  const updateTask = (id, patch) => { setTasks(persist('tasks', tasks.map(t => t.id === id ? { ...t, ...patch } : t))) }
  const addTask = (event) => { event.preventDefault(); const d = Object.fromEntries(new FormData(event.currentTarget)); const next = [{ id: Date.now(), property: d.property || 'Harbor House', room_number: d.room_number, task_type: d.task_type, status: 'pending', priority: d.priority || 'normal', assignee: d.assignee || null, notes: d.notes || '', due_at: d.due_at || null }, ...tasks]; setTasks(persist('tasks', next)); setShowTask(false); notify(`Task added for Room ${d.room_number}.`) }
  const removeTask = (id) => { setTasks(persist('tasks', tasks.filter(t => t.id !== id))); notify('Task removed.') }
  const updateOrderStatus = (id, status) => { setOrders(persist('orders', orders.map(o => o.id === id ? { ...o, status } : o))); notify(`Order ${status.toLowerCase()}.`) }
  const [payments, setPayments] = useState(local.payments)
  const [payTarget, setPayTarget] = useState(null)
  const openPay = (t) => setPayTarget(t)
  const closePay = () => setPayTarget(null)
  const addPayment = (entry) => {
    const next = [{ ...entry, id: entry.id || `p${Date.now()}`, created_at: entry.created_at || new Date().toISOString() }, ...payments]
    setPayments(persist('payments', next))
    notify(`Payment of $${Number(entry.amount).toFixed(2)} completed · ${entry.reference || 'TXN'}`)
    if (payTarget && payTarget.markPaid) payTarget.markPaid(entry)
    closePay()
  }
  const nav = admin ? [['Overview', LayoutDashboard], ['Reservations', CalendarDays], ['Housekeeping', BedDouble], ['Restaurant', Utensils], ['Payments', Receipt]] : [['Discover', Compass], ['My stays', CalendarDays], ['Dining', Utensils], ['Sightseeing', Car], ['Billing', Receipt]]
  return <div className="portal"><aside className="sidebar"><div className="brand"><span className="brand-mark"><Sparkles size={17} /></span> harbor house</div>{admin && <div className="property-switcher"><div className="property-icon">HH</div><div><strong>Harbor House</strong><span>San Francisco, CA</span></div><ChevronDown size={14} /></div>}<div className="menu-label">{admin ? 'Workspace' : 'Your journey'}</div><nav>{nav.map(([label, Icon]) => <button className={`nav-item ${page === label ? 'active' : ''}`} key={label} onClick={() => setPage(label)}><Icon size={17} /><span>{label}</span>{label === 'Reservations' && bookings.length > 0 && <em>{bookings.length}</em>}</button>)}</nav>{admin && <><div className="menu-label second">Operations</div><nav>{[['Guests', Users]].map(([label, Icon]) => <button className={`nav-item ${page === label ? 'active' : ''}`} key={label} onClick={() => setPage(label)}><Icon size={17} /><span>{label}</span></button>)}</nav></>}<div className="sidebar-footer"><button className="nav-item" onClick={() => notify('Settings are coming soon')}><ShieldCheck size={17} /><span>Account & settings</span></button><div className="profile"><div className="avatar avatar-user">{user.name.split(' ').map(x => x[0]).join('').slice(0, 2)}</div><div><strong>{user.name}</strong><span>{admin ? 'Administrator' : 'Guest member'}</span></div><button className="logout" onClick={logout}><LogOut size={15} /></button></div></div></aside><main className="main-content"><header className="topbar"><div className="mobile-brand brand"><span className="brand-mark"><Sparkles size={14} /></span> harbor house</div><div className="breadcrumb"><span>{admin ? 'Workspace' : 'Harbor House'}</span><b>/</b><strong>{page}</strong></div><div className="top-actions"><div className="top-search"><Search size={16} /><input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} /></div><button className="icon-btn" onClick={() => notify('You are all caught up')}><Bell size={18} /><i /></button><div className="date-pill"><MapPin size={14} /> San Francisco <ChevronDown size={13} /></div></div></header><div className="page-content">{admin ? <AdminPage page={page} user={user} bookings={bookings} tasks={tasks} updateTask={updateTask} removeTask={removeTask} orders={orders} updateOrderStatus={updateOrderStatus} payments={payments} addPayment={addPayment} openPay={openPay} closePay={closePay} payTarget={payTarget} setShowBooking={setShowBooking} setShowTask={setShowTask} search={search} notify={notify} /> : <CustomerPage page={page} user={user} bookings={bookings} setBookings={setBookings} orders={orders} setOrders={setOrders} cabBookings={cabBookings} setCabBookings={setCabBookings} cart={cart} setCart={setCart} setShowBooking={setShowBooking} search={search} favorites={favorites} toggleFavorite={toggleFavorite} payments={payments} addPayment={addPayment} openPay={openPay} notify={notify} />}</div></main>{showBooking && <BookingModal onClose={() => setShowBooking(false)} onSubmit={addBooking} admin={admin} />}{showTask && <TaskModal onClose={() => setShowTask(false)} onSubmit={addTask} />}{payTarget && <PaymentModal onClose={closePay} target={payTarget} onSubmit={addPayment} />}</div>
}

function CustomerPage({ page, user, bookings, setBookings, orders, setOrders, cabBookings, setCabBookings, cart, setCart, setShowBooking, search, favorites, toggleFavorite, payments, addPayment, openPay, notify }) {
  const mine = bookings.filter(b => b.userId === user.id); const filtered = properties.filter(p => `${p.name} ${p.city}`.toLowerCase().includes(search.toLowerCase()))
  if (page === 'Dining') return <Dining cart={cart} setCart={setCart} orders={orders} setOrders={setOrders} notify={notify} />
  if (page === 'Sightseeing') return <Sightseeing cabBookings={cabBookings} setCabBookings={setCabBookings} notify={notify} />
  if (page === 'My stays') return <Stays bookings={mine} setShowBooking={setShowBooking} openPay={openPay} />
  if (page === 'Billing') return <BillingPage bookings={mine} orders={orders} payments={payments} openPay={openPay} notify={notify} />
  return <><div className="hero-row"><div><p className="eyebrow">{page === 'Discover' ? 'GOOD MORNING, ' + user.name.split(' ')[0].toUpperCase() : 'YOUR PRIVATE CONCIERGE'}</p><h1>Make room for <i>beautiful</i> days.</h1><p className="subheading">Find a stay that feels like it was made for you.</p></div><button className="primary-btn" onClick={() => setShowBooking(true)}><Plus size={17} /> Plan a stay</button></div><section className="search-card"><div><MapPin size={18} /><label>Where are you going?<input placeholder="San Francisco, California" /></label></div><div><CalendarDays size={18} /><label>Dates<input placeholder="Add dates" /></label></div><button className="primary-btn">Search stays <ArrowRight size={16} /></button></section><div className="section-title"><div><h2>Stay somewhere wonderful</h2><p>Handpicked properties for your next chapter</p></div><button className="text-btn">View all <ArrowRight size={15} /></button></div><div className="property-grid">{filtered.map(p => <article className="property-card" key={p.id}><div className="property-image"><img src={p.image} alt={p.name} /><span className="image-badge"><Star size={12} fill="currentColor" /> {p.rating}</span><button className={`heart ${favorites?.includes(p.id) ? 'favorited' : ''}`} onClick={() => toggleFavorite(p.id)} aria-label="Save">{favorites?.includes(p.id) ? '♥' : '♡'}</button></div><div className="property-info"><div><p>{p.type}</p><h3>{p.name}</h3><span><MapPin size={12} /> {p.city}</span></div><div className="price"><strong>${p.price}</strong><small> / night</small></div></div><div className="tags">{p.tags.map(t => <span key={t}>{t}</span>)}</div><button className="outline-btn" onClick={() => setShowBooking(true)}>View rooms <ArrowRight size={14} /></button></article>)}</div></>
}
function Stays({ bookings, setShowBooking, openPay }) { return <><div className="hero-row"><div><p className="eyebrow">YOUR JOURNEY</p><h1>Stays worth <i>remembering.</i></h1><p className="subheading">Everything you need for a seamless visit.</p></div><button className="primary-btn" onClick={() => setShowBooking(true)}><Plus size={17} /> New reservation</button></div><div className="section-title"><div><h2>Your reservations</h2><p>{bookings.length ? 'Your upcoming and past stays' : 'Your next chapter starts here'}</p></div></div><div className="stay-list">{bookings.length ? bookings.map(b => <div className="stay-card" key={b.id}><div className="stay-date"><strong>{new Date(b.checkIn || Date.now()).toLocaleDateString('en-US', { month: 'short', day: '2-digit' })}</strong><span>CHECK IN</span></div><div className="stay-main"><div><h3>{b.property || 'Harbor House'}</h3><p><BedDouble size={14} /> {b.room} · {b.checkIn} — {b.checkOut}</p></div><span className="status reserved">{b.status}</span></div>{b.paid ? (
                <span className="status confirmed">Paid</span>
              ) : (
                <button className="primary-btn rk-pay-mini" onClick={() => openPay({ kind: 'stay', bookingId: b.id, amount: b.total || 855, title: b.property || 'Harbor House', subtitle: b.room || 'Deluxe King', markPaid: () => { b.paid = true; } })}>
                  <CreditCard size={13} /> Pay now
                </button>
              )}
              <button className="icon-btn"><ArrowRight size={18} /></button></div>) : <div className="empty-card"><CalendarDays size={30} /><h3>No stays yet</h3><p>Find your perfect room and start planning.</p><button className="primary-btn" onClick={() => setShowBooking(true)}>Browse stays</button></div>}</div></> }

function Dining({ cart, setCart, orders, setOrders, notify }) { const [meal, setMeal] = useState('Breakfast'); const add = d => { setCart([...cart, d]); notify(`${d.name} added to your order`) }; const submit = () => { if (!cart.length) return; const next = [{ id: Date.now(), items: cart, total: cart.reduce((a, d) => a + d.price, 0), status: 'Preparing' }, ...orders]; setOrders(persist('orders', next)); setCart([]); notify('Order sent to the kitchen') }; return <><div className="hero-row"><div><p className="eyebrow">IN-ROOM DINING</p><h1>A table for <i>every mood.</i></h1><p className="subheading">Fresh, local, and delivered wherever you are.</p></div><div className="order-pill"><Utensils size={16} /><strong>{cart.length}</strong> items · ${cart.reduce((a, d) => a + d.price, 0)}</div></div><div className="tabs">{['Breakfast', 'Lunch', 'Dinner'].map(x => <button className={meal === x ? 'selected' : ''} onClick={() => setMeal(x)} key={x}>{x}</button>)}</div><div className="dining-layout"><div className="menu-grid">{dishes.filter(d => d.meal === meal).map(d => <article className="dish-card" key={d.name}><div className="dish-icon">{d.icon}</div><div><span className="meal-label">{d.meal}</span><h3>{d.name}</h3><p>{d.desc}</p><strong>${d.price}</strong></div><button className="add-btn" onClick={() => add(d)}><Plus size={17} /></button></article>)}</div><aside className="order-card"><h3>Your order</h3>{cart.length ? <>{cart.map((d, i) => <div className="order-line" key={`${d.name}-${i}`}><span>{d.name}</span><strong>${d.price}</strong></div>)}<div className="order-total"><span>Total</span><strong>${cart.reduce((a, d) => a + d.price, 0)}</strong></div><button className="primary-btn wide" onClick={submit}>Place order <ArrowRight size={15} /></button></> : <div className="order-empty"><Coffee size={24} /><p>Your order is empty.</p><small>Add a dish to get started.</small></div>}</aside></div></> }

function Sightseeing({ cabBookings, setCabBookings, notify }) { const book = c => { const next = [{ ...c, id: Date.now(), status: 'Confirmed' }, ...cabBookings]; setCabBookings(persist('cabs', next)); notify(`${c.name} booked — your driver will meet you in the lobby.`) }; return <><div className="hero-row"><div><p className="eyebrow">THE CITY, YOUR WAY</p><h1>Go beyond the <i>front door.</i></h1><p className="subheading">Private sightseeing journeys, curated by our concierge.</p></div></div><div className="cab-grid">{cabs.map(c => <article className="cab-card" key={c.name}><img src={c.image} /><div className="cab-info"><span><Clock3 size={13} /> {c.time}</span><h3>{c.name}</h3><div><strong>${c.price}</strong> <small>per car</small><button className="primary-btn" onClick={() => book(c)}>Book ride</button></div></div></article>)}</div></> }

function AdminPage({ page, user, bookings, tasks, updateTask, removeTask, orders, updateOrderStatus, payments, addPayment, openPay, closePay, payTarget, setShowBooking, setShowTask, search, notify }) {
  if (page === 'Housekeeping') return <HousekeepingPage tasks={tasks} updateTask={updateTask} removeTask={removeTask} setShowTask={setShowTask} search={search} notify={notify} />;
  if (page === 'Restaurant') return <RestaurantPage orders={orders} updateOrderStatus={updateOrderStatus} notify={notify} />;
  if (page === 'Payments') return <PaymentsPage payments={payments} addPayment={addPayment} openPay={openPay} notify={notify} />;
  if (page === 'Guests') return <GuestsPage bookings={bookings} search={search} notify={notify} />;
  if (page === 'Reservations') {
    const filtered = bookings.filter(b => `${b.guest} ${b.property} ${b.room}`.toLowerCase().includes(search.toLowerCase()));
    return (
      <>
        <div className="hero-row">
          <div>
            <p className="eyebrow">{page.toUpperCase()}</p>
            <h1>Keep every detail <i>beautifully handled.</i></h1>
            <p className="subheading">A clear view of your hotel's moving parts.</p>
          </div>
          <button className="primary-btn" onClick={() => setShowBooking(true)}><Plus size={17} /> Create booking</button>
        </div>
        <div className="panel large-panel">
          <div className="panel-heading"><div><h2>All reservations</h2><p>{filtered.length} stays in the system</p></div><button className="outline-btn">Export report</button></div>
          <BookingTable bookings={filtered} />
        </div>
      </>
    );
  }
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
  const firstName = user?.name?.split(' ')[0] || 'there';
  const pendingTasks = tasks.filter(t => t.status !== 'completed').length;
  const kitchenQueue = orders.filter(o => ['pending','preparing','ready'].includes(String(o.status).toLowerCase())).length;
  return (
    <>
      <div className="hero-row">
        <div>
          <p className="eyebrow">{today.toUpperCase()}</p>
          <h1>Good morning, {firstName} <span>✦</span></h1>
          <p className="subheading">Here's what's happening at Harbor House today.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowBooking(true)}><Plus size={17} /> New booking</button>
      </div>
      <div className="stats-grid">
        <Stat label="Occupancy" value="78.4%" change="+6.2%" icon={<BedDouble size={18} />} />
        <Stat label="Today's revenue" value="$12,840" change="+12.8%" icon={<span className="dollar">$</span>} />
        <Stat label="Open housekeeping" value={pendingTasks} change="rooms" icon={<BedDouble size={18} />} />
        <Stat label="Kitchen queue" value={kitchenQueue} change="orders" icon={<Utensils size={18} />} />
      </div>
      <div className="admin-grid">
        <div className="panel large-panel">
          <div className="panel-heading"><div><h2>Today's arrivals</h2><p>Guests checking in today</p></div></div>
          <BookingTable bookings={bookings.slice(0, 5)} />
        </div>
        <div className="panel activity-panel">
          <div className="panel-heading"><div><h2>Live activity</h2><p>Updates from your team</p></div><span className="live-indicator"><i /> Live</span></div>
          {tasks.slice(0, 4).map((t, i) => (
            <div className="activity-item" key={`act-${t.id}-${i}`}>
              <div className={`activity-icon ${['green','orange','purple','green'][i % 4]}`}><BedDouble size={16} /></div>
              <div><strong>Room {t.room_number} · {t.task_type}</strong><span>{t.status === 'completed' ? 'Completed' : t.status === 'in_progress' ? 'In progress' : 'Pending'} · {t.assignee || 'Unassigned'}</span></div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function Stat({ label, value, change, icon }) { return <div className="stat-card"><div className="stat-top"><span>{label}</span><div className="stat-icon">{icon}</div></div><div className="stat-value">{value}</div><div className="stat-bottom"><span className="positive">↗ {change}</span><span>vs. last month</span></div></div> }
function BookingTable({ bookings }) { return <div className="table-wrap"><table><thead><tr><th>GUEST</th><th>PROPERTY / ROOM</th><th>STAY</th><th>STATUS</th></tr></thead><tbody>{bookings.map((b, i) => <tr key={b.id || i}><td><div className="guest-cell"><div className="avatar avatar-user">{(b.guest || 'NG').split(' ').map(x => x[0]).join('').slice(0, 2)}</div><strong>{b.guest}</strong></div></td><td>{b.property || 'Harbor House'} · {b.room || 'Deluxe King'}</td><td>{b.checkIn || 'Oct 12'} — {b.checkOut || 'Oct 16'}</td><td><span className="status reserved">{b.status || 'Reserved'}</span></td></tr>)}</tbody></table>{!bookings.length && <div className="empty-state">No bookings yet.</div>}</div> }
function BookingModal({ onClose, onSubmit, admin }) { return <div className="modal-backdrop" onClick={onClose}><div className="booking-modal" onClick={e => e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">{admin ? 'RESERVATION DESK' : 'YOUR RESERVATION'}</p><h2>Plan your stay</h2></div><button className="close-btn" onClick={onClose}><X size={18} /></button></div><form onSubmit={onSubmit}>{admin && <Field label="Guest name" name="guest" placeholder="e.g. Taylor Morgan" required />}<label className="field"><span>Property</span><select name="property" defaultValue="Harbor House"><option>Harbor House</option><option>The Juniper Lodge</option><option>Casa Sol</option></select></label><label className="field"><span>Room type</span><select name="room" defaultValue="Deluxe King"><option>Deluxe King</option><option>Garden Suite</option><option>Classic Queen</option><option>Harbor View</option></select></label><div className="form-row"><Field label="Check-in" name="checkIn" type="date" required /><Field label="Check-out" name="checkOut" type="date" required /></div><button className="primary-btn wide" type="submit"><Check size={17} /> Confirm reservation</button></form></div></div> }


function HousekeepingPage({ tasks, updateTask, removeTask, setShowTask, search, notify }) {
  const [filter, setFilter] = useState('all');
  const list = tasks.filter(t => filter === 'all' ? true : t.status === filter);
  const filtered = list.filter(t => `${t.room_number} ${t.task_type} ${t.assignee || ''} ${t.notes || ''}`.toLowerCase().includes(search.toLowerCase()));
  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
  const taskIcons = { clean: <SprayCan size={15} />, inspect: <Search size={15} />, restock: <Tag size={15} />, maintenance: <Wrench size={15} />, turndown: <Moon size={15} /> };
  const taskLabels = { clean: 'Clean', inspect: 'Inspect', restock: 'Restock', maintenance: 'Maintenance', turndown: 'Turndown' };
  const priorityColors = { urgent: '#d77a6d', high: '#e7a078', normal: '#1f6b62', low: '#87a48c' };
  return (
    <>
      <div className="hero-row">
        <div>
          <p className="eyebrow">HOUSEKEEPING</p>
          <h1>Rooms <i>ready</i> for every guest.</h1>
          <p className="subheading">Coordinate cleaning, inspections, and maintenance across your property.</p>
        </div>
        <button className="primary-btn" onClick={() => setShowTask(true)}><Plus size={17} /> New task</button>
      </div>
      <div className="stats-grid hk-stats">
        <Stat label="Pending" value={counts.pending} change="rooms" icon={<Clock3 size={18} />} />
        <Stat label="In progress" value={counts.in_progress} change="staff working" icon={<BedDouble size={18} />} />
        <Stat label="Completed" value={counts.completed} change="today" icon={<Check size={18} />} />
        <Stat label="Urgent" value={tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length} change="action needed" icon={<Wrench size={18} />} />
      </div>
      <div className="tabs hk-tabs">
        {[['all',`All (${counts.all})`],['pending',`Pending (${counts.pending})`],['in_progress',`In progress (${counts.in_progress})`],['completed',`Completed (${counts.completed})`]].map(([key,label]) => (
          <button key={key} className={filter === key ? 'selected' : ''} onClick={() => setFilter(key)}>{label}</button>
        ))}
      </div>
      <div className="hk-list">
        {filtered.length ? filtered.map(t => (
          <article className={`hk-card status-${t.status}`} key={t.id}>
            <div className="hk-card-head">
              <div className="hk-room">
                <div className="hk-room-num">{t.room_number}</div>
                <div>
                  <p className="eyebrow hk-eyebrow">{t.property}</p>
                  <h3>{taskLabels[t.task_type] || t.task_type}</h3>
                </div>
              </div>
              <div className="hk-priority" style={{ background: priorityColors[t.priority] }}>{t.priority}</div>
            </div>
            {t.notes && <p className="hk-notes">{t.notes}</p>}
            <div className="hk-meta">
              <span className="hk-meta-item"><Users size={13} /> {t.assignee || 'Unassigned'}</span>
              {t.due_at && <span className="hk-meta-item"><Clock3 size={13} /> {new Date(t.due_at).toLocaleString('en-US', { hour: 'numeric', minute: '2-digit', month: 'short', day: 'numeric' })}</span>}
              <span className={`status-${t.status} hk-status`}>{t.status.replace('_', ' ')}</span>
            </div>
            <div className="hk-actions">
              {t.status === 'pending' && <button className="outline-btn" onClick={() => { updateTask(t.id, { status: 'in_progress' }); notify(`Room ${t.room_number} marked in progress.`); }}><SprayCan size={13} /> Start</button>}
              {t.status === 'in_progress' && <button className="primary-btn" onClick={() => { updateTask(t.id, { status: 'completed' }); notify(`Room ${t.room_number} marked complete.`); }}><Check size={13} /> Mark complete</button>}
              {t.status === 'completed' && <button className="outline-btn" disabled><Check size={13} /> Done</button>}
              <button className="icon-btn hk-delete" onClick={() => removeTask(t.id)} aria-label="Delete task"><Trash2 size={15} /></button>
            </div>
            <div className="hk-icon-bg">{taskIcons[t.task_type] || <BedDouble size={20} />}</div>
          </article>
        )) : <div className="empty-card"><BedDouble size={28} /><h3>No tasks here</h3><p>Add a task to get started.</p><button className="primary-btn" onClick={() => setShowTask(true)}>Create task</button></div>}
      </div>
    </>
  );
}

function RestaurantPage({ orders, updateOrderStatus, notify }) {
  const [tab, setTab] = useState('queue');
  const localKitchen = (() => { try { return JSON.parse(localStorage.getItem("hh_orders") || "[]"); } catch { return []; } })();
  const seedKitchen = [
    { id: 'k1', order_number: 'A12', customer_name: 'Jordan Lee', room: '208', items: [{ name: 'Avocado toast', qty: 2, price: 15 }, { name: 'Miso salmon bowl', qty: 1, price: 24 }], total: 54, status: 'pending', type: 'Room service', created_at: new Date(Date.now() - 600000).toISOString() },
    { id: 'k2', order_number: 'A13', customer_name: 'Aanya Patel', room: '312', items: [{ name: 'Garden caesar', qty: 1, price: 16 }, { name: 'Pacific cod', qty: 1, price: 32 }], total: 48, status: 'preparing', type: 'Restaurant', created_at: new Date(Date.now() - 900000).toISOString() },
    { id: 'k3', order_number: 'A14', customer_name: 'Marcus Reed', room: '105', items: [{ name: 'Lemon ricotta pancakes', qty: 2, price: 17 }], total: 34, status: 'ready', type: 'Room service', created_at: new Date(Date.now() - 1200000).toISOString() },
    { id: 'k4', order_number: 'A15', customer_name: 'Eliza Tan', room: '402', items: [{ name: 'Wild mushroom pasta', qty: 2, price: 28 }], total: 56, status: 'completed', type: 'Restaurant', created_at: new Date(Date.now() - 1800000).toISOString() },
    { id: 'k5', order_number: 'A16', customer_name: 'Daniel Cohen', room: '201', items: [{ name: 'Avocado toast', qty: 1, price: 15 }, { name: 'Miso salmon bowl', qty: 1, price: 24 }], total: 39, status: 'pending', type: 'Room service', created_at: new Date(Date.now() - 300000).toISOString() }
  ];
  const kitchenOrders = orders.length === 0 ? seedKitchen : orders;
  const normalized = kitchenOrders.map(o => ({ ...o, statusKey: String(o.status || 'pending').toLowerCase(), order_number: o.order_number || `A${o.id}`, customer_name: o.customer_name || 'Guest', items: o.items || [], type: o.type || (o.room_number ? 'Room service' : 'Restaurant'), created_at: o.created_at || new Date().toISOString() }));
  const counts = { queue: normalized.filter(o => ['pending','preparing','ready'].includes(o.statusKey)).length, pending: normalized.filter(o => o.statusKey === 'pending').length, preparing: normalized.filter(o => o.statusKey === 'preparing').length, ready: normalized.filter(o => o.statusKey === 'ready').length, completed: normalized.filter(o => o.statusKey === 'completed' || o.statusKey === 'completed').length };
  const todayRevenue = normalized.filter(o => o.statusKey === 'completed').reduce((s, o) => s + Number(o.total || 0), 0);
  let list = normalized;
  if (tab === 'pending') list = normalized.filter(o => o.statusKey === 'pending');
  else if (tab === 'preparing') list = normalized.filter(o => o.statusKey === 'preparing');
  else if (tab === 'ready') list = normalized.filter(o => o.statusKey === 'ready');
  else if (tab === 'completed') list = normalized.filter(o => o.statusKey === 'completed');
  else list = normalized.filter(o => ['pending','preparing','ready'].includes(o.statusKey));
  const minutesAgo = (iso) => Math.max(1, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  const advance = (o) => {
    const next = { pending: 'preparing', preparing: 'ready', ready: 'completed' }[o.statusKey];
    if (!next) return;
    updateOrderStatus(o.id, next);
  };
  return (
    <>
      <div className="hero-row">
        <div>
          <p className="eyebrow">RESTAURANT & KITCHEN</p>
          <h1>Keep every plate <i>exceptional.</i></h1>
          <p className="subheading">Live kitchen queue, room service, and today's revenue at a glance.</p>
        </div>
        <div className="order-pill"><Utensils size={16} /><strong>{counts.queue}</strong> orders in queue</div>
      </div>
      <div className="stats-grid">
        <Stat label="Pending" value={counts.pending} change="kitchen" icon={<Clock3 size={18} />} />
        <Stat label="Preparing" value={counts.preparing} change="chefs cooking" icon={<Utensils size={18} />} />
        <Stat label="Ready to serve" value={counts.ready} change="dispatch" icon={<Check size={18} />} />
        <Stat label="Revenue today" value={`$${todayRevenue}`} change="completed orders" icon={<span className="dollar">$</span>} />
      </div>
      <div className="tabs rk-tabs">
        {[['queue',`Live queue (${counts.queue})`],['pending',`Pending (${counts.pending})`],['preparing',`Preparing (${counts.preparing})`],['ready',`Ready (${counts.ready})`],['completed',`Completed (${counts.completed})`]].map(([k,l]) => (
          <button key={k} className={tab === k ? 'selected' : ''} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      <div className="rk-grid">
        {list.length ? list.map(o => (
          <article className={`rk-card rk-${o.statusKey}`} key={o.id}>
            <div className="rk-head">
              <div>
                <p className="eyebrow hk-eyebrow">Order {o.order_number}</p>
                <h3>{o.customer_name}</h3>
                <span className="rk-room">{o.type}{o.room ? ` · Room ${o.room}` : ''}</span>
              </div>
              <div className={`rk-status rk-status-${o.statusKey}`}>{o.statusKey.replace('_', ' ')}</div>
            </div>
            <div className="rk-items">
              {o.items.map((item, i) => (
                <div className="rk-item" key={`${o.id}-item-${i}`}>
                  <span className="rk-qty">{item.qty || 1}×</span>
                  <span className="rk-name">{item.name}</span>
                  <span className="rk-price">${(Number(item.price || 0) * Number(item.qty || 1)).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="rk-foot">
              <span><Clock3 size={13} /> {minutesAgo(o.created_at)} min ago</span>
              <strong>${Number(o.total || 0).toFixed(2)}</strong>
            </div>
            {['pending','preparing','ready'].includes(o.statusKey) ? (
              <button className="primary-btn wide rk-advance" onClick={() => advance(o)}>
                <ArrowRight size={14} /> {o.statusKey === 'pending' ? 'Start preparing' : o.statusKey === 'preparing' ? 'Mark ready' : 'Mark served'}
              </button>
            ) : (
              <div className="rk-done"><Check size={14} /> Order complete</div>
            )}
          </article>
        )) : <div className="empty-card"><Utensils size={28} /><h3>No orders here</h3><p>Orders will appear here in real time.</p></div>}
      </div>
    </>
  );
}

function GuestsPage({ bookings, search, notify }) {
  const map = {};
  for (const b of bookings) {
    const key = b.guest || 'Guest';
    if (!map[key]) map[key] = { name: key, stays: 0, lastRoom: b.room, lastStay: `${b.checkIn || '-'} – ${b.checkOut || '-'}`, status: b.status };
    map[key].stays += 1;
  }
  const guests = Object.values(map).filter(g => g.name.toLowerCase().includes(search.toLowerCase()));
  return (
    <>
      <div className="hero-row"><div><p className="eyebrow">GUESTS</p><h1>People who make <i>Harbor House</i> feel like home.</h1><p className="subheading">Every guest across every reservation.</p></div></div>
      <div className="panel large-panel">
        <div className="panel-heading"><div><h2>All guests</h2><p>{guests.length} returning and new guests</p></div><button className="outline-btn">Export</button></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>GUEST</th><th>STAYS</th><th>LAST ROOM</th><th>LAST STAY</th><th>STATUS</th></tr></thead>
            <tbody>
              {guests.map(g => (
                <tr key={g.name}>
                  <td><div className="guest-cell"><div className="avatar avatar-user">{g.name.split(' ').map(x => x[0]).join('').slice(0,2)}</div><strong>{g.name}</strong></div></td>
                  <td>{g.stays}</td>
                  <td>{g.lastRoom || 'Deluxe King'}</td>
                  <td>{g.lastStay || 'Oct 12 — Oct 16'}</td>
                  <td><span className="status reserved">{g.status || 'Reserved'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!guests.length && <div className="empty-state">No guests yet.</div>}
        </div>
      </div>
    </>
  );
}

function TaskModal({ onClose, onSubmit }) {
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div><p className="eyebrow">HOUSEKEEPING</p><h2>New task</h2></div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <form onSubmit={onSubmit}>
          <div className="form-row">
            <Field label="Property" name="property" defaultValue="Harbor House" required />
            <Field label="Room number" name="room_number" placeholder="e.g. 208" required />
          </div>
          <label className="field"><span>Task type</span><select name="task_type" defaultValue="clean"><option value="clean">Clean</option><option value="inspect">Inspect</option><option value="restock">Restock</option><option value="maintenance">Maintenance</option><option value="turndown">Turndown</option></select></label>
          <div className="form-row">
            <label className="field"><span>Priority</span><select name="priority" defaultValue="normal"><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></select></label>
            <Field label="Assignee" name="assignee" placeholder="Staff name (optional)" />
          </div>
          <Field label="Due (optional)" name="due_at" type="datetime-local" />
          <label className="field"><span>Notes</span><textarea name="notes" rows={3} placeholder="Add context for the team..." style={{borderRadius:10,padding:12,border:'1px solid #dfe8e5',font:'inherit',resize:'vertical'}}></textarea></label>
          <button className="primary-btn wide" type="submit"><Check size={17} /> Create task</button>
        </form>
      </div>
    </div>
  );
}



function BillingPage({ bookings, orders, payments, openPay, notify }) {
  const myStays = bookings;
  const myOrders = orders;
  const myPayments = payments;
  const pendingStays = myStays.filter(b => !b.paid);
  const pendingOrders = myOrders.filter(o => !o.paid);
  const pendingTotal = pendingStays.reduce((s, b) => s + Number(b.total || 0), 0)
    + pendingOrders.reduce((s, o) => s + Number(o.total || 0), 0);
  const completedPayments = myPayments.filter(p => p.status === 'completed');
  const paidTotal = completedPayments.reduce((s, p) => s + Number(p.amount || 0), 0);
  return (
    <>
      <div className="hero-row">
        <div>
          <p className="eyebrow">BILLING</p>
          <h1>Pay for your <i>stay</i> with one tap.</h1>
          <p className="subheading">Manage outstanding charges, receipts, and saved payment methods.</p>
        </div>
      </div>
      <div className="stats-grid">
        <Stat label="Outstanding" value={`$${pendingTotal.toFixed(2)}`} change="unpaid" icon={<Receipt size={18} />} />
        <Stat label="Paid lifetime" value={`$${paidTotal.toFixed(2)}`} change={`${completedPayments.length} payments`} icon={<Check size={18} />} />
        <Stat label="Saved methods" value="2" change="card · UPI" icon={<CreditCard size={18} />} />
        <Stat label="Next charge" value={pendingTotal > 0 ? "Today" : "—"} change="auto-update" icon={<Clock3 size={18} />} />
      </div>

      <div className="section-title"><div><h2>Pending charges</h2><p>Invoices awaiting payment</p></div></div>
      <div className="bill-grid">
        {pendingStays.length === 0 && pendingOrders.length === 0 ? (
          <div className="empty-card"><Check size={28} /><h3>You're all paid up</h3><p>No outstanding charges right now.</p></div>
        ) : (
          <>
            {pendingStays.map(b => (
              <article className="bill-card pending" key={`stay-${b.id}`}>
                <div className="bill-head">
                  <div>
                    <p className="eyebrow hk-eyebrow">{b.property || 'Harbor House'}</p>
                    <h3>{b.room || 'Deluxe King'}</h3>
                    <span><CalendarDays size={12} /> {b.checkIn || '—'} → {b.checkOut || '—'}</span>
                  </div>
                  <span className="rk-status rk-status-pending">Pending</span>
                </div>
                <div className="bill-meta"><span>Stay</span><strong>${Number(b.total || 855).toFixed(2)}</strong></div>
                <button className="primary-btn wide" onClick={() => openPay({ kind: 'stay', bookingId: b.id, amount: Number(b.total || 855), title: b.property || 'Harbor House', subtitle: b.room || 'Deluxe King', markPaid: () => { b.paid = true; } })}>
                  <CreditCard size={14} /> Pay ${Number(b.total || 855).toFixed(2)}
                </button>
              </article>
            ))}
            {pendingOrders.map(o => (
              <article className="bill-card pending" key={`order-${o.id}`}>
                <div className="bill-head">
                  <div>
                    <p className="eyebrow hk-eyebrow">In-room dining</p>
                    <h3>Order #{o.id}</h3>
                    <span><Utensils size={12} /> {(o.items || []).map(i => i.name).slice(0,2).join(', ') || '—'}</span>
                  </div>
                  <span className="rk-status rk-status-pending">Pending</span>
                </div>
                <div className="bill-meta"><span>Order</span><strong>${Number(o.total || 0).toFixed(2)}</strong></div>
                <button className="primary-btn wide" onClick={() => openPay({ kind: 'order', orderId: o.id, amount: Number(o.total || 0), title: 'In-room dining', subtitle: `Order #${o.id}`, markPaid: () => { o.paid = true; } })}>
                  <CreditCard size={14} /> Pay ${Number(o.total || 0).toFixed(2)}
                </button>
              </article>
            ))}
          </>
        )}
      </div>

      <div className="section-title" style={{ marginTop: 36 }}><div><h2>Payment history</h2><p>Receipts for completed transactions</p></div></div>
      <div className="panel large-panel">
        <div className="panel-heading"><div><h2>All transactions</h2><p>{myPayments.length} payments</p></div></div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>REFERENCE</th><th>DESCRIPTION</th><th>METHOD</th><th>AMOUNT</th><th>STATUS</th><th>DATE</th></tr></thead>
            <tbody>
              {myPayments.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.reference}</strong></td>
                  <td>{p.description}</td>
                  <td><span className="method-chip method-{p.method || 'card'}">{p.method === 'upi' ? 'UPI' : p.method === 'wallet' ? 'Wallet' : p.method === 'cash' ? 'Cash' : 'Card'}{p.card_last4 ? ` · ${p.card_last4}` : ''}</span></td>
                  <td><strong>${Number(p.amount).toFixed(2)}</strong></td>
                  <td><span className={`status ${p.status === 'completed' ? 'confirmed' : p.status === 'failed' ? 'pending' : 'reserved'}`}>{p.status}</span></td>
                  <td>{new Date(p.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!myPayments.length && <div className="empty-state">No payments yet.</div>}
        </div>
      </div>
    </>
  );
}

function PaymentsPage({ payments, addPayment, openPay, notify }) {
  const totalRevenue = payments.filter(p => p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0);
  const pending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + Number(p.amount), 0);
  const failed = payments.filter(p => p.status === 'failed').length;
  const byMethod = ['card', 'upi', 'wallet', 'cash'].map(m => ({
    method: m,
    total: payments.filter(p => p.method === m && p.status === 'completed').reduce((s, p) => s + Number(p.amount), 0),
    count: payments.filter(p => p.method === m && p.status === 'completed').length
  }));
  const methodLabel = (m) => m === 'upi' ? 'UPI' : m === 'wallet' ? 'Wallet' : m === 'cash' ? 'Cash' : 'Card';
  return (
    <>
      <div className="hero-row">
        <div>
          <p className="eyebrow">PAYMENTS</p>
          <h1>Every dollar, <i>beautifully</i> tracked.</h1>
          <p className="subheading">Revenue overview, processing fees, and customer transactions.</p>
        </div>
        <button className="primary-btn" onClick={() => openPay({ kind: 'manual', amount: 100, title: 'Manual charge', subtitle: 'Ad-hoc payment' })}>
          <Plus size={17} /> Record payment
        </button>
      </div>
      <div className="stats-grid">
        <Stat label="Total revenue" value={`$${totalRevenue.toFixed(2)}`} change={`${payments.filter(p => p.status === 'completed').length} payments`} icon={<span className="dollar">$</span>} />
        <Stat label="Outstanding" value={`$${pending.toFixed(2)}`} change="awaiting" icon={<Clock3 size={18} />} />
        <Stat label="Failed" value={failed} change="retry" icon={<Receipt size={18} />} />
        <Stat label="Avg. ticket" value={`$${(payments.length ? (totalRevenue / payments.filter(p => p.status === 'completed').length || 0) : 0).toFixed(2)}`} change="per charge" icon={<Banknote size={18} />} />
      </div>
      <div className="admin-grid">
        <div className="panel large-panel">
          <div className="panel-heading"><div><h2>Recent transactions</h2><p>{payments.length} payments in the system</p></div><button className="text-btn" onClick={() => notify('Exporting report')}><ArrowRight size={14} /> Export</button></div>
          <div className="table-wrap">
            <table>
              <thead><tr><th>CUSTOMER</th><th>DESCRIPTION</th><th>METHOD</th><th>AMOUNT</th><th>STATUS</th><th>REFERENCE</th></tr></thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id}>
                    <td><div className="guest-cell"><div className="avatar avatar-user">{(p.customer_name || 'Guest').split(' ').map(x => x[0]).join('').slice(0,2)}</div><strong>{p.customer_name || 'Guest'}</strong></div></td>
                    <td>{p.description}</td>
                    <td><span className={`method-chip method-${p.method || 'card'}`}>{methodLabel(p.method)}{p.card_last4 ? ` · ${p.card_last4}` : ''}</span></td>
                    <td><strong>${Number(p.amount).toFixed(2)}</strong></td>
                    <td><span className={`status ${p.status === 'completed' ? 'confirmed' : p.status === 'failed' ? 'pending' : 'reserved'}`}>{p.status}</span></td>
                    <td><code>{p.reference}</code></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!payments.length && <div className="empty-state">No payments yet.</div>}
          </div>
        </div>
        <div className="panel">
          <div className="panel-heading"><div><h2>Revenue by method</h2><p>Completed payments</p></div></div>
          <div className="method-list">
            {byMethod.map(m => (
              <div className="method-row" key={m.method}>
                <div className={`method-icon method-${m.method}`}>
                  {m.method === 'card' ? <CreditCard size={18} /> : m.method === 'upi' ? <Building2 size={18} /> : m.method === 'wallet' ? <Wallet size={18} /> : <Banknote size={18} />}
                </div>
                <div className="method-info">
                  <strong>{methodLabel(m.method)}</strong>
                  <span>{m.count} transactions</span>
                  <div className="method-bar"><i style={{ width: `${totalRevenue ? (m.total / totalRevenue) * 100 : 0}%` }} /></div>
                </div>
                <strong className="method-total">${m.total.toFixed(2)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function PaymentModal({ onClose, target, onSubmit }) {
  const [method, setMethod] = useState(target?.method || 'card');
  const [cardNumber, setCardNumber] = useState('4242 4242 4242 4242');
  const [cardName, setCardName] = useState('');
  const [cardExpiry, setCardExpiry] = useState('12/27');
  const [cardCvc, setCardCvc] = useState('123');
  const [upiId, setUpiId] = useState('');
  const [wallet, setWallet] = useState('paypal');
  const [processing, setProcessing] = useState(false);
  const amount = Number(target?.amount || 0);
  const submit = (e) => {
    e.preventDefault();
    setProcessing(true);
    setTimeout(() => {
      const reference = 'TXN' + Math.random().toString(36).slice(2, 8).toUpperCase() + Date.now().toString().slice(-3);
      onSubmit({
        amount,
        method,
        status: 'completed',
        description: `${target?.title || 'Payment'}${target?.subtitle ? ' · ' + target.subtitle : ''}`,
        card_last4: method === 'card' ? String(cardNumber).replace(/\s+/g, '').slice(-4) : null,
        reference,
        methodIcon: method,
        bookingId: target?.bookingId || null,
        orderId: target?.orderId || null,
        customer_name: target?.customerName || null
      });
      setProcessing(false);
    }, 700);
  };
  const methods = [
    { key: 'card', label: 'Card', icon: <CreditCard size={16} /> },
    { key: 'upi', label: 'UPI', icon: <Building2 size={16} /> },
    { key: 'wallet', label: 'Wallet', icon: <Wallet size={16} /> },
    { key: 'cash', label: 'Cash', icon: <Banknote size={16} /> }
  ];
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="booking-modal payment-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-head">
          <div>
            <p className="eyebrow">SECURE CHECKOUT</p>
            <h2>Complete payment</h2>
          </div>
          <button className="close-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <div className="pay-summary">
          <div>
            <p className="eyebrow hk-eyebrow">{target?.title || 'Payment'}</p>
            <strong>{target?.subtitle || ''}</strong>
          </div>
          <div className="pay-amount">${amount.toFixed(2)}</div>
        </div>
        <div className="pay-methods">
          {methods.map(m => (
            <button key={m.key} className={`pay-method ${method === m.key ? 'selected' : ''}`} onClick={() => setMethod(m.key)} type="button">
              <span className="pay-method-icon">{m.icon}</span>
              <span>{m.label}</span>
            </button>
          ))}
        </div>
        <form onSubmit={submit} className="pay-form">
          {method === 'card' && (
            <>
              <label className="field"><span>Card number</span><input value={cardNumber} onChange={e => setCardNumber(e.target.value)} placeholder="1234 5678 9012 3456" required /></label>
              <label className="field"><span>Cardholder name</span><input value={cardName} onChange={e => setCardName(e.target.value)} placeholder="As on card" required /></label>
              <div className="form-row">
                <label className="field"><span>Expiry (MM/YY)</span><input value={cardExpiry} onChange={e => setCardExpiry(e.target.value)} placeholder="MM/YY" required /></label>
                <label className="field"><span>CVC</span><input value={cardCvc} onChange={e => setCardCvc(e.target.value)} placeholder="123" required /></label>
              </div>
            </>
          )}
          {method === 'upi' && (
            <label className="field"><span>UPI handle</span><input value={upiId} onChange={e => setUpiId(e.target.value)} placeholder="name@bank" required /></label>
          )}
          {method === 'wallet' && (
            <label className="field"><span>Wallet</span>
              <select value={wallet} onChange={e => setWallet(e.target.value)}>
                <option value="paypal">PayPal</option>
                <option value="apple">Apple Pay</option>
                <option value="google">Google Pay</option>
                <option value="amazon">Amazon Pay</option>
              </select>
            </label>
          )}
          {method === 'cash' && (
            <div className="pay-cash-note">
              <Banknote size={18} />
              <span>Cash on delivery — confirm to mark this invoice as paid.</span>
            </div>
          )}
          <button className="primary-btn wide pay-submit" type="submit" disabled={processing}>
            {processing ? 'Processing…' : (<><Check size={16} /> Pay ${amount.toFixed(2)}</>)}
          </button>
          <p className="pay-secure"><ShieldCheck size={13} /> Encrypted · PCI-DSS compliant</p>
        </form>
      </div>
    </div>
  );
}


createRoot(document.getElementById('root')).render(<App />)

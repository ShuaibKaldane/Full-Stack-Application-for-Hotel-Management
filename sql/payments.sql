USE harbor_house;

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id INT UNSIGNED NOT NULL,
  booking_id INT UNSIGNED NULL,
  order_id INT UNSIGNED NULL,
  amount DECIMAL(10,2) NOT NULL,
  method ENUM('card','upi','wallet','cash') NOT NULL DEFAULT 'card',
  status ENUM('pending','completed','failed','refunded') NOT NULL DEFAULT 'completed',
  description VARCHAR(255),
  card_last4 VARCHAR(4) NULL,
  reference VARCHAR(40) NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_user (user_id),
  INDEX idx_status (status),
  INDEX idx_method (method),
  INDEX idx_booking (booking_id),
  INDEX idx_order (order_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Sample seed data for payments (admin only)
INSERT INTO payments (user_id, amount, method, status, description, card_last4, reference)
SELECT 1, 855.00, 'card', 'completed', 'Reservation · Harbor House · Deluxe King', '4242', CONCAT('TXN', LPAD(FLOOR(RAND()*1000000), 6, '0'))
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE description LIKE 'Reservation · Harbor House%');

INSERT INTO payments (user_id, amount, method, status, description, card_last4, reference)
SELECT 1, 48.50, 'upi', 'completed', 'In-room dining · Pacific cod', NULL, CONCAT('TXN', LPAD(FLOOR(RAND()*1000000), 6, '0'))
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE description LIKE 'In-room dining · Pacific cod%');

INSERT INTO payments (user_id, amount, method, status, description, card_last4, reference)
SELECT 1, 320.00, 'card', 'pending', 'Reservation · Napa Valley escape', '1881', CONCAT('TXN', LPAD(FLOOR(RAND()*1000000), 6, '0'))
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE description LIKE 'Reservation · Napa Valley escape%');

INSERT INTO payments (user_id, amount, method, status, description, card_last4, reference)
SELECT 1, 1240.00, 'card', 'completed', 'Reservation · The Juniper Lodge · Garden Suite', '9920', CONCAT('TXN', LPAD(FLOOR(RAND()*1000000), 6, '0'))
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE description LIKE 'Reservation · The Juniper Lodge%');

INSERT INTO payments (user_id, amount, method, status, description, card_last4, reference)
SELECT 1, 76.00, 'wallet', 'completed', 'In-room dining · Miso salmon bowl', NULL, CONCAT('TXN', LPAD(FLOOR(RAND()*1000000), 6, '0'))
WHERE NOT EXISTS (SELECT 1 FROM payments WHERE description LIKE 'In-room dining · Miso salmon bowl%');

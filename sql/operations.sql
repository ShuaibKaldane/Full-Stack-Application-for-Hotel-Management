USE harbor_house;

-- Housekeeping operations
CREATE TABLE IF NOT EXISTS housekeeping_tasks (
  id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  property VARCHAR(160) NOT NULL,
  room_number VARCHAR(30) NOT NULL,
  task_type ENUM('clean','inspect','restock','maintenance','turndown') NOT NULL DEFAULT 'clean',
  status ENUM('pending','in_progress','completed') NOT NULL DEFAULT 'pending',
  priority ENUM('low','normal','high','urgent') NOT NULL DEFAULT 'normal',
  assignee VARCHAR(120),
  notes TEXT,
  due_at DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_priority (priority)
);

-- Sample seed data for housekeeping tasks
INSERT INTO housekeeping_tasks (property, room_number, task_type, status, priority, assignee, notes, due_at)
SELECT * FROM (SELECT 'Harbor House' AS property, '201' AS room_number, 'clean' AS task_type, 'completed' AS status, 'high' AS priority, 'Maya Chen' AS assignee, 'Deep clean after checkout' AS notes, (CURRENT_TIMESTAMP + INTERVAL 1 HOUR) AS due_at) t
WHERE NOT EXISTS (SELECT 1 FROM housekeeping_tasks WHERE room_number = '201' AND task_type='clean' AND notes='Deep clean after checkout');

INSERT INTO housekeeping_tasks (property, room_number, task_type, status, priority, assignee, notes, due_at)
SELECT * FROM (SELECT 'Harbor House' AS property, '208' AS room_number, 'inspect' AS task_type, 'in_progress' AS status, 'normal' AS priority, 'Daniel Park' AS assignee, 'Mid-stay inspection' AS notes, (CURRENT_TIMESTAMP + INTERVAL 2 HOUR) AS due_at) t
WHERE NOT EXISTS (SELECT 1 FROM housekeeping_tasks WHERE room_number = '208' AND task_type='inspect');

INSERT INTO housekeeping_tasks (property, room_number, task_type, status, priority, assignee, notes, due_at)
SELECT * FROM (SELECT 'Harbor House' AS property, '312' AS room_number, 'maintenance' AS task_type, 'pending' AS status, 'urgent' AS priority, NULL AS assignee, 'Air conditioning unit not cooling' AS notes, (CURRENT_TIMESTAMP + INTERVAL 3 HOUR) AS due_at) t
WHERE NOT EXISTS (SELECT 1 FROM housekeeping_tasks WHERE room_number = '312' AND task_type='maintenance');

INSERT INTO housekeeping_tasks (property, room_number, task_type, status, priority, assignee, notes, due_at)
SELECT * FROM (SELECT 'Harbor House' AS property, '105' AS room_number, 'restock' AS task_type, 'pending' AS status, 'low' AS priority, NULL AS assignee, 'Restock toiletries and towels' AS notes, (CURRENT_TIMESTAMP + INTERVAL 4 HOUR) AS due_at) t
WHERE NOT EXISTS (SELECT 1 FROM housekeeping_tasks WHERE room_number = '105' AND task_type='restock');

INSERT INTO housekeeping_tasks (property, room_number, task_type, status, priority, assignee, notes, due_at)
SELECT * FROM (SELECT 'Harbor House' AS property, '402' AS room_number, 'turndown' AS task_type, 'pending' AS status, 'normal' AS priority, NULL AS assignee, 'Evening turndown service' AS notes, (CURRENT_TIMESTAMP + INTERVAL 6 HOUR) AS due_at) t
WHERE NOT EXISTS (SELECT 1 FROM housekeeping_tasks WHERE room_number = '402' AND task_type='turndown');

INSERT INTO housekeeping_tasks (property, room_number, task_type, status, priority, assignee, notes, due_at)
SELECT * FROM (SELECT 'Harbor House' AS property, '215' AS room_number, 'clean' AS task_type, 'in_progress' AS status, 'normal' AS priority, 'Sara Lin' AS assignee, 'Standard clean' AS notes, (CURRENT_TIMESTAMP + INTERVAL 90 MINUTE) AS due_at) t
WHERE NOT EXISTS (SELECT 1 FROM housekeeping_tasks WHERE room_number = '215' AND task_type='clean' AND assignee='Sara Lin');

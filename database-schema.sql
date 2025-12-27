-- GearGuard Maintenance Tracker - MySQL Database Schema
-- This schema supports user authentication, equipment management, teams, and maintenance requests

-- Database Creation
CREATE DATABASE IF NOT EXISTS gearguard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE gearguard_db;

-- Users Table
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('Manager', 'Technician', 'Viewer') NOT NULL DEFAULT 'Technician',
    team VARCHAR(255),
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL,
    is_active BOOLEAN DEFAULT TRUE,
    INDEX idx_email (email),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Categories Table
CREATE TABLE equipment_categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    keywords TEXT,
    company VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Equipment Table
CREATE TABLE equipment (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    category_id VARCHAR(50),
    department VARCHAR(255),
    employee VARCHAR(255),
    location VARCHAR(255),
    purchase_date DATE,
    warranty_info TEXT,
    maintenance_team VARCHAR(255),
    assigned_technician VARCHAR(255),
    status ENUM('operational', 'maintenance', 'broken', 'scrapped') DEFAULT 'operational',
    image TEXT,
    scrapped_date TIMESTAMP NULL,
    scrapped_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES equipment_categories(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_category (category_id),
    INDEX idx_department (department)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Teams Table
CREATE TABLE teams (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) UNIQUE NOT NULL,
    specialty VARCHAR(255),
    team_lead VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Team Members Table
CREATE TABLE team_members (
    id VARCHAR(50) PRIMARY KEY,
    team_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50),
    name VARCHAR(255) NOT NULL,
    specialty VARCHAR(255),
    status ENUM('available', 'busy', 'unavailable') DEFAULT 'available',
    avatar TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_team (team_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Work Centers Table
CREATE TABLE work_centers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cost DECIMAL(10, 2) DEFAULT 0,
    time INT DEFAULT 8,
    cost_per_hour DECIMAL(10, 2) DEFAULT 0,
    capacity_unit INT DEFAULT 0,
    capacity_efficiency INT DEFAULT 100,
    cost_target DECIMAL(10, 2) DEFAULT 0,
    current_workload INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Maintenance Requests Table
CREATE TABLE maintenance_requests (
    id VARCHAR(50) PRIMARY KEY,
    ticket_id VARCHAR(50) UNIQUE NOT NULL,
    subject VARCHAR(255) NOT NULL,
    equipment_id VARCHAR(50) NOT NULL,
    equipment_name VARCHAR(255) NOT NULL,
    type ENUM('Corrective', 'Preventive') NOT NULL DEFAULT 'Corrective',
    scheduled_date DATE NOT NULL,
    duration DECIMAL(10, 2),
    hours_spent DECIMAL(10, 2),
    priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
    status ENUM('New', 'In Progress', 'Repaired', 'Scrap') DEFAULT 'New',
    assigned_team VARCHAR(255),
    assigned_technician VARCHAR(255),
    assigned_user_id VARCHAR(50),
    work_center_id VARCHAR(50),
    description TEXT,
    overdue BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by VARCHAR(50),
    FOREIGN KEY (equipment_id) REFERENCES equipment(id) ON DELETE CASCADE,
    FOREIGN KEY (assigned_user_id) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    FOREIGN KEY (work_center_id) REFERENCES work_centers(id) ON DELETE SET NULL,
    INDEX idx_status (status),
    INDEX idx_equipment (equipment_id),
    INDEX idx_assigned_team (assigned_team),
    INDEX idx_scheduled_date (scheduled_date),
    INDEX idx_priority (priority),
    INDEX idx_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Request Comments/Notes Table
CREATE TABLE request_comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    request_id VARCHAR(50) NOT NULL,
    user_id VARCHAR(50) NOT NULL,
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (request_id) REFERENCES maintenance_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit Log Table (for tracking changes)
CREATE TABLE audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id VARCHAR(50) NOT NULL,
    old_value JSON,
    new_value JSON,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_user (user_id),
    INDEX idx_entity (entity_type, entity_id),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Notifications Table
CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    link VARCHAR(255),
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert Default Data

-- Default Equipment Categories
INSERT INTO equipment_categories (id, name, keywords, company) VALUES
('CAT-001', 'Asset', 'asset, property', 'My Company (Our Branch)'),
('CAT-002', 'Machine', 'machine, equipment', 'My Company (Our Branch)'),
('CAT-003', 'Database', 'database, server', 'My Company (Our Branch)'),
('CAT-004', 'Servers', 'server, hardware', 'My Company (Our Branch)'),
('CAT-005', 'Vehicles', 'vehicle, transport, forklift', 'My Company (Our Branch)'),
('CAT-006', 'Heating & Cooling', 'hvac, climate, cooling, heating', 'My Company (Our Branch)'),
('CAT-007', 'Manufacturing', 'production, assembly, manufacturing', 'My Company (Our Branch)');

-- Default Teams
INSERT INTO teams (id, name, specialty, team_lead) VALUES
('TEAM-001', 'Mechanics Alpha', 'Heavy Machinery', 'Sarah Jenkins'),
('TEAM-002', 'Electrical Response', 'High Voltage', 'Mike Ross'),
('TEAM-003', 'IT Support Unit', 'Software & Hardware', 'David Chen'),
('TEAM-004', 'Plumbing & HVAC', 'Facility Maintenance', 'Marcus Johnson');

-- Default Work Centers
INSERT INTO work_centers (id, name, cost, time, cost_per_hour, capacity_unit, capacity_efficiency, cost_target, current_workload) VALUES
('WC-001', 'Work Center 1', 100.00, 8, 12.50, 10, 100, 1000.00, 0),
('WC-002', 'Assembly 1', 150.00, 8, 18.75, 15, 95, 1500.00, 0),
('WC-003', 'Ball 1', 120.00, 8, 15.00, 12, 90, 1200.00, 0);

-- Create Views for Common Queries

-- Active Maintenance Requests View
CREATE VIEW v_active_requests AS
SELECT 
    mr.*,
    e.name as equipment_name,
    e.status as equipment_status,
    u.name as assigned_user_name,
    u.email as assigned_user_email
FROM maintenance_requests mr
LEFT JOIN equipment e ON mr.equipment_id = e.id
LEFT JOIN users u ON mr.assigned_user_id = u.id
WHERE mr.status NOT IN ('Repaired', 'Scrap');

-- Equipment Status Summary View
CREATE VIEW v_equipment_status_summary AS
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / (SELECT COUNT(*) FROM equipment), 2) as percentage
FROM equipment
GROUP BY status;

-- Team Workload View
CREATE VIEW v_team_workload AS
SELECT 
    assigned_team,
    COUNT(*) as total_requests,
    SUM(CASE WHEN status = 'New' THEN 1 ELSE 0 END) as new_requests,
    SUM(CASE WHEN status = 'In Progress' THEN 1 ELSE 0 END) as in_progress_requests,
    SUM(CASE WHEN priority = 'High' THEN 1 ELSE 0 END) as high_priority_count
FROM maintenance_requests
WHERE status NOT IN ('Repaired', 'Scrap')
GROUP BY assigned_team;

-- Stored Procedures

DELIMITER //

-- Procedure to create a new maintenance request
CREATE PROCEDURE sp_create_maintenance_request(
    IN p_subject VARCHAR(255),
    IN p_equipment_id VARCHAR(50),
    IN p_type VARCHAR(50),
    IN p_scheduled_date DATE,
    IN p_priority VARCHAR(50),
    IN p_description TEXT,
    IN p_assigned_team VARCHAR(255),
    IN p_created_by VARCHAR(50),
    IN p_work_center_id VARCHAR(50)
)
BEGIN
    DECLARE v_request_id VARCHAR(50);
    DECLARE v_ticket_id VARCHAR(50);
    DECLARE v_equipment_name VARCHAR(255);
    
    -- Generate IDs
    SET v_request_id = CONCAT('REQ-', UNIX_TIMESTAMP());
    SET v_ticket_id = CONCAT('#REQ-', UNIX_TIMESTAMP());
    
    -- Get equipment name
    SELECT name INTO v_equipment_name FROM equipment WHERE id = p_equipment_id;
    
    -- Insert request
    INSERT INTO maintenance_requests (
        id, ticket_id, subject, equipment_id, equipment_name, type,
        scheduled_date, priority, description, assigned_team, created_by, 
        work_center_id, status
    ) VALUES (
        v_request_id, v_ticket_id, p_subject, p_equipment_id, v_equipment_name,
        p_type, p_scheduled_date, p_priority, p_description, p_assigned_team,
        p_created_by, p_work_center_id, 'New'
    );
    
    -- Update equipment status if high priority
    IF p_priority = 'High' AND p_type = 'Corrective' THEN
        UPDATE equipment SET status = 'broken' WHERE id = p_equipment_id;
    END IF;
    
    SELECT v_request_id as request_id, v_ticket_id as ticket_id;
END //

-- Procedure to update request status
CREATE PROCEDURE sp_update_request_status(
    IN p_request_id VARCHAR(50),
    IN p_new_status VARCHAR(50),
    IN p_hours_spent DECIMAL(10, 2)
)
BEGIN
    DECLARE v_equipment_id VARCHAR(50);
    
    -- Get equipment ID
    SELECT equipment_id INTO v_equipment_id FROM maintenance_requests WHERE id = p_request_id;
    
    -- Update request
    UPDATE maintenance_requests 
    SET status = p_new_status, hours_spent = p_hours_spent 
    WHERE id = p_request_id;
    
    -- Update equipment status based on request status
    IF p_new_status = 'Scrap' THEN
        UPDATE equipment 
        SET status = 'scrapped', scrapped_date = CURRENT_TIMESTAMP 
        WHERE id = v_equipment_id;
    ELSEIF p_new_status = 'In Progress' THEN
        UPDATE equipment SET status = 'maintenance' WHERE id = v_equipment_id;
    ELSEIF p_new_status = 'Repaired' THEN
        -- Check if there are any other active requests
        IF NOT EXISTS (
            SELECT 1 FROM maintenance_requests 
            WHERE equipment_id = v_equipment_id 
            AND status NOT IN ('Repaired', 'Scrap')
            AND id != p_request_id
        ) THEN
            UPDATE equipment SET status = 'operational' WHERE id = v_equipment_id;
        END IF;
    END IF;
END //

DELIMITER ;

-- Indexes for Performance Optimization
CREATE INDEX idx_equipment_status_date ON equipment(status, purchase_date);
CREATE INDEX idx_request_status_priority ON maintenance_requests(status, priority);
CREATE INDEX idx_request_scheduled_status ON maintenance_requests(scheduled_date, status);

-- Comments for documentation
ALTER TABLE users COMMENT = 'Stores user authentication and profile information';
ALTER TABLE equipment COMMENT = 'Tracks all company equipment/assets';
ALTER TABLE teams COMMENT = 'Maintenance teams within the organization';
ALTER TABLE maintenance_requests COMMENT = 'All maintenance requests (corrective and preventive)';
ALTER TABLE work_centers COMMENT = 'Work centers with capacity and cost tracking';

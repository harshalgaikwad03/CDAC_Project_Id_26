-- ===========================
-- 1. ADMIN TABLE
-- ===========================
CREATE TABLE Admin (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    email VARCHAR(100),
    password VARCHAR(255),
    role VARCHAR(50)
);

-- ===========================
-- 2. AGENCY
-- ===========================
CREATE TABLE Agency (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    contact VARCHAR(20),
    email VARCHAR(100),
    address VARCHAR(255),
    admin_id BIGINT,
    FOREIGN KEY (admin_id) REFERENCES Admin(id)
);

-- ===========================
-- 3. SCHOOL
-- ===========================
CREATE TABLE School (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    address VARCHAR(255),
    contact VARCHAR(20),
    email VARCHAR(100),
    location_lat DOUBLE,
    location_lng DOUBLE,
    admin_id BIGINT,
    agency_id BIGINT,
    FOREIGN KEY (admin_id) REFERENCES Admin(id),
    FOREIGN KEY (agency_id) REFERENCES Agency(id)
);

-- ===========================
-- 4. DRIVER (1-1 with Bus)
-- ===========================
CREATE TABLE Driver (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    phone VARCHAR(20),
    license_number VARCHAR(50),
    email VARCHAR(100),
    password VARCHAR(255),
    agency_id BIGINT,
    FOREIGN KEY (agency_id) REFERENCES Agency(id)
);

-- ===========================
-- 5. BUS
-- ===========================
CREATE TABLE Bus (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    bus_number VARCHAR(20),
    capacity INT,
    agency_id BIGINT,
    school_id BIGINT,
    driver_id BIGINT UNIQUE,
    FOREIGN KEY (agency_id) REFERENCES Agency(id),
    FOREIGN KEY (school_id) REFERENCES School(id),
    FOREIGN KEY (driver_id) REFERENCES Driver(id)
);

-- ===========================
-- 6. BUS HELPER
-- ===========================
CREATE TABLE BusHelper (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    phone VARCHAR(20),
    email VARCHAR(100),
    password VARCHAR(255),
    school_id BIGINT,
    assigned_bus_id BIGINT,
    FOREIGN KEY (school_id) REFERENCES School(id),
    FOREIGN KEY (assigned_bus_id) REFERENCES Bus(id)
);

-- ===========================
-- 7. PICKUP POINT
-- ===========================
CREATE TABLE PickupPoint (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    stop_name VARCHAR(100),
    latitude DOUBLE,
    longitude DOUBLE,
    school_id BIGINT,
    FOREIGN KEY (school_id) REFERENCES School(id)
);

-- ===========================
-- 8. STUDENT
-- ===========================
CREATE TABLE Student (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100),
    class_name VARCHAR(20),
    roll_no VARCHAR(20),
    school_id BIGINT,
    assigned_bus_id BIGINT,
    pickup_point_id BIGINT,
    pass_start_date DATE,
    pass_expiry_date DATE,
    pass_status ENUM('ACTIVE','EXPIRED'),
    FOREIGN KEY (school_id) REFERENCES School(id),
    FOREIGN KEY (assigned_bus_id) REFERENCES Bus(id),
    FOREIGN KEY (pickup_point_id) REFERENCES PickupPoint(id)
);

-- ===========================
-- 9. STUDENT STATUS
-- ===========================
CREATE TABLE StudentStatus (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    date DATE,
    pickup_status ENUM('PENDING','PICKED','DROPPED'),
    timestamp DATETIME,
    updated_by BIGINT,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (updated_by) REFERENCES BusHelper(id)
);

-- ===========================
-- 10. FEEDBACK
-- ===========================
CREATE TABLE Feedback (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    student_id BIGINT,
    bus_id BIGINT,
    driver_id BIGINT,
    helper_id BIGINT,
    feedback_text TEXT,
    rating INT,
    created_at DATETIME,
    FOREIGN KEY (student_id) REFERENCES Student(id),
    FOREIGN KEY (bus_id) REFERENCES Bus(id),
    FOREIGN KEY (driver_id) REFERENCES Driver(id),
    FOREIGN KEY (helper_id) REFERENCES BusHelper(id)
);

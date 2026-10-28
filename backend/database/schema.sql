
CREATE TABLE IF NOT EXISTS departments (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY name (name)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS employees (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) NOT NULL,
  department VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  status ENUM('present', 'absent', 'leave')
    NOT NULL DEFAULT 'present',
  created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
  department_id INT DEFAULT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY email (email),
  KEY fk_employees_department (department_id),
  CONSTRAINT fk_employees_department
    FOREIGN KEY (department_id)
    REFERENCES departments (id)
) ENGINE=InnoDB
  DEFAULT CHARSET=utf8mb4
  COLLATE=utf8mb4_unicode_ci;

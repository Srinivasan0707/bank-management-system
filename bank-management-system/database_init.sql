-- Database Creation (if not using auto-create)
CREATE DATABASE IF NOT EXISTS bank_management_db;
USE bank_management_db;

-- Tables will be auto-created by Hibernate, but here's the manual schema

-- Customers Table
CREATE TABLE IF NOT EXISTS customers (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(50) NOT NULL,
    address VARCHAR(500) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Accounts Table
CREATE TABLE IF NOT EXISTS accounts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_number VARCHAR(50) NOT NULL UNIQUE,
    customer_id BIGINT NOT NULL,
    account_type ENUM('SAVINGS', 'CHECKING', 'BUSINESS') NOT NULL,
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    status ENUM('ACTIVE', 'INACTIVE', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_account_number (account_number),
    INDEX idx_customer_id (customer_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Transactions Table
CREATE TABLE IF NOT EXISTS transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    from_account_id BIGINT,
    to_account_id BIGINT,
    amount DECIMAL(15,2) NOT NULL,
    transaction_type ENUM('DEPOSIT', 'WITHDRAWAL', 'TRANSFER') NOT NULL,
    description VARCHAR(500),
    transaction_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'COMPLETED',
    FOREIGN KEY (from_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    FOREIGN KEY (to_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    INDEX idx_from_account (from_account_id),
    INDEX idx_to_account (to_account_id),
    INDEX idx_transaction_date (transaction_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Sample Data (Optional)
INSERT INTO customers (name, email, phone, address) VALUES
('John Doe', 'john.doe@example.com', '+1-234-567-8901', '123 Main Street, New York, NY 10001'),
('Jane Smith', 'jane.smith@example.com', '+1-234-567-8902', '456 Oak Avenue, Los Angeles, CA 90001'),
('Robert Johnson', 'robert.j@example.com', '+1-234-567-8903', '789 Pine Road, Chicago, IL 60601');

INSERT INTO accounts (account_number, customer_id, account_type, balance, status) VALUES
('ACC0001234567', 1, 'SAVINGS', 5000.00, 'ACTIVE'),
('ACC0001234568', 1, 'CHECKING', 2500.00, 'ACTIVE'),
('ACC0001234569', 2, 'SAVINGS', 10000.00, 'ACTIVE'),
('ACC0001234570', 3, 'BUSINESS', 50000.00, 'ACTIVE');

INSERT INTO transactions (from_account_id, to_account_id, amount, transaction_type, description, status) VALUES
(1, NULL, 1000.00, 'DEPOSIT', 'Initial deposit', 'COMPLETED'),
(2, NULL, 500.00, 'DEPOSIT', 'Paycheck deposit', 'COMPLETED'),
(1, 2, 250.00, 'TRANSFER', 'Transfer to checking', 'COMPLETED'),
(3, NULL, 2000.00, 'WITHDRAWAL', 'ATM withdrawal', 'COMPLETED');

-- Verification Queries
SELECT 'Customers Count:' as Info, COUNT(*) as Total FROM customers;
SELECT 'Accounts Count:' as Info, COUNT(*) as Total FROM accounts;
SELECT 'Transactions Count:' as Info, COUNT(*) as Total FROM transactions;

# 🏦 Bank Management System

A professional, full-stack Bank Management System built with **HTML, CSS, JavaScript** frontend and **Spring Boot, Java, MySQL** backend.

## 📋 Table of Contents
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation--setup)
- [Running the Application](#running-the-application)
- [API Endpoints](#api-endpoints)
- [Screenshots](#screenshots)

## ✨ Features

### Customer Management
- ✅ Create, Read, Update, Delete (CRUD) customers
- ✅ Store customer information (name, email, phone, address)
- ✅ View all customers in a professional dashboard

### Account Management
- ✅ Create multiple account types (Savings, Checking, Business)
- ✅ Generate unique account numbers automatically
- ✅ Track account balances and status
- ✅ Link accounts to customers

### Transaction Management
- ✅ **Deposit**: Add money to accounts
- ✅ **Withdrawal**: Remove money from accounts (with balance validation)
- ✅ **Transfer**: Move money between accounts
- ✅ Real-time balance updates
- ✅ Transaction history tracking

### Dashboard
- ✅ Overview statistics (Total Balance, Customers, Transactions, Active Accounts)
- ✅ Recent transactions display
- ✅ Quick action buttons
- ✅ Beautiful, responsive UI with professional design

## 🛠 Technology Stack

### Frontend
- **HTML5**: Structure and content
- **CSS3**: Styling with modern animations and gradients
- **JavaScript (ES6+)**: Dynamic functionality and API integration
- **Fonts**: Google Fonts (Playfair Display, IBM Plex Sans)

### Backend
- **Java 17**: Programming language
- **Spring Boot 3.2.0**: Application framework
- **Spring Data JPA**: Database operations
- **MySQL 8.0**: Relational database
- **Lombok**: Reduce boilerplate code
- **Maven**: Dependency management

## 📁 Project Structure

```
bank-management-system/
│
├── frontend/
│   ├── index.html          # Main HTML file
│   ├── styles.css          # Professional CSS styling
│   └── script.js           # JavaScript functionality
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/bank/
│   │       │   ├── BankManagementSystemApplication.java
│   │       │   ├── controller/
│   │       │   │   ├── CustomerController.java
│   │       │   │   ├── AccountController.java
│   │       │   │   └── TransactionController.java
│   │       │   ├── service/
│   │       │   │   ├── CustomerService.java
│   │       │   │   ├── AccountService.java
│   │       │   │   └── TransactionService.java
│   │       │   ├── repository/
│   │       │   │   ├── CustomerRepository.java
│   │       │   │   ├── AccountRepository.java
│   │       │   │   └── TransactionRepository.java
│   │       │   ├── model/
│   │       │   │   ├── Customer.java
│   │       │   │   ├── Account.java
│   │       │   │   └── Transaction.java
│   │       │   ├── dto/
│   │       │   │   ├── CustomerDTO.java
│   │       │   │   ├── AccountDTO.java
│   │       │   │   └── TransactionDTO.java
│   │       │   └── config/
│   │       │       └── WebConfig.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
│
└── README.md
```

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

1. **Java Development Kit (JDK) 17 or higher**
   - Download: https://www.oracle.com/java/technologies/downloads/
   - Verify: `java -version`

2. **Maven 3.6+**
   - Download: https://maven.apache.org/download.cgi
   - Verify: `mvn -version`

3. **MySQL 8.0+**
   - Download: https://dev.mysql.com/downloads/mysql/
   - Verify: `mysql --version`

4. **Modern Web Browser**
   - Chrome, Firefox, Safari, or Edge (latest version)

5. **Code Editor (Optional but recommended)**
   - VS Code, IntelliJ IDEA, or Eclipse

## 🚀 Installation & Setup

### Step 1: Database Setup

1. **Start MySQL Server**

2. **Create Database** (Optional - will be auto-created)
   ```sql
   CREATE DATABASE bank_management_db;
   ```

3. **Configure Database Credentials**
   
   Edit `backend/src/main/resources/application.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/bank_management_db
   spring.datasource.username=YOUR_MYSQL_USERNAME
   spring.datasource.password=YOUR_MYSQL_PASSWORD
   ```

### Step 2: Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   mvn clean install
   ```

3. **Run the Spring Boot application**
   ```bash
   mvn spring-boot:run
   ```
   
   Or build and run JAR:
   ```bash
   mvn package
   java -jar target/bank-management-system-1.0.0.jar
   ```

4. **Verify backend is running**
   - Server should start on `http://localhost:8080`
   - Check console for: "Started BankManagementSystemApplication"

### Step 3: Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Open in browser**
   - Simply open `index.html` in your web browser
   - Or use a local server:
     ```bash
     # Using Python
     python -m http.server 8000
     
     # Using Node.js http-server
     npx http-server -p 8000
     ```

3. **Access the application**
   - Frontend: `http://localhost:8000` (or directly open index.html)
   - Backend API: `http://localhost:8080/api`

## 🎮 Running the Application

### Demo Mode (Without Backend)
The frontend includes a **demo mode** with local storage that allows you to test the UI without setting up the backend:

1. Open `frontend/index.html` in your browser
2. Login with any email/password
3. All data is stored in browser's localStorage
4. Refresh will clear data

### Full Mode (With Backend)
1. Ensure MySQL is running
2. Start the backend server: `mvn spring-boot:run`
3. Open frontend in browser
4. Login/Register to create an account
5. Data persists in MySQL database

## 🔌 API Endpoints

### Customers
- `GET /api/customers` - Get all customers
- `GET /api/customers/{id}` - Get customer by ID
- `POST /api/customers` - Create new customer
- `PUT /api/customers/{id}` - Update customer
- `DELETE /api/customers/{id}` - Delete customer

### Accounts
- `GET /api/accounts` - Get all accounts
- `GET /api/accounts/{id}` - Get account by ID
- `GET /api/accounts/customer/{customerId}` - Get accounts by customer
- `POST /api/accounts` - Create new account
- `PUT /api/accounts/{id}` - Update account
- `DELETE /api/accounts/{id}` - Delete account

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/{id}` - Get transaction by ID
- `GET /api/transactions/account/{accountId}` - Get transactions by account
- `POST /api/transactions` - Create new transaction

## 🎨 Design Features

- **Professional Banking Aesthetic**: Elegant green and gold color scheme
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Smooth Animations**: CSS transitions and keyframe animations
- **Modern Typography**: Playfair Display for headings, IBM Plex Sans for body
- **Intuitive Navigation**: Easy-to-use dashboard with clear sections
- **Real-time Updates**: Instant feedback for all operations

## 🔐 Default Configuration

```
Backend Port: 8080
Database: bank_management_db
MySQL Port: 3306
Frontend: Any available port or direct file access
```

## 📝 Usage Guide

1. **Register/Login**: Create an account or use demo mode
2. **Add Customers**: Go to Customers section and add new customers
3. **Create Accounts**: Link accounts to customers with initial balance
4. **Make Transactions**: 
   - Deposit money to accounts
   - Withdraw money (with balance check)
   - Transfer between accounts
5. **View Dashboard**: Monitor statistics and recent transactions

## 🐛 Troubleshooting

### Backend won't start
- Ensure MySQL is running
- Check database credentials in `application.properties`
- Verify Java 17+ is installed: `java -version`

### Frontend can't connect to backend
- Verify backend is running on port 8080
- Check browser console for errors
- Ensure CORS is enabled (already configured)

### Database connection errors
- Confirm MySQL service is running
- Check username/password in `application.properties`
- Ensure database `bank_management_db` exists

## 📊 Database Schema

### Customers Table
- id (PK)
- name
- email (unique)
- phone
- address
- created_at
- updated_at

### Accounts Table
- id (PK)
- account_number (unique)
- customer_id (FK)
- account_type (ENUM)
- balance (DECIMAL)
- status (ENUM)
- created_at
- updated_at

### Transactions Table
- id (PK)
- from_account_id (FK)
- to_account_id (FK)
- amount (DECIMAL)
- transaction_type (ENUM)
- description
- transaction_date
- status (ENUM)

## 🚀 Future Enhancements

- [ ] User authentication & authorization
- [ ] Transaction reports and analytics
- [ ] Email notifications
- [ ] Account statements (PDF export)
- [ ] Loan management
- [ ] Credit/Debit card management
- [ ] Mobile app version

## 👨‍💻 Author

Created as a professional banking management system demonstration project.

## 📄 License

This project is for educational and portfolio purposes.

---

**Happy Banking! 🏦💰**

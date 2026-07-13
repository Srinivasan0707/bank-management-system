// API Base URL - Change this to your backend URL
const API_BASE_URL = 'http://localhost:8080/api';

let currentUser = null;
let authToken = null;

// Utility Functions
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: ${type === 'success' ? '#28a745' : '#dc3545'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease-out;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Authentication Functions
async function login(event) {
    event.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            authToken = data.token || 'mock-token';
            currentUser = data.user || { name: email.split('@')[0] };
            
            document.getElementById('loginPage').style.display = 'none';
            document.getElementById('dashboard').style.display = 'block';
            document.getElementById('userName').textContent = currentUser.name;
            
            showNotification('Login successful!');
            loadDashboardData();
        } else {
            showNotification('Invalid credentials', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        // Demo mode - allow login without backend
        authToken = 'demo-token';
        currentUser = { name: email.split('@')[0] };
        
        document.getElementById('loginPage').style.display = 'none';
        document.getElementById('dashboard').style.display = 'block';
        document.getElementById('userName').textContent = currentUser.name;
        
        showNotification('Login successful! (Demo Mode)');
        loadDashboardData();
    }
}

async function register(event) {
    event.preventDefault();
    
    const name = document.getElementById('regName').value;
    const email = document.getElementById('regEmail').value;
    const phone = document.getElementById('regPhone').value;
    const address = document.getElementById('regAddress').value;
    const password = document.getElementById('regPassword').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, phone, address, password })
        });
        
        if (response.ok) {
            showNotification('Registration successful! Please login.');
            showLogin();
        } else {
            showNotification('Registration failed', 'error');
        }
    } catch (error) {
        console.error('Registration error:', error);
        showNotification('Registration successful! Please login. (Demo Mode)');
        showLogin();
    }
}

function showRegister() {
    document.getElementById('loginPage').style.display = 'none';
    document.getElementById('registerPage').style.display = 'flex';
}

function showLogin() {
    document.getElementById('registerPage').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
}

function logout() {
    authToken = null;
    currentUser = null;
    document.getElementById('dashboard').style.display = 'none';
    document.getElementById('loginPage').style.display = 'flex';
    showNotification('Logged out successfully');
}

// Navigation
function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(section => {
        section.classList.remove('active-section');
    });
    document.getElementById(sectionId).classList.add('active-section');
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
        }
    });
    
    // Load section data
    if (sectionId === 'accounts') {
        loadAccounts();
    } else if (sectionId === 'transactions') {
        loadTransactions();
    } else if (sectionId === 'customers') {
        loadCustomers();
    }
}

// Add click listeners to navigation
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.getAttribute('href').substring(1);
            showSection(sectionId);
        });
    });
});

// Modal Functions
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('active');
    
    if (modalId === 'accountModal' || modalId === 'transactionModal') {
        loadCustomersForDropdown();
        loadAccountsForDropdown();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Dashboard Data Functions
async function loadDashboardData() {
    try {
        // Load all data
        await Promise.all([
            loadAccounts(),
            loadTransactions(),
            loadCustomers(),
            updateDashboardStats()
        ]);
        
        loadRecentTransactions();
    } catch (error) {
        console.error('Error loading dashboard data:', error);
    }
}

async function updateDashboardStats() {
    try {
        // In a real application, fetch these from the backend
        const accounts = await fetchAccounts();
        const transactions = await fetchTransactions();
        const customers = await fetchCustomers();
        
        const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
        const todayTransactions = transactions.filter(t => {
            const today = new Date().toDateString();
            const transDate = new Date(t.transactionDate).toDateString();
            return today === transDate;
        }).length;
        
        document.getElementById('totalBalance').textContent = `$${totalBalance.toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`;
        document.getElementById('totalCustomers').textContent = customers.length;
        document.getElementById('todayTransactions').textContent = todayTransactions;
        document.getElementById('activeAccounts').textContent = accounts.filter(a => a.status === 'ACTIVE').length;
    } catch (error) {
        console.error('Error updating stats:', error);
    }
}

function loadRecentTransactions() {
    fetchTransactions().then(transactions => {
        const recent = transactions.slice(0, 5);
        const listHtml = recent.length > 0 ? recent.map(t => `
            <div class="transaction-item">
                <div class="transaction-info">
                    <div class="transaction-icon ${t.transactionType.toLowerCase()}">
                        ${t.transactionType === 'DEPOSIT' ? '⬇' : t.transactionType === 'WITHDRAWAL' ? '⬆' : '↔'}
                    </div>
                    <div class="transaction-details">
                        <h4>${t.transactionType}</h4>
                        <p>${new Date(t.transactionDate).toLocaleDateString()}</p>
                    </div>
                </div>
                <div class="transaction-amount ${t.transactionType === 'DEPOSIT' ? 'positive' : 'negative'}">
                    ${t.transactionType === 'DEPOSIT' ? '+' : '-'}$${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}
                </div>
            </div>
        `).join('') : '<div class="empty-state">No recent transactions</div>';
        
        document.getElementById('recentTransactionsList').innerHTML = listHtml;
    });
}

// Account Functions
async function loadAccounts() {
    try {
        const accounts = await fetchAccounts();
        const tableBody = document.getElementById('accountsTableBody');
        
        if (accounts.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No accounts found</td></tr>';
            return;
        }
        
        tableBody.innerHTML = accounts.map(account => `
            <tr>
                <td><strong>${account.accountNumber}</strong></td>
                <td>${account.customerName || 'N/A'}</td>
                <td>${account.accountType}</td>
                <td>$${account.balance.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td><span class="status-badge ${account.status.toLowerCase()}">${account.status}</span></td>
                <td class="table-actions">
                    <button class="btn-icon" onclick="viewAccount(${account.id})" title="View">👁</button>
                    <button class="btn-icon" onclick="deleteAccount(${account.id})" title="Delete">🗑</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading accounts:', error);
    }
}

async function fetchAccounts() {
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching accounts:', error);
    }
    
    // Demo data
    return JSON.parse(localStorage.getItem('accounts') || '[]');
}

async function createAccount(event) {
    event.preventDefault();
    
    const accountData = {
        customerId: parseInt(document.getElementById('accountCustomerId').value),
        accountType: document.getElementById('accountType').value,
        balance: parseFloat(document.getElementById('initialBalance').value),
        accountNumber: 'ACC' + Date.now(),
        status: 'ACTIVE'
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/accounts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(accountData)
        });
        
        if (response.ok) {
            showNotification('Account created successfully!');
            closeModal('accountModal');
            loadAccounts();
            updateDashboardStats();
            event.target.reset();
        } else {
            showNotification('Failed to create account', 'error');
        }
    } catch (error) {
        console.error('Error creating account:', error);
        // Demo mode
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        accountData.id = Date.now();
        accounts.push(accountData);
        localStorage.setItem('accounts', JSON.stringify(accounts));
        
        showNotification('Account created successfully! (Demo Mode)');
        closeModal('accountModal');
        loadAccounts();
        updateDashboardStats();
        event.target.reset();
    }
}

async function deleteAccount(id) {
    if (!confirm('Are you sure you want to delete this account?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/accounts/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Account deleted successfully!');
            loadAccounts();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error deleting account:', error);
        // Demo mode
        const accounts = JSON.parse(localStorage.getItem('accounts') || '[]');
        const filtered = accounts.filter(a => a.id !== id);
        localStorage.setItem('accounts', JSON.stringify(filtered));
        
        showNotification('Account deleted successfully! (Demo Mode)');
        loadAccounts();
        updateDashboardStats();
    }
}

// Transaction Functions
async function loadTransactions() {
    try {
        const transactions = await fetchTransactions();
        const tableBody = document.getElementById('transactionsTableBody');
        
        if (transactions.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="7" class="empty-state">No transactions found</td></tr>';
            return;
        }
        
        tableBody.innerHTML = transactions.map(t => `
            <tr>
                <td><strong>#${t.id}</strong></td>
                <td>${t.fromAccountNumber || 'N/A'}</td>
                <td>${t.toAccountNumber || 'N/A'}</td>
                <td>$${t.amount.toLocaleString('en-US', {minimumFractionDigits: 2})}</td>
                <td><span class="status-badge ${t.transactionType.toLowerCase()}">${t.transactionType}</span></td>
                <td>${new Date(t.transactionDate).toLocaleString()}</td>
                <td><span class="status-badge active">Completed</span></td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading transactions:', error);
    }
}

async function fetchTransactions() {
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching transactions:', error);
    }
    
    // Demo data
    return JSON.parse(localStorage.getItem('transactions') || '[]');
}

async function createTransaction(event) {
    event.preventDefault();
    
    const transactionData = {
        fromAccountId: parseInt(document.getElementById('fromAccountId').value),
        toAccountId: document.getElementById('toAccountId').value ? parseInt(document.getElementById('toAccountId').value) : null,
        amount: parseFloat(document.getElementById('transactionAmount').value),
        transactionType: document.getElementById('transactionType').value,
        description: document.getElementById('transactionDescription').value,
        transactionDate: new Date().toISOString()
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/transactions`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(transactionData)
        });
        
        if (response.ok) {
            showNotification('Transaction completed successfully!');
            closeModal('transactionModal');
            loadTransactions();
            loadAccounts();
            updateDashboardStats();
            event.target.reset();
        } else {
            showNotification('Transaction failed', 'error');
        }
    } catch (error) {
        console.error('Error creating transaction:', error);
        // Demo mode
        const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
        transactionData.id = Date.now();
        transactions.push(transactionData);
        localStorage.setItem('transactions', JSON.stringify(transactions));
        
        showNotification('Transaction completed successfully! (Demo Mode)');
        closeModal('transactionModal');
        loadTransactions();
        updateDashboardStats();
        event.target.reset();
    }
}

function toggleTransactionFields() {
    const type = document.getElementById('transactionType').value;
    const toAccountGroup = document.getElementById('toAccountGroup');
    
    if (type === 'TRANSFER') {
        toAccountGroup.style.display = 'block';
        document.getElementById('toAccountId').required = true;
    } else {
        toAccountGroup.style.display = 'none';
        document.getElementById('toAccountId').required = false;
    }
}

// Customer Functions
async function loadCustomers() {
    try {
        const customers = await fetchCustomers();
        const tableBody = document.getElementById('customersTableBody');
        
        if (customers.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="6" class="empty-state">No customers found</td></tr>';
            return;
        }
        
        tableBody.innerHTML = customers.map(customer => `
            <tr>
                <td><strong>#${customer.id}</strong></td>
                <td>${customer.name}</td>
                <td>${customer.email}</td>
                <td>${customer.phone}</td>
                <td>${customer.address}</td>
                <td class="table-actions">
                    <button class="btn-icon" onclick="viewCustomer(${customer.id})" title="View">👁</button>
                    <button class="btn-icon" onclick="deleteCustomer(${customer.id})" title="Delete">🗑</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error loading customers:', error);
    }
}

async function fetchCustomers() {
    try {
        const response = await fetch(`${API_BASE_URL}/customers`, {
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            return await response.json();
        }
    } catch (error) {
        console.error('Error fetching customers:', error);
    }
    
    // Demo data
    return JSON.parse(localStorage.getItem('customers') || '[]');
}

async function createCustomer(event) {
    event.preventDefault();
    
    const customerData = {
        name: document.getElementById('customerName').value,
        email: document.getElementById('customerEmail').value,
        phone: document.getElementById('customerPhone').value,
        address: document.getElementById('customerAddress').value
    };
    
    try {
        const response = await fetch(`${API_BASE_URL}/customers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify(customerData)
        });
        
        if (response.ok) {
            showNotification('Customer added successfully!');
            closeModal('customerModal');
            loadCustomers();
            updateDashboardStats();
            event.target.reset();
        } else {
            showNotification('Failed to add customer', 'error');
        }
    } catch (error) {
        console.error('Error creating customer:', error);
        // Demo mode
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        customerData.id = Date.now();
        customers.push(customerData);
        localStorage.setItem('customers', JSON.stringify(customers));
        
        showNotification('Customer added successfully! (Demo Mode)');
        closeModal('customerModal');
        loadCustomers();
        updateDashboardStats();
        event.target.reset();
    }
}

async function deleteCustomer(id) {
    if (!confirm('Are you sure you want to delete this customer?')) return;
    
    try {
        const response = await fetch(`${API_BASE_URL}/customers/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            showNotification('Customer deleted successfully!');
            loadCustomers();
            updateDashboardStats();
        }
    } catch (error) {
        console.error('Error deleting customer:', error);
        // Demo mode
        const customers = JSON.parse(localStorage.getItem('customers') || '[]');
        const filtered = customers.filter(c => c.id !== id);
        localStorage.setItem('customers', JSON.stringify(filtered));
        
        showNotification('Customer deleted successfully! (Demo Mode)');
        loadCustomers();
        updateDashboardStats();
    }
}

// Dropdown population
async function loadCustomersForDropdown() {
    const customers = await fetchCustomers();
    const select = document.getElementById('accountCustomerId');
    select.innerHTML = '<option value="">Select Customer</option>' + 
        customers.map(c => `<option value="${c.id}">${c.name}</option>`).join('');
}

async function loadAccountsForDropdown() {
    const accounts = await fetchAccounts();
    const fromSelect = document.getElementById('fromAccountId');
    const toSelect = document.getElementById('toAccountId');
    
    const options = '<option value="">Select Account</option>' + 
        accounts.map(a => `<option value="${a.id}">${a.accountNumber} - ${a.accountType}</option>`).join('');
    
    fromSelect.innerHTML = options;
    toSelect.innerHTML = options;
}

// View functions (placeholder)
function viewAccount(id) {
    showNotification('View account feature coming soon!');
}

function viewCustomer(id) {
    showNotification('View customer feature coming soon!');
}

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

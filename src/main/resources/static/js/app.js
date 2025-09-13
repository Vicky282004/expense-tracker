// ===== Sections =====
const landingSection = document.querySelector('.landing-container');
const loginSection = document.getElementById('loginSection');
const signupSection = document.getElementById('signupSection');
const dashboardSection = document.getElementById('dashboardSection');

// ===== Landing Buttons =====
function showLogin() {
    landingSection.style.display = 'none';
    loginSection.style.display = 'block';
}

function showSignup() {
    landingSection.style.display = 'none';
    signupSection.style.display = 'block';
}

// ===== Signup =====
async function signupUser(username, password) {
    const res = await fetch("http://localhost:8080/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) { alert("Signup failed!"); return; }
    alert("Signup success! Please login.");
    signupSection.style.display = 'none';
    loginSection.style.display = 'block';
}

// ===== Login =====
async function loginUser(username, password) {
    const res = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });

    if (!res.ok) { alert("Login failed!"); return; }
    const token = await res.text();
    localStorage.setItem("jwtToken", token);
    alert("Login success!");
    loginSection.style.display = 'none';
    dashboardSection.style.display = 'block';
    loadExpenses();
}

// ===== Logout =====
function logout() {
    localStorage.removeItem("jwtToken");
    dashboardSection.style.display = 'none';
    landingSection.style.display = 'flex';
}

// ===== Expense Functions =====
async function addExpense() {
    const token = localStorage.getItem("jwtToken");
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    const res = await fetch("http://localhost:8080/expenses/addExpense", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ description, amount, date })
    });

    if (!res.ok) { alert("Add Expense failed!"); return; }
    alert("Expense added!");
    document.getElementById("expenseForm").reset();
    loadExpenses();
}

async function fetchExpenses() {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch("http://localhost:8080/expenses/getExpense", {
        method: "GET",
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) { alert("Load failed!"); return []; }
    const expenses = await res.json();
    renderExpenses(expenses);
    renderChart(expenses);
    return expenses;
}

function renderExpenses(expenses) {
    const list = document.getElementById("expenseList");
    list.innerHTML = "";
    let total = 0;
    expenses.forEach(exp => {
        total += exp.amount;
        const li = document.createElement("li");
        li.textContent = `${exp.description} - ₹${exp.amount} (${exp.date})`;

        // Edit/Delete buttons
        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.onclick = () => showUpdateForm(exp);

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.onclick = () => deleteExpense(exp.id);

        li.appendChild(editBtn);
        li.appendChild(delBtn);
        list.appendChild(li);
    });
    document.getElementById("totalAmount").textContent = "₹" + total;
}

// ===== Update/Delete =====
function showUpdateForm(exp) {
    document.getElementById("updateSection").style.display = "block";
    document.getElementById("updateId").value = exp.id;
    document.getElementById("updateDescription").value = exp.description;
    document.getElementById("updateAmount").value = exp.amount;
    document.getElementById("updateDate").value = exp.date;
}

async function updateExpense() {
    const token = localStorage.getItem("jwtToken");
    const id = document.getElementById("updateId").value;
    const description = document.getElementById("updateDescription").value;
    const amount = parseFloat(document.getElementById("updateAmount").value);
    const date = document.getElementById("updateDate").value;

    const res = await fetch(`http://localhost:8080/expenses/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
        body: JSON.stringify({ description, amount, date })
    });

    if (!res.ok) { alert("Update failed!"); return; }
    alert("Expense updated!");
    document.getElementById("updateSection").style.display = "none";
    loadExpenses();
}

async function deleteExpense(id) {
    const token = localStorage.getItem("jwtToken");
    const res = await fetch(`http://localhost:8080/expenses/${id}`, {
        method: "DELETE",
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) { alert("Delete failed!"); return; }
    alert("Expense deleted!");
    loadExpenses();
}

// ===== Chart =====
function renderChart(expenses) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = expenses.map(e => e.description);
    const data = expenses.map(e => e.amount);

    if(window.expenseChartInstance) {
        window.expenseChartInstance.destroy();
    }

    window.expenseChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
            labels,
            datasets: [{
                data,
                backgroundColor: ['#FF6384','#36A2EB','#FFCE56','#4BC0C0','#9966FF','#FF9F40']
            }]
        }
    });
}

// ===== Expense Form Event Listeners =====
document.getElementById("expenseForm").addEventListener("submit", (e) => {
    e.preventDefault();
    addExpense();
});

document.getElementById("updateForm").addEventListener("submit", (e) => {
    e.preventDefault();
    updateExpense();
});

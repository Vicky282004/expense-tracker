// ===== Check login =====
window.onload = () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) window.location.href = "login.html"; // redirect if not logged in
    loadExpenses();
};

// ===== Logout =====
function logout() {
    localStorage.removeItem("jwtToken");
    window.location.href = "login.html";
}

// ===== ADD EXPENSE =====
document.getElementById("expenseForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const description = document.getElementById("description").value;
    const amount = parseFloat(document.getElementById("amount").value);
    const date = document.getElementById("date").value;

    try {
        const res = await fetch("http://localhost:8080/expenses/addExpense", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ description, amount, date })
        });

        if (!res.ok) { alert("Add Expense failed!"); return; }

        alert("Expense added!");
        document.getElementById("expenseForm").reset();
        loadExpenses();
    } catch (err) {
        console.error(err);
        alert("Add Expense error!");
    }
});

// ===== LOAD EXPENSES =====
async function fetchExpenses() {
    const token = localStorage.getItem("jwtToken");
    try {
        const res = await fetch("http://localhost:8080/expenses/getExpense", {
            method: "GET",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) { alert("Load failed!"); return []; }

        const expenses = await res.json();

        const list = document.getElementById("expenseList");
        list.innerHTML = "";
        let total = 0;

        expenses.forEach(exp => {
            total += exp.amount;
            const li = document.createElement("li");
            li.textContent = `${exp.description} - ₹${exp.amount} (${exp.date})`;

            // Update/Delete buttons
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

        renderChart(expenses); // ✅ call correct function

        return expenses;
    } catch (err) {
        console.error(err);
        alert("Fetch expenses error!");
        return [];
    }
}

async function loadExpenses() {
    await fetchExpenses();
}

// ===== UPDATE EXPENSE =====
function showUpdateForm(exp) {
    document.getElementById("updateSection").style.display = "block";
    document.getElementById("updateId").value = exp.id;
    document.getElementById("updateDescription").value = exp.description;
    document.getElementById("updateAmount").value = exp.amount;
    document.getElementById("updateDate").value = exp.date;
}

document.getElementById("updateForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("jwtToken");
    const id = document.getElementById("updateId").value;
    const description = document.getElementById("updateDescription").value;
    const amount = parseFloat(document.getElementById("updateAmount").value);
    const date = document.getElementById("updateDate").value;

    try {
        const res = await fetch(`http://localhost:8080/expenses/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify({ description, amount, date })
        });

        if (!res.ok) { alert("Update failed!"); return; }

        alert("Expense updated!");
        document.getElementById("updateSection").style.display = "none";
        loadExpenses();
    } catch (err) {
        console.error(err);
        alert("Update error!");
    }
});

// ===== DELETE EXPENSE =====
async function deleteExpense(id) {
    const token = localStorage.getItem("jwtToken");
    try {
        const res = await fetch(`http://localhost:8080/expenses/${id}`, {
            method: "DELETE",
            headers: { "Authorization": "Bearer " + token }
        });

        if (!res.ok) { alert("Delete failed!"); return; }

        alert("Expense deleted!");
        loadExpenses();
    } catch (err) {
        console.error(err);
        alert("Delete error!");
    }
}

// ===== RENDER CHART =====
function renderChart(expenses) {
    const ctx = document.getElementById('expenseChart').getContext('2d');
    const labels = expenses.map(e => e.description);
    const data = expenses.map(e => e.amount);

    // Destroy old chart instance if exists
    if (window.expenseChartInstance) {
        window.expenseChartInstance.destroy();
    }

    window.expenseChartInstance = new Chart(ctx, {
        type: 'bar', // bar chart
        data: {
            labels: labels,
            datasets: [{
                label: 'Expense Amount',
                data: data,
                backgroundColor: '#555'
            }]
        },
        options: {
            scales: {
                y: { beginAtZero: true }
            }
        }
    });
}
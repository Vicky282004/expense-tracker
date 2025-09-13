async function loginUser() {
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    try {
        const res = await fetch("http://localhost:8080/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const err = await res.text();
            alert("Login failed! " + err);
            return;
        }

        const token = await res.text();
        localStorage.setItem("jwtToken", token);
        alert("Login success!");
        window.location.href = "dashboard.html"; // Redirect to dashboard
    } catch (err) {
        console.error(err);
        alert("Login error!");
    }
}

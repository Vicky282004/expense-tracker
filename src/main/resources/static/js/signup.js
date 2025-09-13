async function signupUser() {
    const username = document.getElementById("signup-username").value;
    const password = document.getElementById("signup-password").value;

    try {
        const res = await fetch("http://localhost:8080/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (!res.ok) {
            const err = await res.text();
            alert("Signup failed! " + err);
            return;
        }

        alert("Signup success! Please login.");
        window.location.href = "login.html"; // Redirect to login
    } catch (err) {
        console.error(err);
        alert("Signup error!");
    }
}

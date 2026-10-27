// document.addEventListener('DOMContentLoaded',()=>{if(pmUser()){location.replace('dashboard.html');return}const form=document.getElementById('loginForm');form.addEventListener('submit',e=>{e.preventDefault();const email=document.getElementById('email').value.trim().toLowerCase(),password=document.getElementById('password').value,account=pmAccounts()[email],box=document.getElementById('formMessage');if(!account||account.password!==password){box.className='alert alert-danger';box.textContent='Email or password is incorrect. Please try again.';return}pmSetSession(email);location.replace('dashboard.html')})});





document.addEventListener("DOMContentLoaded", function () {
    // Redirect users who are already logged in
    if (typeof pmUser === "function" && pmUser()) {
        window.location.replace("index.html");
        return;
    }

    const form = document.getElementById("login");
    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const messageBox = document.getElementById("formMessage");

    if (!form || !emailInput || !passwordInput || !messageBox) {
        console.error("Login form elements not found. Check login.html IDs.");
        return;
    }

    function showMessage(message, success = false) {
        messageBox.className = success
            ? "alert alert-success"
            : "alert alert-danger";

        messageBox.textContent = message;
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function showFieldError(input, message) {
        const field = input.closest(".form-field");
        if (!field) return;

        field.classList.remove("success");
        field.classList.add("error");

        const small = field.querySelector("small");
        if (small) small.textContent = message;
    }

    function clearFieldError(input) {
        const field = input.closest(".form-field");
        if (!field) return;

        field.classList.remove("error");
        field.classList.add("success");

        const small = field.querySelector("small");
        if (small) small.textContent = "";
    }

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        let valid = true;

        if (!email) {
            showFieldError(emailInput, "Email cannot be empty.");
            valid = false;
        } else if (!validateEmail(email)) {
            showFieldError(emailInput, "Enter a valid email address.");
            valid = false;
        } else {
            clearFieldError(emailInput);
        }

        if (!password.trim()) {
            showFieldError(passwordInput, "Password cannot be empty.");
            valid = false;
        } else {
            clearFieldError(passwordInput);
        }

        if (!valid) {
            showMessage("Please correct the errors above.");
            return;
        }

        let account = null;

        // First, check the original PatternMe account system.
        if (typeof pmAccounts === "function") {
            try {
                const accounts = pmAccounts();
                account = accounts?.[email] || null;
            } catch (error) {
                console.error("Could not read PatternMe accounts:", error);
            }
        }

        // Fallback: check accounts stored by register.js.
        if (!account) {
            try {
                const users = JSON.parse(
                    localStorage.getItem("registeredUsers") || "[]"
                );

                if (Array.isArray(users)) {
                    account = users.find(user =>
                        user.email?.trim().toLowerCase() === email
                    ) || null;
                }
            } catch (error) {
                console.error("Could not read registeredUsers:", error);
            }
        }

        // Verify the password.
        if (!account || account.password !== password) {
            showMessage("Email or password is incorrect. Please try again.");
            showFieldError(passwordInput, "Incorrect credentials.");
            return;
        }

        // Save session using the original PatternMe function.
        if (typeof pmSetSession === "function" &&
            typeof pmAccounts === "function") {
            pmSetSession(email);
        } else {
            localStorage.setItem("currentUser", JSON.stringify({
                username: account.username || account.name || "",
                email: account.email || email
            }));
        }

        showMessage("Login successful! Redirecting...", true);

        setTimeout(function () {
            window.location.replace("index.html");
        }, 800);
    });

    // Validate fields while typing.
    emailInput.addEventListener("input", function () {
        messageBox.className = "alert d-none";

        if (!emailInput.value.trim()) {
            showFieldError(emailInput, "Email cannot be empty.");
        } else if (!validateEmail(emailInput.value.trim())) {
            showFieldError(emailInput, "Enter a valid email address.");
        } else {
            clearFieldError(emailInput);
        }
    });

    passwordInput.addEventListener("input", function () {
        messageBox.className = "alert d-none";

        if (!passwordInput.value.trim()) {
            showFieldError(passwordInput, "Password cannot be empty.");
        } else {
            clearFieldError(passwordInput);
        }
    });
});

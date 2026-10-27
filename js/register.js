document.addEventListener('DOMContentLoaded', () => {
    if (typeof pmUser === 'function' && pmUser()) {
        location.replace('index.html');
        return;
    }

    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmInput = document.getElementById('confirmPassword');
    const form = document.getElementById('registerForm');
    const messageBox = document.getElementById('formMessage');

    const isRequired = value => value.trim() !== '';
    const isBetween = (length, min, max) => length >= min && length <= max;
    const validName = value => /^[a-zA-Z ]+$/.test(value);
    const validEmail = value => /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
    const validPassword = value => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value);

    function showError(input, message) {
        const field = input.closest('.form-field') || input.parentElement;
        field.classList.remove('success');
        field.classList.add('error');
        const small = field.querySelector('small');
        if (small) small.textContent = message;
        input.setAttribute('aria-invalid', 'true');
    }

    function showSuccess(input) {
        const field = input.closest('.form-field') || input.parentElement;
        field.classList.remove('error');
        field.classList.add('success');
        const small = field.querySelector('small');
        if (small) small.textContent = '';
        input.setAttribute('aria-invalid', 'false');
    }

    function checkName() {
        const value = nameInput.value.trim();
        if (!isRequired(value)) return showError(nameInput, 'Name cannot be empty'), false;
        if (!isBetween(value.length, 3, 25)) return showError(nameInput, 'Name must be 3–25 characters long'), false;
        if (!validName(value)) return showError(nameInput, 'Name can contain only letters and spaces'), false;
        showSuccess(nameInput); return true;
    }

    function checkEmail() {
        const value = emailInput.value.trim();
        if (!isRequired(value)) return showError(emailInput, 'Email cannot be empty'), false;
        if (!validEmail(value)) return showError(emailInput, 'Enter a valid email address'), false;
        showSuccess(emailInput); return true;
    }

    function checkPassword() {
        const value = passwordInput.value;
        if (!isRequired(value)) return showError(passwordInput, 'Password cannot be empty'), false;
        if (!validPassword(value)) return showError(passwordInput, 'Use 8+ characters with uppercase, lowercase, a number and a special character (@$!%*?&)'), false;
        showSuccess(passwordInput); return true;
    }

    function checkConfirmPassword() {
        const value = confirmInput.value;
        if (!isRequired(value)) return showError(confirmInput, 'Please confirm your password'), false;
        if (value !== passwordInput.value) return showError(confirmInput, 'Passwords do not match'), false;
        showSuccess(confirmInput); return true;
    }

    function showMessage(message, type = 'danger') {
        messageBox.className = `alert alert-${type}`;
        messageBox.textContent = message;
    }

    function clearMessage() {
        messageBox.className = 'alert d-none';
        messageBox.textContent = '';
    }

    nameInput.addEventListener('input', checkName);
    emailInput.addEventListener('input', checkEmail);
    passwordInput.addEventListener('input', () => {
        checkPassword();
        if (confirmInput.value) checkConfirmPassword();
    });
    confirmInput.addEventListener('input', checkConfirmPassword);

    form.addEventListener('submit', event => {
        event.preventDefault();
        clearMessage();
        const valid = [checkName(), checkEmail(), checkPassword(), checkConfirmPassword()].every(Boolean);
        if (!valid) return;

        const name = nameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const password = passwordInput.value;

        try {
            // Use PatternMe's shared account store so login and dashboard remain compatible.
            const accounts = typeof pmAccounts === 'function' ? pmAccounts() : {};
            if (accounts[email]) {
                showError(emailInput, 'An account with this email already exists. Please log in.');
                return;
            }

            accounts[email] = {
                name,
                email,
                password,
                entries: {},
                habits: [],
                createdAt: new Date().toISOString()
            };

            if (typeof pmSaveAccounts === 'function') {
                pmSaveAccounts(accounts);
                if (typeof pmSetSession === 'function') pmSetSession(email);
            } else {
                // Fallback for standalone use; the bundled app uses pmAccounts/pmSaveAccounts.
                const users = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
                if (users.some(user => String(user.email).toLowerCase() === email)) {
                    showError(emailInput, 'An account with this email already exists. Please log in.');
                    return;
                }
                users.push({ name, email, password });
                localStorage.setItem('registeredUsers', JSON.stringify(users));
            }

            showMessage(`Registration successful! Welcome to PatternMe, ${name}.`, 'success');
            form.reset();
            form.querySelectorAll('.form-field').forEach(field => field.classList.remove('success', 'error'));
            // This project signs in the new demo account immediately.
            setTimeout(() => location.replace('index.html'), 900);
        } catch (error) {
            showMessage('Could not save your account in this browser. Check storage settings and try again.');
        }
    });
});

// Login Form Handler
document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('loginId');
    const passwordInput = document.getElementById('password');
    const loginButton = loginForm.querySelector('.login-button');

    // Form Submit Event
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Basic Validation
        if (!validateForm(username, password)) {
            return;
        }

        // Disable button during processing
        loginButton.disabled = true;
        loginButton.textContent = '로그인 중...';

        // Simulate login process (Replace with actual API call)
        setTimeout(function() {
            handleLogin(username, password);
        }, 1000);
    });

    // Form Validation
    function validateForm(username, password) {
        if (!username) {
            san.infoAlert('아이디를 입력해주세요.');
            usernameInput.focus();
            return false;
        }

        if (!password) {
            san.infoAlert('비밀번호를 입력해주세요.');
            passwordInput.focus();
            return false;
        }

        return true;
    }

    // Login Handler
    async function handleLogin(loginId, password) {

        try {
            await login(loginId, password);
        }catch (error) {
            resetForm();
        }
    }

    // Reset Form State
    function resetForm() {
        loginButton.disabled = false;
        loginButton.textContent = '로그인';
    }

    // Input Enter Key Handler
    usernameInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });

    passwordInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            loginForm.dispatchEvent(new Event('submit'));
        }
    });
});

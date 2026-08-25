/* ============================================================
   LOGIN PAGE SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const emailInput = document.getElementById('login-email');
  const passwordInput = document.getElementById('login-password');
  const togglePassBtn = document.getElementById('toggle-password-btn');
  const demoLoginBtn = document.getElementById('demo-login-btn');
  const errorAlert = document.getElementById('login-error-alert');

  // Toggle password visibility
  if (togglePassBtn && passwordInput) {
    togglePassBtn.onclick = () => {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      togglePassBtn.textContent = type === 'password' ? 'Show' : 'Hide';
    };
  }

  // Demo Login Button
  if (demoLoginBtn) {
    demoLoginBtn.onclick = () => {
      demoLoginBtn.disabled = true;
      demoLoginBtn.textContent = 'Authenticating Demo User...';
      setTimeout(() => {
        const res = Auth.demoLogin();
        if (res.success) {
          Toast.success('Authenticated as Demo User! Redirecting...');
          window.location.href = 'dashboard.html';
        } else {
          Toast.error(res.message || 'Demo login failed.');
          demoLoginBtn.disabled = false;
          demoLoginBtn.textContent = 'Continue with Demo Account';
        }
      }, 400);
    };
  }

  // Standard Login Form Submit
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();
      errorAlert.classList.add('hidden');

      const email = emailInput.value.trim();
      const password = passwordInput.value;

      if (!Validators.isRequired(email) || !Validators.isValidEmail(email)) {
        showError('Please enter a valid email address.');
        emailInput.classList.add('is-invalid');
        return;
      }
      emailInput.classList.remove('is-invalid');

      if (!Validators.isRequired(password)) {
        showError('Please enter your password.');
        passwordInput.classList.add('is-invalid');
        return;
      }
      passwordInput.classList.remove('is-invalid');

      const result = Auth.login(email, password);
      if (result.success) {
        Toast.success('Login successful! Redirecting to Dashboard...');
        window.location.href = 'dashboard.html';
      } else {
        showError(result.message);
      }
    };
  }

  function showError(msg) {
    if (errorAlert) {
      errorAlert.textContent = msg;
      errorAlert.classList.remove('hidden');
    } else {
      Toast.error(msg);
    }
  }
});

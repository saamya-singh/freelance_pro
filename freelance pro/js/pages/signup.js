/* ============================================================
   SIGNUP PAGE SCRIPT & PASSWORD STRENGTH METER
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('signup-form');
  const nameInput = document.getElementById('signup-name');
  const emailInput = document.getElementById('signup-email');
  const passwordInput = document.getElementById('signup-password');
  const confirmInput = document.getElementById('signup-confirm-password');
  const strengthLabel = document.getElementById('strength-label');
  const meterSegments = document.querySelectorAll('.meter-segment');
  const reqItems = {
    minLength: document.getElementById('req-length'),
    uppercase: document.getElementById('req-uppercase'),
    lowercase: document.getElementById('req-lowercase'),
    number: document.getElementById('req-number'),
    special: document.getElementById('req-special')
  };

  // Live Password Strength Checker while typing
  if (passwordInput) {
    passwordInput.addEventListener('input', () => {
      const val = passwordInput.value;
      const evaluation = Validators.evaluatePasswordStrength(val);

      // Update Label
      if (strengthLabel) {
        strengthLabel.textContent = evaluation.label;
        strengthLabel.style.color = evaluation.color;
      }

      // Update Progress Meter Bar Segments
      meterSegments.forEach((seg, idx) => {
        if (idx < evaluation.score) {
          seg.style.backgroundColor = evaluation.color;
        } else {
          seg.style.backgroundColor = 'transparent';
        }
      });

      // Update Requirements List
      Object.keys(reqItems).forEach(key => {
        const itemEl = reqItems[key];
        if (itemEl) {
          if (evaluation.requirements[key]) {
            itemEl.classList.add('met');
            itemEl.querySelector('.req-icon').textContent = '✓';
          } else {
            itemEl.classList.remove('met');
            itemEl.querySelector('.req-icon').textContent = '○';
          }
        }
      });
    });
  }

  // Form Submit Handler
  if (form) {
    form.onsubmit = (e) => {
      e.preventDefault();

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const password = passwordInput.value;
      const confirmPassword = confirmInput.value;

      if (!Validators.isRequired(name)) {
        Toast.error('Please enter your full name.');
        return;
      }

      if (!Validators.isValidEmail(email)) {
        Toast.error('Please enter a valid email address.');
        return;
      }

      const evalResult = Validators.evaluatePasswordStrength(password);
      if (evalResult.score < 2) {
        Toast.error('Please choose a stronger password matching the requirements.');
        return;
      }

      if (password !== confirmPassword) {
        Toast.error('Passwords do not match.');
        return;
      }

      const res = Auth.signup(name, email, password);
      if (res.success) {
        Toast.success('Account created successfully! Welcome to FreelanceLedger.');
        window.location.href = 'dashboard.html';
      } else {
        Toast.error(res.message);
      }
    };
  }
});

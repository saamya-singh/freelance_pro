/* ============================================================
   VALIDATORS & PASSWORD STRENGTH CALCULATOR
   ============================================================ */

const Validators = {
  // Validate Email syntax
  isValidEmail(email) {
    if (!email) return false;
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  // Password Strength Meter Evaluator
  evaluatePasswordStrength(password) {
    if (!password) {
      return {
        score: 0,
        label: 'Very Weak',
        color: '#D9D9D2',
        requirements: {
          minLength: false,
          uppercase: false,
          lowercase: false,
          number: false,
          special: false
        }
      };
    }

    const minLength = password.length >= 8;
    const uppercase = /[A-Z]/.test(password);
    const lowercase = /[a-z]/.test(password);
    const number = /[0-9]/.test(password);
    const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    let score = 0;
    if (minLength) score++;
    if (uppercase && lowercase) score++;
    if (number) score++;
    if (special) score++;

    let label = 'Very Weak';
    let color = '#9E2A2A';

    if (score === 1) {
      label = 'Weak';
      color = '#D9534F';
    } else if (score === 2) {
      label = 'Fair';
      color = '#F0AD4E';
    } else if (score === 3) {
      label = 'Strong';
      color = '#5CB85C';
    } else if (score >= 4) {
      label = 'Very Strong';
      color = '#205432';
    }

    return {
      score,
      label,
      color,
      requirements: {
        minLength,
        uppercase,
        lowercase,
        number,
        special
      }
    };
  },

  // Required Field Validator
  isRequired(value) {
    if (typeof value === 'string') return value.trim().length > 0;
    return value !== null && value !== undefined;
  },

  // Positive Number Validator
  isPositiveNumber(val) {
    const num = Number(val);
    return !isNaN(num) && num >= 0;
  },

  // GSTIN Format Validator (India 15 chars e.g. 27ABCDE1234F1Z5)
  isValidGSTIN(gstin) {
    if (!gstin) return true; // Optional field check
    const re = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    return re.test(String(gstin).toUpperCase()) || gstin === "URP-NOT-APPLICABLE";
  },

  // PAN Format Validator (India 10 chars e.g. ABCDE1234F)
  isValidPAN(pan) {
    if (!pan) return true; // Optional
    const re = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    return re.test(String(pan).toUpperCase()) || pan === "NOTAPPLICABLE";
  }
};

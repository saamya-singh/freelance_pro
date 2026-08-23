/* ============================================================
   REUSABLE TOAST NOTIFICATION SYSTEM
   ============================================================ */

const Toast = {
  container: null,

  init() {
    if (this.container) return;
    this.container = document.createElement('div');
    this.container.id = 'toast-container';
    this.container.style.cssText = `
      position: fixed;
      bottom: 1.5rem;
      right: 1.5rem;
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      max-width: 380px;
      width: calc(100% - 3rem);
      pointer-events: none;
    `;
    document.body.appendChild(this.container);
  },

  show(message, type = 'info', duration = 3500) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.style.cssText = `
      pointer-events: auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.75rem;
      padding: 0.85rem 1.25rem;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
      box-shadow: var(--shadow-dropdown);
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary);
      transform: translateY(20px);
      opacity: 0;
      transition: all 250ms cubic-bezier(0.16, 1, 0.3, 1);
    `;

    // Type indicator border
    if (type === 'success') toast.style.borderLeft = '4px solid var(--status-success-text)';
    if (type === 'error') toast.style.borderLeft = '4px solid var(--status-danger-text)';
    if (type === 'warning') toast.style.borderLeft = '4px solid var(--status-warning-text)';
    if (type === 'info') toast.style.borderLeft = '4px solid var(--status-info-text)';

    toast.innerHTML = `
      <span>${Utils.escapeHtml(message)}</span>
      <button style="background:none;border:none;cursor:pointer;color:var(--text-tertiary);font-size:1.1rem;line-height:1;">&times;</button>
    `;

    const closeBtn = toast.querySelector('button');
    closeBtn.onclick = () => this.dismiss(toast);

    this.container.appendChild(toast);

    // Trigger enter animation
    requestAnimationFrame(() => {
      toast.style.transform = 'translateY(0)';
      toast.style.opacity = '1';
    });

    if (duration > 0) {
      setTimeout(() => this.dismiss(toast), duration);
    }
  },

  dismiss(toast) {
    toast.style.transform = 'translateY(10px)';
    toast.style.opacity = '0';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 250);
  },

  success(msg, duration) { this.show(msg, 'success', duration); },
  error(msg, duration) { this.show(msg, 'error', duration); },
  warning(msg, duration) { this.show(msg, 'warning', duration); },
  info(msg, duration) { this.show(msg, 'info', duration); }
};

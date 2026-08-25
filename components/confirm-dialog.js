/* ============================================================
   REUSABLE CONFIRMATION DIALOG COMPONENT
   ============================================================ */

const ConfirmDialog = {
  dialogEl: null,
  onConfirmCallback: null,

  init() {
    if (this.dialogEl) return;

    this.dialogEl = document.createElement('div');
    this.dialogEl.id = 'confirm-dialog-backdrop';
    this.dialogEl.className = 'modal-backdrop';
    this.dialogEl.style.cssText = `
      position: fixed;
      inset: 0;
      z-index: 9999;
      background: rgba(17, 17, 17, 0.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
      opacity: 0;
      visibility: hidden;
      transition: all 200ms ease-out;
    `;

    this.dialogEl.innerHTML = `
      <div class="confirm-dialog-box" style="
        background: var(--bg-card);
        border: 1px solid var(--border-dark);
        border-radius: var(--radius-md);
        max-width: 440px;
        width: 100%;
        padding: 1.75rem;
        box-shadow: var(--shadow-modal);
        transform: scale(0.96);
        transition: transform 200ms ease-out;
      ">
        <h3 id="confirm-dialog-title" style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem; color: var(--text-primary);">Confirm Action</h3>
        <p id="confirm-dialog-desc" style="font-size: 0.9rem; color: var(--text-secondary); margin-bottom: 1.5rem; line-height: 1.5;">Are you sure you want to perform this action? This action cannot be undone.</p>
        <div style="display: flex; justify-content: flex-end; gap: 0.75rem;">
          <button id="confirm-cancel-btn" class="btn btn-secondary">Cancel</button>
          <button id="confirm-action-btn" class="btn btn-danger">Confirm Delete</button>
        </div>
      </div>
    `;

    document.body.appendChild(this.dialogEl);

    const cancelBtn = this.dialogEl.querySelector('#confirm-cancel-btn');
    const actionBtn = this.dialogEl.querySelector('#confirm-action-btn');

    cancelBtn.onclick = () => this.close();
    actionBtn.onclick = () => {
      if (typeof this.onConfirmCallback === 'function') {
        this.onConfirmCallback();
      }
      this.close();
    };

    this.dialogEl.onclick = (e) => {
      if (e.target === this.dialogEl) this.close();
    };
  },

  show(title, desc, confirmBtnText = 'Confirm', onConfirm, isDanger = true) {
    this.init();

    document.getElementById('confirm-dialog-title').innerText = title;
    document.getElementById('confirm-dialog-desc').innerText = desc;

    const actionBtn = document.getElementById('confirm-action-btn');
    actionBtn.innerText = confirmBtnText;
    actionBtn.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';

    this.onConfirmCallback = onConfirm;

    this.dialogEl.style.visibility = 'visible';
    this.dialogEl.style.opacity = '1';
    const box = this.dialogEl.querySelector('.confirm-dialog-box');
    box.style.transform = 'scale(1)';
    document.body.style.overflow = 'hidden';
  },

  close() {
    if (!this.dialogEl) return;
    this.dialogEl.style.opacity = '0';
    const box = this.dialogEl.querySelector('.confirm-dialog-box');
    box.style.transform = 'scale(0.96)';

    setTimeout(() => {
      this.dialogEl.style.visibility = 'hidden';
      document.body.style.overflow = '';
    }, 200);
  }
};

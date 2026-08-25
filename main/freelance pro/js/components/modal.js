/* ============================================================
   TAILWIND MODAL COMPONENT WRAPPER WITH LEGACY COMPATIBILITY
   ============================================================ */

const Modal = {
  create(options = {}) {
    const {
      title = '',
      content = '',
      widthClass = 'max-w-2xl',
      footerHtml = '',
      onClose = null
    } = options;

    // Remove any existing modals
    const existing = document.getElementById('app-modal-backdrop');
    if (existing) existing.remove();

    const backdrop = document.createElement('div');
    backdrop.id = 'app-modal-backdrop';
    backdrop.className = 'fixed inset-0 z-[9000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto animate-fade-in';

    backdrop.innerHTML = `
      <div class="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl w-full ${widthClass} overflow-hidden my-auto flex flex-col transition-colors">
        <!-- Modal Header -->
        <div class="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <h2 class="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">${Utils.escapeHtml(title)}</h2>
          <button id="modal-close-x-btn" class="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Modal Body -->
        <div class="p-6 overflow-y-auto max-h-[75vh] space-y-4">
          ${content}
        </div>

        <!-- Modal Footer -->
        ${footerHtml ? `
          <div class="px-6 py-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
            ${footerHtml}
          </div>
        ` : ''}
      </div>
    `;

    document.body.appendChild(backdrop);

    const closeBtn = backdrop.querySelector('#modal-close-x-btn');
    if (closeBtn) {
      closeBtn.onclick = () => {
        this.close();
        if (onClose) onClose();
      };
    }

    backdrop.onclick = (e) => {
      if (e.target === backdrop) {
        this.close();
        if (onClose) onClose();
      }
    };

    return backdrop;
  },

  createModal(id, title, content, footerHtml, widthClass = 'max-w-xl') {
    return this.create({ title, content, widthClass, footerHtml });
  },

  open(id) {
    // Auto opened on create
  },

  close(id) {
    const backdrop = document.getElementById('app-modal-backdrop');
    if (backdrop) backdrop.remove();
  }
};

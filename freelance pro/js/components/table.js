/* ============================================================
   TAILWIND DYNAMIC DATA TABLE COMPONENT
   ============================================================ */

const DataTable = {
  render(containerId, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const {
      columns = [],
      data = [],
      emptyTitle = 'No data found',
      emptyDesc = 'Get started by creating a new entry.',
      onRowClick = null
    } = options;

    if (!data || data.length === 0) {
      container.innerHTML = `
        <div class="text-center py-16 px-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm">
          <div class="w-12 h-12 mx-auto mb-4 text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
          </div>
          <div class="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">${Utils.escapeHtml(emptyTitle)}</div>
          <div class="text-xs text-slate-500 max-w-xs mx-auto mb-4">${Utils.escapeHtml(emptyDesc)}</div>
        </div>
      `;
      return;
    }

    let html = `
      <div class="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900 shadow-sm transition-colors">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 dark:bg-slate-950/60 border-b border-slate-200 dark:border-slate-800 text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            <tr>
    `;

    columns.forEach(col => {
      html += `<th class="px-5 py-3.5 ${col.style || ''}">${col.header}</th>`;
    });

    html += `
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
    `;

    data.forEach((item, index) => {
      html += `<tr data-index="${index}" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors ${onRowClick ? 'cursor-pointer' : ''}">`;
      columns.forEach(col => {
        let val = '';
        if (typeof col.render === 'function') {
          val = col.render(item, index);
        } else if (col.key) {
          val = Utils.escapeHtml(item[col.key] || '');
        }
        html += `<td class="px-5 py-4 align-middle ${col.style || ''}">${val}</td>`;
      });
      html += `</tr>`;
    });

    html += `
          </tbody>
        </table>
      </div>
    `;

    container.innerHTML = html;

    if (onRowClick) {
      const rows = container.querySelectorAll('tbody tr');
      rows.forEach(row => {
        row.onclick = (e) => {
          if (e.target.closest('button') || e.target.closest('a')) return;
          const idx = row.getAttribute('data-index');
          onRowClick(data[idx]);
        };
      });
    }
  }
};

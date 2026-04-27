let notes = [];
let toastTimer = null;

// ── Storage ──────────────────────────────────────────────

function load() {
  chrome.storage.local.get(['notes'], (r) => {
    notes = r.notes || [];
    render();
  });
}

function save() {
  chrome.storage.local.set({ notes });
}

// ── CRUD ─────────────────────────────────────────────────

function addNote() {
  const title   = document.getElementById('noteTitle').value.trim();
  const content = document.getElementById('noteContent').value.trim();
  if (!title && !content) return;

  notes.unshift({ id: Date.now(), title: title || 'Untitled', content });
  save();

  document.getElementById('noteTitle').value   = '';
  document.getElementById('noteContent').value = '';
  document.getElementById('searchInput').value  = '';
  render();
}

function deleteNote(id) {
  notes = notes.filter(n => n.id !== id);
  save();
  render();
}

// ── Clipboard ─────────────────────────────────────────────

function copy(text, msg = 'Copied!') {
  navigator.clipboard.writeText(text).then(() => toast(msg));
}

function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

// ── Render ────────────────────────────────────────────────

function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderLines(content) {
  return content
    .split('\n')
    .map(line => `<span class="line">${esc(line) || '&nbsp;'}</span>`)
    .join('');
}

function render() {
  const filter = document.getElementById('searchInput').value.toLowerCase();
  const list   = document.getElementById('notesList');

  const filtered = filter
    ? notes.filter(n =>
        n.title.toLowerCase().includes(filter) ||
        n.content.toLowerCase().includes(filter)
      )
    : notes;

  if (filtered.length === 0) {
    list.innerHTML = `<div class="empty-state">${
      filter ? 'No notes match your search.' : 'No notes yet.<br>Add your first one above.'
    }</div>`;
    return;
  }

  list.innerHTML = filtered.map(note => `
    <div class="note-card" data-id="${note.id}">
      <div class="note-header">
        <span class="note-title" title="${esc(note.title)}">${esc(note.title)}</span>
        <div class="note-actions">
          <button class="btn btn-blue js-copy"   data-id="${note.id}">Copy</button>
          <button class="btn btn-ghost js-toggle" data-id="${note.id}">Show</button>
          <button class="btn btn-danger js-del"   data-id="${note.id}">✕</button>
        </div>
      </div>
      <div class="note-body js-body" data-id="${note.id}">${renderLines(note.content)}</div>
    </div>
  `).join('');

  // Copy full content
  list.querySelectorAll('.js-copy').forEach(btn => {
    btn.addEventListener('click', () => {
      const note = notes.find(n => n.id === +btn.dataset.id);
      if (note) copy(note.content, 'Copied!');
    });
  });

  // Show / Hide toggle
  list.querySelectorAll('.js-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = list.querySelector(`.js-body[data-id="${btn.dataset.id}"]`);
      const revealed = body.classList.toggle('revealed');
      btn.textContent = revealed ? 'Hide' : 'Show';
    });
  });

  // Delete
  list.querySelectorAll('.js-del').forEach(btn => {
    btn.addEventListener('click', () => deleteNote(+btn.dataset.id));
  });

  // Click a single line to copy it (only works when revealed)
  list.querySelectorAll('.js-body').forEach(body => {
    body.addEventListener('click', (e) => {
      if (!body.classList.contains('revealed')) return;
      const line = e.target.closest('.line');
      if (!line) return;
      const text = line.textContent === ' ' ? '' : line.textContent;
      if (!text) return;
      navigator.clipboard.writeText(text).then(() => {
        line.classList.add('flashed');
        setTimeout(() => line.classList.remove('flashed'), 600);
        toast('Line copied!');
      });
    });
  });
}

// ── Init ─────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  load();

  document.getElementById('saveBtn').addEventListener('click', addNote);

  document.getElementById('noteContent').addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'Enter') addNote();
  });

  document.getElementById('searchInput').addEventListener('input', render);
});

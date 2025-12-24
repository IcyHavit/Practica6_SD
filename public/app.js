const API = '/productos';

const tbody = document.getElementById('productos-tbody');
const form = document.getElementById('product-form');
const status = document.getElementById('status');
const title = document.getElementById('form-title');
const cancelBtn = document.getElementById('cancel-btn');
const btnAdd = document.getElementById('btn-add');
const fabAdd = document.getElementById('fab-add');

// modal & toast
const modal = document.getElementById('confirm-modal');
const modalText = document.getElementById('modal-text');
const modalCancel = document.getElementById('modal-cancel');
const modalConfirm = document.getElementById('modal-confirm');
const toast = document.getElementById('toast');

let productos = [];
let pendingDeleteId = null;
let submitting = false;

async function fetchProducts() {
  try {
    const res = await fetch(API);
    productos = await res.json();
    renderProducts();
  } catch (err) {
    showToast('Error al obtener productos', true);
  }
}

function renderProducts() {
  if (!productos || productos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty">No hay productos</td></tr>';
    return;
  }
  tbody.innerHTML = productos.map(p => `
    <tr>
      <td>${p.id}</td>
      <td>${escapeHtml(p.nombre)}</td>
      <td>$ ${Number(p.precio).toFixed(2)}</td>
      <td class="actions-cell">
        <button class="edit-btn" data-id="${p.id}">Editar</button>
        <button class="delete-btn" data-id="${p.id}">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

function escapeHtml(s){
  return s && s.toString().replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function submitForm(e){
  e.preventDefault();
  if (submitting) return;
  const id = document.getElementById('product-id').value;
  const nombre = document.getElementById('nombre').value.trim();
  const precio = parseFloat(document.getElementById('precio').value);
  if (!nombre || isNaN(precio)) return showToast('Nombre y precio válidos son requeridos', true);
  submitting = true; updateFormState();

  try {
    if (id) {
      const res = await fetch(`${API}/${id}`, {
        method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ nombre, precio })
      });
      if (!res.ok) throw new Error('Fallo al actualizar');
      showToast('Producto actualizado');
    } else {
      const res = await fetch(API, {
        method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ nombre, precio })
      });
      if (!res.ok) throw new Error('Fallo al crear');
      showToast('Producto creado');
    }
    resetForm();
    fetchProducts();
  } catch (err) {
    showToast(err.message || 'Error en operación', true);
  } finally { submitting = false; updateFormState(); }
}

function updateFormState(){
  const submitBtn = form.querySelector('button[type="submit"]');
  if (submitting){ submitBtn.textContent = 'Guardando...'; submitBtn.disabled = true; }
  else { submitBtn.textContent = 'Guardar'; submitBtn.disabled = false; }
}

form.addEventListener('submit', submitForm);
cancelBtn.addEventListener('click', (e) => { resetForm(); });

// add button behavior
function focusFormForAdd(){ resetForm(); document.getElementById('nombre').focus(); window.scrollTo({top:0,behavior:'smooth'}); }
btnAdd && btnAdd.addEventListener('click', focusFormForAdd);
fabAdd && fabAdd.addEventListener('click', focusFormForAdd);

tbody.addEventListener('click', async (e) => {
  const id = e.target.dataset.id;
  if (!id) return;
  if (e.target.classList.contains('delete-btn')) {
    openConfirm(id, '¿Eliminar este producto?');
  } else if (e.target.classList.contains('edit-btn')) {
    const p = productos.find(x => x.id === parseInt(id));
    if (!p) return showToast('Producto no encontrado', true);
    document.getElementById('product-id').value = p.id;
    document.getElementById('nombre').value = p.nombre;
    document.getElementById('precio').value = p.precio;
    title.textContent = 'Editar producto';
    window.scrollTo({top:0,behavior:'smooth'});
  }
});

// Confirm modal
function openConfirm(id, text){ pendingDeleteId = id; modalText.textContent = text; modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false'); }
function closeConfirm(){ pendingDeleteId = null; modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true'); }
modalCancel.addEventListener('click', closeConfirm);
modal.addEventListener('click', (ev)=>{ if (ev.target.classList.contains('modal-backdrop')) closeConfirm(); });

modalConfirm.addEventListener('click', async ()=>{
  if (!pendingDeleteId) return closeConfirm();
  modalConfirm.disabled = true;
  try {
    const res = await fetch(`${API}/${pendingDeleteId}`, { method: 'DELETE' });
    if (res.status !== 204) throw new Error('Fallo al eliminar');
    showToast('Producto eliminado');
    closeConfirm();
    fetchProducts();
  } catch (err) { showToast(err.message || 'Error al eliminar', true); }
  modalConfirm.disabled = false;
});

function resetForm() {
  document.getElementById('product-id').value = '';
  document.getElementById('nombre').value = '';
  document.getElementById('precio').value = '';
  title.textContent = 'Agregar producto';
  status.textContent = '';
}

function showToast(msg, isError){
  toast.textContent = msg;
  toast.style.background = isError ? 'var(--danger)' : '#111827';
  toast.classList.add('show');
  setTimeout(()=>{ toast.classList.remove('show'); }, 3000);
}

// arrancar
fetchProducts();

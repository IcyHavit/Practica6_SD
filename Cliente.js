const axios = require('axios');

// URL de nuestro servidor
const baseUrl = 'http://18.223.173.173:8081/productos';

// Obtener todos los productos
async function obtenerProductos() {
  try {
    const respuesta = await axios.get(baseUrl);
    console.log('Productos:', respuesta.data);
  } catch (error) {
    console.error('Error al obtener productos:', error);
  }
}

// Obtener un producto por ID
async function obtenerProductoPorId(id) {
  try {
    const respuesta = await axios.get(`${baseUrl}/${id}`);
    console.log('Producto:', respuesta.data);
  } catch (error) {
    console.error('Error al obtener producto:', error);
  }
}

// Agregar un nuevo producto
async function agregarProducto(nombre, precio) {
  try {
    const nuevoProducto = { nombre, precio };
    const respuesta = await axios.post(baseUrl, nuevoProducto);
    console.log('Producto agregado:', respuesta.data);
  } catch (error) {
    console.error('Error al agregar producto:', error);
  }
}

// Actualizar un producto existente
async function actualizarProducto(id, nombre, precio) {
  try {
    const actualizado = { nombre, precio };
    const respuesta = await axios.put(`${baseUrl}/${id}`, actualizado);
    console.log('Producto actualizado:', respuesta.data);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
  }
}

// Eliminar un producto por ID
async function eliminarProducto(id) {
  try {
    await axios.delete(`${baseUrl}/${id}`);
    console.log('Producto eliminado');
  } catch (error) {
    console.error('Error al eliminar producto:', error);
  }
}

// Ejecutar operaciones (ejemplo)
(async () => {
  // Obtener productos
  await obtenerProductos();

  // Agregar un nuevo producto
  await agregarProducto('Leche', 40.0);

  // Actualizar un producto (ID 1)
  await actualizarProducto(1, 'Café Premium', 60.0);

  // Eliminar un producto (ID 2)
  await eliminarProducto(2);

  // Obtener productos nuevamente
  await obtenerProductos();
})();

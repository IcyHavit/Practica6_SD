const express = require('express');
const path = require('path');
const app = express();

// 🔴 CAMBIO CLAVE AQUÍ
const port = process.env.PORT || 8081;

// Middleware
app.use(express.json());

// Datos en memoria
let productos = [
  { id: 1, nombre: 'Café', precio: 50.0 },
  { id: 2, nombre: 'Té', precio: 30.0 }
];

// Rutas API
app.get('/productos', (req, res) => {
  res.json(productos);
});

app.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).send('Producto no encontrado');
  res.json(producto);
});

app.post('/productos', (req, res) => {
  const { nombre, precio } = req.body;
  const nuevoProducto = {
    id: productos.length + 1,
    nombre,
    precio
  };
  productos.push(nuevoProducto);
  res.status(201).json(nuevoProducto);
});

app.put('/productos/:id', (req, res) => {
  const { nombre, precio } = req.body;
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).send('Producto no encontrado');
  producto.nombre = nombre || producto.nombre;
  producto.precio = precio || producto.precio;
  res.json(producto);
});

app.delete('/productos/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Producto no encontrado');
  productos.splice(index, 1);
  res.status(204).send();
});

// 🔹 Servir frontend
app.use(express.static(path.join(__dirname, 'public')));

// 🔹 Ruta raíz
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 🔹 Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor Express activo en puerto ${port}`);
});

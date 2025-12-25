const express = require('express');
const app = express();

// Middleware para manejar solicitudes con cuerpos JSON
app.use(express.json());

// "Base de datos" temporal en memoria (en producción, usaríamos una base de datos real)
let productos = [
  { id: 1, nombre: 'Café', precio: 50.0 },
  { id: 2, nombre: 'Té', precio: 30.0 }
];

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
  res.json(productos);
});

// Ruta para obtener un producto por su ID
app.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).send('Producto no encontrado');
  res.json(producto);
});

// Ruta para agregar un nuevo producto
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

// Ruta para actualizar un producto
app.put('/productos/:id', (req, res) => {
  const { nombre, precio } = req.body;
  const producto = productos.find(p => p.id === parseInt(req.params.id));
  if (!producto) return res.status(404).send('Producto no encontrado');
  producto.nombre = nombre || producto.nombre;
  producto.precio = precio || producto.precio;
  res.json(producto);
});

// Ruta para eliminar un producto
app.delete('/productos/:id', (req, res) => {
  const index = productos.findIndex(p => p.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).send('Producto no encontrado');
  productos.splice(index, 1);
  res.status(204).send();
});

// Servir archivos estáticos desde 'public'
app.use(express.static('public'));

const port = process.env.PORT || 8081;

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});


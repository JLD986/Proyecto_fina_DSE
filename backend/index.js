const express = require('express');
const app = express();
const PORT = 3000;

app.use(express.json());

// Datos temporales
const productos = [
  { _id: '1', nombre: 'Monitor Samsung 24"', categoria: 'Electrónica', stock: 10, precio: '$250.00' },
  { _id: '2', nombre: 'Teclado Mecánico', categoria: 'Periféricos', stock: 5, precio: '$80.00' },
  { _id: '3', nombre: 'Mouse Inalámbrico', categoria: 'Periféricos', stock: 2, precio: '$35.00' }
];

const categorias = [
  { _id: '1', nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos' },
  { _id: '2', nombre: 'Periféricos', descripcion: 'Accesorios de computadora' }
];

// Endpoints GET
app.get('/', (req, res) => {
  res.send('API de Producto Inventario funcionando');
});

app.get('/productos', (req, res) => {
  res.json(productos);
});

app.get('/productos/:id', (req, res) => {
  const producto = productos.find(p => p._id === req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
});

app.get('/categorias', (req, res) => {
  res.json(categorias);
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
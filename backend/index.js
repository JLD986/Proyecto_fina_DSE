const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'secreto123';

app.use(cors());
app.use(express.json());

// Datos temporales
let usuarios = [
  { _id: '1', nombre: 'Admin', email: 'admin@inventario.com', password: bcrypt.hashSync('admin123', 10), rol: 'administrador' },
  { _id: '2', nombre: 'Juan Pérez', email: 'juan@inventario.com', password: bcrypt.hashSync('juan123', 10), rol: 'usuario' }
];

let productos = [
  { _id: '1', nombre: 'Monitor Samsung 24"', categoria: 'Electrónica', stock: 10, precio: '$250.00' },
  { _id: '2', nombre: 'Teclado Mecánico', categoria: 'Periféricos', stock: 5, precio: '$80.00' },
  { _id: '3', nombre: 'Mouse Inalámbrico', categoria: 'Periféricos', stock: 2, precio: '$35.00' }
];

let categorias = [
  { _id: '1', nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos' },
  { _id: '2', nombre: 'Periféricos', descripcion: 'Accesorios de computadora' }
];

let clientes = [
  { _id: '1', nombre: 'Empresa ABC', contacto: 'Carlos Ruiz', telefono: '7777-1234' },
  { _id: '2', nombre: 'Tienda XYZ', contacto: 'Ana Gómez', telefono: '7777-5678' }
];

// Middleware JWT
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ mensaje: 'Acceso denegado. Token requerido.' });
  try {
    const verificado = jwt.verify(token, SECRET);
    req.usuario = verificado;
    next();
  } catch (err) {
    res.status(403).json({ mensaje: 'Token inválido o expirado.' });
  }
};

// Auth
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = usuarios.find(u => u.email === email);
  if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });
  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
  const token = jwt.sign({ _id: usuario._id, nombre: usuario.nombre, rol: usuario.rol }, SECRET, { expiresIn: '8h' });
  res.json({ mensaje: 'Login exitoso', token, usuario: { _id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } });
});

app.get('/', (req, res) => res.send('API de Producto Inventario funcionando'));

// CRUD Productos
app.get('/productos', verificarToken, (req, res) => res.json(productos));
app.get('/productos/:id', verificarToken, (req, res) => {
  const producto = productos.find(p => p._id === req.params.id);
  if (!producto) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(producto);
});
app.post('/productos', verificarToken, (req, res) => {
  const nuevo = { _id: Date.now().toString(), ...req.body };
  productos.push(nuevo);
  res.status(201).json(nuevo);
});
app.put('/productos/:id', verificarToken, (req, res) => {
  const index = productos.findIndex(p => p._id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  productos[index] = { ...productos[index], ...req.body };
  res.json(productos[index]);
});
app.delete('/productos/:id', verificarToken, (req, res) => {
  productos = productos.filter(p => p._id !== req.params.id);
  res.json({ mensaje: 'Producto eliminado' });
});

// CRUD Categorias
app.get('/categorias', (req, res) => res.json(categorias));
app.get('/categorias/:id', (req, res) => {
  const categoria = categorias.find(c => c._id === req.params.id);
  if (!categoria) return res.status(404).json({ mensaje: 'Categoria no encontrada' });
  res.json(categoria);
});
app.post('/categorias', verificarToken, (req, res) => {
  const nueva = { _id: Date.now().toString(), ...req.body };
  categorias.push(nueva);
  res.status(201).json(nueva);
});
app.put('/categorias/:id', verificarToken, (req, res) => {
  const index = categorias.findIndex(c => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Categoria no encontrada' });
  categorias[index] = { ...categorias[index], ...req.body };
  res.json(categorias[index]);
});
app.delete('/categorias/:id', verificarToken, (req, res) => {
  categorias = categorias.filter(c => c._id !== req.params.id);
  res.json({ mensaje: 'Categoria eliminada' });
});

// CRUD Clientes
app.get('/clientes', verificarToken, (req, res) => res.json(clientes));
app.get('/clientes/:id', verificarToken, (req, res) => {
  const cliente = clientes.find(c => c._id === req.params.id);
  if (!cliente) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  res.json(cliente);
});
app.post('/clientes', verificarToken, (req, res) => {
  const nuevo = { _id: Date.now().toString(), ...req.body };
  clientes.push(nuevo);
  res.status(201).json(nuevo);
});
app.put('/clientes/:id', verificarToken, (req, res) => {
  const index = clientes.findIndex(c => c._id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Cliente no encontrado' });
  clientes[index] = { ...clientes[index], ...req.body };
  res.json(clientes[index]);
});
app.delete('/clientes/:id', verificarToken, (req, res) => {
  clientes = clientes.filter(c => c._id !== req.params.id);
  res.json({ mensaje: 'Cliente eliminado' });
});

// CRUD Usuarios
app.get('/usuarios', verificarToken, (req, res) => res.json(usuarios));
app.get('/usuarios/:id', verificarToken, (req, res) => {
  const usuario = usuarios.find(u => u._id === req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  res.json(usuario);
});
app.post('/usuarios', verificarToken, async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const nuevo = { _id: Date.now().toString(), nombre, email, password: await bcrypt.hash(password, 10), rol };
  usuarios.push(nuevo);
  res.status(201).json({ _id: nuevo._id, nombre, email, rol });
});
app.put('/usuarios/:id', verificarToken, (req, res) => {
  const index = usuarios.findIndex(u => u._id === req.params.id);
  if (index === -1) return res.status(404).json({ mensaje: 'Usuario no encontrado' });
  usuarios[index] = { ...usuarios[index], ...req.body };
  res.json(usuarios[index]);
});
app.delete('/usuarios/:id', verificarToken, (req, res) => {
  usuarios = usuarios.filter(u => u._id !== req.params.id);
  res.json({ mensaje: 'Usuario eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
require('dotenv').config();

const adapter = new FileSync('db.json');
const db = low(adapter);

// Datos iniciales
db.defaults({
  usuarios: [
    { _id: '1', nombre: 'Admin', email: 'admin@inventario.com', password: bcrypt.hashSync('admin123', 10), rol: 'administrador' },
    { _id: '2', nombre: 'Juan Pérez', email: 'juan@inventario.com', password: bcrypt.hashSync('juan123', 10), rol: 'usuario' }
  ],
  productos: [
    { _id: '1', nombre: 'Monitor Samsung 24"', categoria: 'Electrónica', stock: 10, precio: '$250.00' },
    { _id: '2', nombre: 'Teclado Mecánico', categoria: 'Periféricos', stock: 5, precio: '$80.00' },
    { _id: '3', nombre: 'Mouse Inalámbrico', categoria: 'Periféricos', stock: 2, precio: '$35.00' }
  ],
  categorias: [
    { _id: '1', nombre: 'Electrónica', descripcion: 'Dispositivos electrónicos' },
    { _id: '2', nombre: 'Periféricos', descripcion: 'Accesorios de computadora' }
  ],
  clientes: [
    { _id: '1', nombre: 'Empresa ABC', contacto: 'Carlos Ruiz', telefono: '7777-1234' },
    { _id: '2', nombre: 'Tienda XYZ', contacto: 'Ana Gómez', telefono: '7777-5678' }
  ]
}).write();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET = process.env.JWT_SECRET || 'secreto123';

app.use(cors());
app.use(express.json());

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

// Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const usuario = db.get('usuarios').find({ email }).value();
  if (!usuario) return res.status(400).json({ mensaje: 'Usuario no encontrado' });
  const passwordValido = await bcrypt.compare(password, usuario.password);
  if (!passwordValido) return res.status(400).json({ mensaje: 'Contraseña incorrecta' });
  const token = jwt.sign({ _id: usuario._id, nombre: usuario.nombre, rol: usuario.rol }, SECRET, { expiresIn: '8h' });
  res.json({ mensaje: 'Login exitoso', token, usuario: { _id: usuario._id, nombre: usuario.nombre, rol: usuario.rol } });
});

app.get('/', (req, res) => res.send('API de Producto Inventario funcionando'));

// CRUD Productos
app.get('/productos', verificarToken, (req, res) => res.json(db.get('productos').value()));
app.get('/productos/:id', verificarToken, (req, res) => {
  const p = db.get('productos').find({ _id: req.params.id }).value();
  if (!p) return res.status(404).json({ mensaje: 'Producto no encontrado' });
  res.json(p);
});
app.post('/productos', verificarToken, (req, res) => {
  const nuevo = { _id: Date.now().toString(), ...req.body };
  db.get('productos').push(nuevo).write();
  res.status(201).json(nuevo);
});
app.put('/productos/:id', verificarToken, (req, res) => {
  db.get('productos').find({ _id: req.params.id }).assign(req.body).write();
  res.json(db.get('productos').find({ _id: req.params.id }).value());
});
app.delete('/productos/:id', verificarToken, (req, res) => {
  db.get('productos').remove({ _id: req.params.id }).write();
  res.json({ mensaje: 'Producto eliminado' });
});

// CRUD Categorias
app.get('/categorias', (req, res) => res.json(db.get('categorias').value()));
app.post('/categorias', verificarToken, (req, res) => {
  const nueva = { _id: Date.now().toString(), ...req.body };
  db.get('categorias').push(nueva).write();
  res.status(201).json(nueva);
});
app.put('/categorias/:id', verificarToken, (req, res) => {
  db.get('categorias').find({ _id: req.params.id }).assign(req.body).write();
  res.json(db.get('categorias').find({ _id: req.params.id }).value());
});
app.delete('/categorias/:id', verificarToken, (req, res) => {
  db.get('categorias').remove({ _id: req.params.id }).write();
  res.json({ mensaje: 'Categoria eliminada' });
});

// CRUD Clientes
app.get('/clientes', verificarToken, (req, res) => res.json(db.get('clientes').value()));
app.post('/clientes', verificarToken, (req, res) => {
  const nuevo = { _id: Date.now().toString(), ...req.body };
  db.get('clientes').push(nuevo).write();
  res.status(201).json(nuevo);
});
app.put('/clientes/:id', verificarToken, (req, res) => {
  db.get('clientes').find({ _id: req.params.id }).assign(req.body).write();
  res.json(db.get('clientes').find({ _id: req.params.id }).value());
});
app.delete('/clientes/:id', verificarToken, (req, res) => {
  db.get('clientes').remove({ _id: req.params.id }).write();
  res.json({ mensaje: 'Cliente eliminado' });
});

// CRUD Usuarios
app.get('/usuarios', verificarToken, (req, res) => res.json(db.get('usuarios').value()));
app.post('/usuarios', verificarToken, async (req, res) => {
  const { nombre, email, password, rol } = req.body;
  const nuevo = { _id: Date.now().toString(), nombre, email, password: await bcrypt.hash(password, 10), rol };
  db.get('usuarios').push(nuevo).write();
  res.status(201).json({ _id: nuevo._id, nombre, email, rol });
});
app.put('/usuarios/:id', verificarToken, (req, res) => {
  db.get('usuarios').find({ _id: req.params.id }).assign(req.body).write();
  res.json(db.get('usuarios').find({ _id: req.params.id }).value());
});
app.delete('/usuarios/:id', verificarToken, (req, res) => {
  db.get('usuarios').remove({ _id: req.params.id }).write();
  res.json({ mensaje: 'Usuario eliminado' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
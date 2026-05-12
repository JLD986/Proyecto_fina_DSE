const express = require('express');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send({ message: 'Backend de Bodega Gestion funcionando correctamente', status: 'OK' });
});

app.listen(port, () => {
  console.log(`Servidor backend escuchando en http://localhost:${port}`);
});

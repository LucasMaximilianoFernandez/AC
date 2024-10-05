const express = require('express');
const path = require('path');
const { body, validationResult } = require('express-validator'); // Importamos express-validator para validaciones
const app = express();
const patientsRouter = require('./routes/patients');
const appointmentsRouter = require('./routes/appointments'); // Importar el router de citas

// Configurar Pug como motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para manejar datos de formularios
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use('/patients', patientsRouter);
app.use('/appointments', appointmentsRouter); // Usar el router de citas


// Ruta principal
app.get('/', (req, res) => {
  res.render('index', { title: 'Agenda de Consultorios' });
});

// Puerto y arranque del servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto http://localhost:${PORT}`);
});
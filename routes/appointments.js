const express = require('express');
const router = express.Router();
const db = require('../models/db');

// Mostrar el formulario para programar citas
router.get('/schedule', (req, res) => {
    const query = 'SELECT * FROM pacientes'; // Obtener todos los pacientes para el select
    db.execute(query, (err, results) => {
        if (err) {
            console.error('Error al obtener pacientes:', err);
            return res.status(500).send('Error al obtener pacientes');
        }
        res.render('schedule', { title: 'Programar Cita', patients: results });
    });
});

// Manejar el envío del formulario de programación de citas
router.post('/schedule', (req, res) => {
    const { paciente_id, fecha, hora, descripcion } = req.body;
    const query = `INSERT INTO citas (paciente_id, fecha, hora, descripcion) VALUES (?, ?, ?, ?)`;

    db.execute(query, [paciente_id, fecha, hora, descripcion], (err, result) => {
        if (err) {
            console.error('Error al programar la cita:', err);
            return res.status(500).send('Error al programar la cita');
        }
        res.redirect('/appointments/list');
    });
});

// Listar citas programadas
router.get('/list', (req, res) => {
    const query = `SELECT citas.id, pacientes.nombre_completo, citas.fecha, citas.hora, citas.descripcion 
                   FROM citas 
                   JOIN pacientes ON citas.paciente_id = pacientes.id`;

    db.execute(query, (err, results) => {
        if (err) {
            console.error('Error al listar las citas:', err);
            return res.status(500).send('Error al listar las citas');
        }
        res.render('appointments-list', { title: 'Lista de Citas', appointments: results });
    });
});

module.exports = router;
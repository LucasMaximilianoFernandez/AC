const express = require('express');
const { body, validationResult } = require('express-validator'); // Para validaciones
const router = express.Router();
const db = require('../models/db'); // Asumiendo que tienes un módulo db para conectarte a la base de datos

// Mostrar el formulario de registro
router.get('/register', (req, res) => {
    res.render('register', { title: 'Registrar Paciente', errors: null, formData: {} });
});

// Manejar el envío del formulario con validaciones
router.post('/register', [
    // Validaciones de los campos
    body('nombre_completo').notEmpty().withMessage('El nombre completo es obligatorio.'),
    body('dni').isNumeric().withMessage('El DNI debe ser numérico.'),
    body('telefono').isNumeric().withMessage('El teléfono debe ser numérico.'),
    body('email').isEmail().withMessage('El email debe ser válido.')
], (req, res) => {
    const { nombre_completo, dni, obra_social, telefono, email } = req.body;

    // Validar el formulario
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Si hay errores, renderizamos la vista de nuevo con los errores
        return res.render('register', { 
            title: 'Registrar Paciente',
            errors: errors.array(), 
            formData: req.body // Mantener los datos del formulario
        });
    }

    // Si no hay errores, insertar el nuevo paciente en la base de datos
    const query = `INSERT INTO pacientes (nombre_completo, dni, obra_social, telefono, email) VALUES (?, ?, ?, ?, ?)`;

    db.execute(query, [nombre_completo, dni, obra_social, telefono, email], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error en el registro del paciente');
        }
        res.redirect('/patients/list'); // Redirigir a la lista después del registro exitoso
    });
});

// Listar pacientes registrados
router.get('/list', (req, res) => {
    const query = 'SELECT * FROM pacientes';

    db.execute(query, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).send('Error al listar los pacientes');
        }
        res.render('patients-list', { title: 'Lista de Pacientes', patients: results });
    });
});

// Mostrar el formulario para editar un paciente
router.get('/edit/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM pacientes WHERE id = ?';

    db.execute(query, [id], (err, results) => {
        if (err) {
            console.error('Error al buscar el paciente:', err);
            return res.status(500).send('Error al buscar el paciente');
        }

        if (results.length === 0) {
            return res.status(404).send('Paciente no encontrado');
        }

        res.render('edit', { title: 'Editar Paciente', patient: results[0] });
    });
});

// Manejar la actualización del paciente
router.post('/edit/:id', (req, res) => {
    const { id } = req.params;
    const { nombre_completo, dni, obra_social, telefono, email } = req.body;
    const query = `UPDATE pacientes SET nombre_completo = ?, dni = ?, obra_social = ?, telefono = ?, email = ? WHERE id = ?`;

    db.execute(query, [nombre_completo, dni, obra_social, telefono, email, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar el paciente:', err);
            return res.status(500).send('Error al actualizar el paciente');
        }
        res.redirect('/patients/list');
    });
});

// Eliminar un paciente
router.get('/delete/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM pacientes WHERE id = ?';

    db.execute(query, [id], (err, result) => {
        if (err) {
            console.error('Error al eliminar el paciente:', err);
            return res.status(500).send('Error al eliminar el paciente');
        }
        res.redirect('/patients/list');
    });
});

module.exports = router;
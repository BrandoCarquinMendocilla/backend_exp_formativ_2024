// v1Router.js
const express = require('express');
const router = express.Router();
const User = require('../user');
const Prestamo = require('../prestamo');
const JefePrestamista = require('../jefePrestamista');
const Prestamista = require('../prestamista');
const Prestatario = require('../prestatario');
const Propuesta = require('../propuesta');


// Define tus rutas aquí
router.get('/get/user', User.getUser);


// Elimina o bloquea usuarios
router.post('/block/user', User.blockUser);

router.get('/list/user', User.listUsers);



router.post('/save/jefe-prestamista', JefePrestamista.createUserJefePrestamista);
router.patch('/update/jefe-prestamista/:id', JefePrestamista.updateUserJefePrestamista);
router.get('/jefe-prestamista/:id', JefePrestamista.getJefePrestamistaById);


router.post('/save/prestamista', Prestamista.createUserPrestamista);
router.patch('/update/prestamista/:id', Prestamista.updateUserPrestamista);
router.get('/prestamista/:id', Prestamista.getPrestamistaByUserId);



router.post('/save/prestatario', Prestatario.createUserPrestatario);
router.patch('/update/prestatario/:id', Prestatario.updateUserPrestatario);
router.get('/prestatario/:id', Prestatario.getPrestatarioByUserId);


router.get('/solicitud-propuesta', Propuesta.getPropuesta);

router.post('/save/prestamo', Prestamo.savePrestamo);
router.get('/list-cuotas', Prestamo.listCuotas);
router.get('/prestamo-prestatario', Prestamo.getPrestamoPrestatario);
router.get('/listar/prestamo', Prestamo.listPrestamos);

router.put('/change/status-prestamo/:nroPrestamo', Prestamo.changeStatusPrestamo);

//router.put('/user', User.updateUser);<

module.exports = router;

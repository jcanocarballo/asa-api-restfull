/*
    Marcas Routes
    /api/marcas
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getMarcas, crearMarca, actualizarMarca, eliminarMarca } = require('../controllers/marcas');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );

// Obtener Marcas 
router.get('/', getMarcas );

// Crear un nuevo Marca
router.post(
  '/',
  [
    check('clave_marca','El campo es obligatorio').not().isEmpty(),
    check('nombre','El campo es obligatorio').not().isEmpty(),
    check('descripcion','El campo es obligatorio').not().isEmpty(),
    validarCampos
  ],
  crearMarca 
);

// Actualizar Marca
router.put(
  '/:id', 
  [
    check('clave_marca','El campo es obligatorio').not().isEmpty(),
    check('nombre','El campo es obligatorio').not().isEmpty(),
    check('descripcion','El campo es obligatorio').not().isEmpty(),
    validarCampos
  ],
  actualizarMarca 
);

// Borrar Marca
router.delete('/:id', eliminarMarca );

module.exports = router;
/*
    Proveedores Routes
    /api/proveedores
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getProveedores, crearProveedor, actualizarProveedor, eliminarProveedor } = require('../controllers/proveedores');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );

// Obtener Proveedores 
router.get('/', getProveedores );

// Crear un nuevo Proveedor
router.post(
  '/',
  [
    check('id','El campo es obligatorio y debe ser un numero').isNumeric(),
    check('nombre_clave','El campo es obligatorio').not().isEmpty(),
    check('nombre','El campo es obligatorio').not().isEmpty(),
    check('descripcion','El campo es obligatorio').not().isEmpty(),
    check('razon_social','El campo es obligatorio').not().isEmpty(),
    check('rfc','El campo es obligatorio').not().isEmpty(),
    validarCampos
  ],
  crearProveedor 
);

// Actualizar Proveedor
router.put(
  '/:id', 
  [
    check('id','El campo es obligatorio y debe ser un numero').isNumeric(),
    check('nombre_clave','El campo es obligatorio').not().isEmpty(),
    check('nombre','El campo es obligatorio').not().isEmpty(),
    check('descripcion','El campo es obligatorio').not().isEmpty(),
    check('razon_social','El campo es obligatorio').not().isEmpty(),
    check('rfc','El campo es obligatorio').not().isEmpty(),
    validarCampos
  ],
  actualizarProveedor 
);

// Borrar Proveedor
router.delete('/:id', eliminarProveedor );

module.exports = router;
/*
    Productos Routes
    /api/productos
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getProductos, crearProducto, actualizarProducto, eliminarProducto } = require('../controllers/productos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );

// Obtener Productos 
router.get('/', getProductos );

// Crear un nuevo Producto
router.post(
  '/',
  [
    check('codigo','El codigo es obligatorio').not().isEmpty(),
    check('descripcion','La descripción es obligatoria').not().isEmpty(),
    validarCampos
  ],
  crearProducto 
);

// Actualizar Producto
router.put(
  '/:id', 
  [
    check('codigo','El codigo es obligatorio').not().isEmpty(),
    check('descripcion','La descripción es obligatoria').not().isEmpty(),
    validarCampos
  ],
  actualizarProducto 
);

// Borrar Producto
router.delete('/:id', eliminarProducto );

module.exports = router;
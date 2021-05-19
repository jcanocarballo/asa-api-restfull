/*
    Categorias Routes
    /api/categorias
*/
const { Router } = require('express');
const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');
const { getCategorias, crearCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

// Todas tienes que pasar por la validación del JWT
router.use( validarJWT );

// Obtener Categorias 
router.get('/', getCategorias );

// Crear un nuevo Categoria
router.post(
  '/',
  [
    check('id','El campo es obligatorio y debe ser un numero').isNumeric(),
    check('nombre_clave_categoria','El campo es obligatorio').not().isEmpty(),
    check('nombre_completo','El campo es obligatorio').not().isEmpty(),
    check('descripcion','El campo es obligatorio').not().isEmpty(),
    validarCampos
  ],
  crearCategoria 
);

// Actualizar Categoria
router.put(
  '/:id', 
  [
    check('id','El campo es obligatorio y debe ser un numero').isNumeric(),
    check('nombre_clave_categoria','El campo es obligatorio').not().isEmpty(),
    check('nombre_completo','El campo es obligatorio').not().isEmpty(),
    check('descripcion','El campo es obligatorio').not().isEmpty(),
    validarCampos
  ],
  actualizarCategoria 
);

// Borrar Categoria
router.delete('/:id', eliminarCategoria );

module.exports = router;
const { response } = require('express');
const logger = require('../utils/logger');

const { listCategorias, newCategoria, findById, findByIdAndUpdate, findByIdAndDelete } = require('../sql/categories/categories');
const getCategorias = async( req, res = response ) => {

  const categorias = await listCategorias();
  if(!categorias){
    return res.status(500).json({
      ok: false,
      msg: "Contacte al administrador."
    });
  }
  return res.json({
    ok: true,
    categorias
  });

}

const crearCategoria = async ( req, res = response ) => {
  
  let categoria =  req.body ;
  try {
    // Agregar si se quiere llevar la auditoria de quien crea la categoria.
    //categoria.userId = req.id;       
    let rowCount = await newCategoria(categoria);
    if(rowCount <= 0){
      return res.status(500).json({
        ok: false,
        msg: "Hable con el administrador."
      })
    }
    return res.json({
      ok: true,
      msg: 'Registro exitoso'
    });
  } catch (error) {
    logger.info(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

const actualizarCategoria = async( req, res = response ) => {
    
  const categoriaId = req.params.id;
  const id = req.id;
  try {
    const categoria = await findById( categoriaId );
    if ( categoria.length <= 0 ) {
      return res.status(404).json({
        ok: false,
        msg: 'Categoria no existe por ese id'
      });
    }
    const nuevoCategoria = {
      ...req.body
    }
    const rowCount = await findByIdAndUpdate( categoriaId, nuevoCategoria);
    if(rowCount <= 0){
      return res.status(301).json({
        ok: false,
        msg: 'Hable con el administrador'
      });
    }
    return res.json({
      ok: true,
      msg: "El registro fue actualizado con exito."
    });
    
  } catch (error) {
    logger.info(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

const eliminarCategoria = async( req, res = response ) => {

  const categoriaId = req.params.id;
  const id = req.id;
  try {
    const categoria = await findById( categoriaId );
    if ( categoria.length <= 0 ) {
      return res.status(404).json({
        ok: false,
        msg: 'Categoria no existe por ese id'
      });
    }
    let rowCount = await findByIdAndDelete( categoriaId );
    if(rowCount <= 0){
      return res.status(301).json({
        ok: false,
        msg: 'Hable con el administrador'
      });
    }
    return res.json({ ok: true });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

module.exports = {
  getCategorias,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria
}
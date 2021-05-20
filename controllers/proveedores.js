const { response } = require('express');
const logger = require('../utils/logger');

const { listProveedores, newProveedor, findById, findByIdAndUpdate, findByIdAndDelete } = require('../sql/proveedores/proveedores');
const getProveedores = async( req, res = response ) => {

  const proveedores = await listProveedores();
  if(!proveedores){
    return res.status(500).json({
      ok: false,
      msg: "Contacte al administrador."
    });
  }
  return res.json({
    ok: true,
    proveedores
  });

}

const crearProveedor = async ( req, res = response ) => {
  
  let proveedor =  req.body ;
  try {
    proveedor.userId = req.id;       
    let rowCount = await newProveedor(proveedor);
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

const actualizarProveedor = async( req, res = response ) => {
    
  const proveedorId = req.params.id;
  const id = req.id;
  try {
    const proveedor = await findById( proveedorId );
    if ( proveedor.length <= 0 ) {
      return res.status(404).json({
        ok: false,
        msg: 'Proveedor no existe por ese id'
      });
    }
    const nuevoProveedor = {
      ...req.body
    }
    const rowCount = await findByIdAndUpdate( proveedorId, nuevoProveedor);
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

const eliminarProveedor = async( req, res = response ) => {

  const proveedorId = req.params.id;
  const id = req.id;
  try {
    const proveedor = await findById( proveedorId );
    if ( proveedor.length <= 0 ) {
      return res.status(404).json({
        ok: false,
        msg: 'Proveedor no existe por ese id'
      });
    }
    let rowCount = await findByIdAndDelete( proveedorId );
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
  getProveedores,
  crearProveedor,
  actualizarProveedor,
  eliminarProveedor
}
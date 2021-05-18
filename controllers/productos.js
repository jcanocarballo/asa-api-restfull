const { response } = require('express');
const logger = require('../utils/logger');

const { listProductos, newProducto, findById, findByIdAndUpdate, deleteProducto } = require('../sql/products/products');
const getProductos = async( req, res = response ) => {

  const productos = await listProductos();
  return res.json({
    ok: true,
    productos
  });

}

const crearProducto = async ( req, res = response ) => {
  
  let producto =  req.body ;
  try {
    producto.userId = req.id;       
    await newProducto(producto);
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

const actualizarProducto = async( req, res = response ) => {
    
  const productoId = req.params.id;
  const id = req.id;
  try {
    const producto = await findById( productoId );
    if ( !producto ) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no existe por ese id'
      });
    }
    const nuevoProducto = {
      ...req.body
    }
    const rowCount = await findByIdAndUpdate( productoId, nuevoProducto);
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

const eliminarProducto = async( req, res = response ) => {

  const productoId = req.params.id;
  const id = req.id;
  try {
    const producto = await Producto.findById( productoId );
    if ( !producto ) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no existe por ese id'
      });
    }
    if ( producto.user.toString() !== id ) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de eliminar este producto'
      });
    }
    await Producto.findByIdAndDelete( productoId );
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
  getProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
}
const { response } = require('express');
const logger = require('../utils/logger');
const { listProductos, newProducto, updateProducto, deleteProducto } = require('../sql/products/products');
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
    producto.uuid = req.uuid;        
    const productoGuardado = await newProducto(producto);
    return res.json({
      ok: true,
      producto: productoGuardado
    });
  } catch (error) {
    console.log(error)
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }

}

const actualizarProducto = async( req, res = response ) => {
    
  const productoId = req.params.id;
  const uid = req.uid;
  try {
    const producto = await Producto.findById( productoId );
    if ( !producto ) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no existe por ese id'
      });
    }
    if ( producto.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de editar este producto'
      });
    }
    const nuevoProducto = {
      ...req.body,
      user: uid
    }
    const productoActualizado = await Producto.findByIdAndUpdate( productoId, nuevoProducto, { new: true } );
    return res.json({
      ok: true,
      producto: productoActualizado
    });
    
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: 'Hable con el administrador'
    });
  }
}

const eliminarProducto = async( req, res = response ) => {

  const productoId = req.params.id;
  const uid = req.uid;
  try {
    const producto = await Producto.findById( productoId );
    if ( !producto ) {
      return res.status(404).json({
        ok: false,
        msg: 'Producto no existe por ese id'
      });
    }
    if ( producto.user.toString() !== uid ) {
      return res.status(401).json({
        ok: false,
        msg: 'No tiene privilegio de eliminar este producto'
      });
    }
    await Producto.findByIdAndDelete( productoId );
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
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
const { response } = require('express');
const logger = require('../utils/logger');
const moment = require('moment'); // require

const { listMarcas, newMarca, findById, findByIdAndUpdate, findByIdAndDelete } = require('../sql/marcas/marcas');
const getMarcas = async( req, res = response ) => {

  const marcas = await listMarcas();
  if(!marcas){
    return res.status(500).json({
      ok: false,
      msg: "Contacte al administrador."
    });
  }
  return res.json({
    ok: true,
    marcas
  });

}

const crearMarca = async ( req, res = response ) => {
  
  let marca =  req.body ;
  try {
    //Agregar cuando se guarde con idusuario
    //marca.userId = req.id;       
    let rowCount = await newMarca(marca);
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

const actualizarMarca = async( req, res = response ) => {
    
  const marcaId = req.params.id;
  const id = req.id;
  try {
    const marca = await findById( marcaId );
    if ( marca.length <= 0 ) {
      return res.status(404).json({
        ok: false,
        msg: 'Marca no existe por ese id'
      });
    }
    const nuevoMarca = {
      ...req.body
    }
    delete nuevoMarca.created_at
    nuevoMarca.updated_at = moment(new Date(), 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
    console.log(nuevoMarca);
    
    const rowCount = await findByIdAndUpdate( marcaId, nuevoMarca);
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

const eliminarMarca = async( req, res = response ) => {

  const marcaId = req.params.id;
  const id = req.id;
  try {
    const marca = await findById( marcaId );
    if ( marca.length <= 0 ) {
      return res.status(404).json({
        ok: false,
        msg: 'Marca no existe por ese id'
      });
    }
    let rowCount = await findByIdAndDelete( marcaId );
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
  getMarcas,
  crearMarca,
  actualizarMarca,
  eliminarMarca
}
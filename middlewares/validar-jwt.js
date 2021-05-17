const { response } = require('express');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const validarJWT = ( req, res = response, next ) => {

    // x-token headers
    const token = req.header('x-token');

    if ( !token ) {
      return res.status(401).json({
        ok: false,
        msg: 'No hay token en la petición'
      });
    }

  try {
      
    const { uuid, name, email } = jwt.verify(
      token,
      process.env.SECRET_JWT_SEED
    );
    req.uuid = uuid;
    req.name = name;
    req.email = email;
  } catch (error) {
    logger.info(error)
    return res.status(401).json({
      ok: false,
      msg: 'Token no válido'
    });
  }
  next();
}

module.exports = {
  validarJWT
}
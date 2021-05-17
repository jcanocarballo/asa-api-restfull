const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

const generarJWT = ( uuid, name, email ) => {
  return new Promise( (resolve, reject) => {
    const payload = { uuid, name, email };
    jwt.sign( payload, process.env.SECRET_JWT_SEED, {
      expiresIn: '2h'
    }, (err, token ) => {
      if ( err ){
        logger.info(err);
        reject('No se pudo generar el token');
      }
      resolve( token );
    })
  })
}

module.exports = {
    generarJWT
}
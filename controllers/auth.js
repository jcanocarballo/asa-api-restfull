const {response} = require('express');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');
const logger = require('../utils/logger');
const { findByEmail, newUsuario } = require('../sql/auth/auth');

const loginUsuario = async (req, res = response ) => {

  const { email, password } = req.body;

  try {
    let usuario = await findByEmail(email);        
    if ( usuario.length <= 0 ) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario y/o contraseña no validos'
      });
    }
  
    // Confirmar los passwords
    usuario = usuario[0];
    const validPassword = bcrypt.compareSync( password, usuario.password );
    
    // Generar JWT
    const token = await generarJWT( usuario.id, usuario.name, usuario.email );
    
    if ( !validPassword ) {
      return res.status(400).json({
        ok: false,
        msg: 'El usuario y/o contraseña no validos'
      });
    }
    
    return res.status(200).json({
      ok: true,
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      token
    });
  } catch (error) {
    logger.info(error);
    res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador'
    });
  }

}

const crearUsuario = async (req, res = response ) => {
  
  const { email, password } = req.body;
  
  try {    
    let usuario = await findByEmail(email);

    if(usuario.length > 0){
      return res.status(400).json({
        ok: false,
        msg: "Un usuario existe con ese correo."
      });
    }
    usuario = req.body;
  
    //Encryptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);

    await newUsuario(usuario);

    // Generar JWT
    const token = await generarJWT( usuario.id, usuario.name, usuario.email );
  
    return res.status(201).json({
      ok: true,
      msg: 'Usuario creado con exito.',
      id: usuario.id,
      name: usuario.name,
      email: usuario.email,
      token
    });
  } catch (error) {
    logger.info(error);
    return res.status(500).json({
      ok: false,
      msg: 'Por favor hable con el administrador.'
    })  
  }
}

const renewToken = async (req, res = response ) => {
  const { id, name, email } = req;
  // Generar JWT
  const token = await generarJWT( id, name, email );
  
  return res.json({
      ok: true,
      id, 
      name, 
      email,
      token
  })
}

const validarToken = async (req, res = response ) => {
    
  const { id, name, email } = req;
  
  return res.json({
      ok: true,
      id, 
      name, 
      email
  })
}

module.exports = {
  crearUsuario,
  loginUsuario,
  renewToken,
  validarToken
}
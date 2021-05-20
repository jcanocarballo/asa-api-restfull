let { Client } = require('pg')
var config = require('../../database/config');
var dbConfig = global.gConfig.database_config_pg;
var logger = require("../../utils/logger");

const listProveedores = async function () {
  logger.info(`Lista de proveedores: `);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from proveedores";      
      logger.info('Query: ' + query);
      let resultado = await client.query(query);              
      return resultado.rows;
  } catch (err) {
      logger.error("Error en Base de datos " + err);
      return null;
  } finally {
      if (client)
          await client.end();
  }
};

const findById = async function (id) {
  logger.info(`Find proveedor by id: ${id}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from proveedores where id = $1";
      let params = [];
      params.push(id);
      logger.info('Query: ' + query);
      let resultado = await client.query(query, params);        
      return resultado.rows;
  } catch (err) {
      logger.error("Error en Base de datos " + err);
      return null;
  } finally {
      if (client)
          await client.end();
  }
};

const findByIdAndUpdate = async function (proveedorId, req) {
  logger.info(`Find proveedor by id and update: ${JSON.stringify(req)}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "update proveedores set"
      let params = [];
      let campos = "";
      let cont = 0;
      for(var key in req){
        let coma = '';
        if(cont > 0){
          coma = ','
        }
        cont++;
        campos += `${coma} ${key} = $${cont}`
        params.push(req[key])
      }
      params.push(proveedorId);
      query += campos
      + ` where id = $${++cont}`;

      logger.info('Query: ' + query);
      let resultado = await client.query(query, params);   
      return resultado.rowCount;
  } catch (err) {
      logger.error("Error en Base de datos " + err);
      return null;
  } finally {
      if (client)
          await client.end();
  }
};

const newProveedor = async function (req) {
  logger.info(`New proveedor: ${req.codigo}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "INSERT INTO proveedores (ID, NOMBRE_CLAVE, NOMBRE, DESCRIPCION, RAZON_SOCIAL, RFC, DOMICILIO, COLONIA, MUNICIPIO, ESTADO, USER_ID) "
      + " VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);";
      let params = [];
      json2array(req).map(p => {
        params.push(p);
      })
      logger.info('Query: ' + query);
      let resultado = await client.query(query, params);
      return resultado.rowCount;
  } catch (err) {
      logger.error("Error en Base de datos " + err);
      return null;
  } finally {
      if (client)
          await client.end();
  }
};

const findByIdAndDelete = async function (proveedorId) {
  logger.info(`Find proveedor by id and delete: ${proveedorId}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "delete from proveedores"
      let params = [];
      params.push(proveedorId);
      query +=` where id = $1`;
      logger.info('Query: ' + query);
      let resultado = await client.query(query, params);   
      return resultado.rowCount;
  } catch (err) {
      logger.error("Error en Base de datos " + err);
      return null;
  } finally {
      if (client)
          await client.end();
  }
};

function json2array(json){
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
      result.push(json[key]);
  });
  return result;
}

module.exports = {
  listProveedores,
  findById,
  newProveedor,
  findByIdAndUpdate,
  findByIdAndDelete
}
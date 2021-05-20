let { Client } = require('pg')
var config = require('../../database/config');
var dbConfig = global.gConfig.database_config_pg;
var logger = require("../../utils/logger");

const listMarcas = async function () {
  logger.info(`Lista de marcas: `);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from marcas";      
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
  logger.info(`Find marca by id: ${id}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from marcas where id = $1";
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

const findByIdAndUpdate = async function (marcaId, req) {
  logger.info(`Find marca by id and update: ${JSON.stringify(req)}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "update marcas set"
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
      params.push(marcaId);
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

const newMarca = async function (req) {
  logger.info(`New marca: ${req.codigo}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "INSERT INTO marcas (ID, NOMBRE_CLAVE_MARCA, NOMBRE_COMPLETO, DESCRIPCION, USER_ID) "
      + " VALUES ($1, $2, $3, $4, $5);";
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

const findByIdAndDelete = async function (marcaId) {
  logger.info(`Find marca by id and delete: ${marcaId}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "delete from marcas"
      let params = [];
      params.push(marcaId);
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
  listMarcas,
  findById,
  newMarca,
  findByIdAndUpdate,
  findByIdAndDelete
}
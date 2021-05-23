let { Client } = require('pg')
var config = require('../../database/config');
var dbConfig = global.gConfig.database_config_pg;
var logger = require("../../utils/logger");

const listCategorias = async function () {
  logger.info(`Lista de categorias: `);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from categorias";      
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
  logger.info(`Find category by id: ${id}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from categorias where id = $1";
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

const findByIdAndUpdate = async function (categoriaId, req) {
  logger.info(`Find category by id and update: ${JSON.stringify(req)}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "update categorias set"
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
      params.push(categoriaId);
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

const newCategoria = async function (req) {
  logger.info(`New Categoria: ${req.clave_categoria}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "INSERT INTO categorias ( CLAVE_CATEGORIA, NOMBRE, DESCRIPCION, created_at, enabled) "
      + " VALUES ($1, $2, $3, CURRENT_TIMESTAMP, true);";
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

const findByIdAndDelete = async function (categoriaId) {
  logger.info(`Find categoria by id and delete: ${categoriaId}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "update categorias set"
        + " enabled = false,"
        + " deleted_at = CURRENT_TIMESTAMP"
      let params = [];
      params.push(categoriaId);
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
  listCategorias,
  findById,
  newCategoria,
  findByIdAndUpdate,
  findByIdAndDelete
}
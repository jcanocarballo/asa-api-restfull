let { Client } = require('pg')
var config = require('../../database/config');
var dbConfig = global.gConfig.database_config_pg;
var logger = require("../../utils/logger");

const listProductos = async function () {
  logger.info(`Lista de productos: `);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from productos";      
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
  logger.info(`Find product by id: ${id}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "select"
      + " * "
      + " from productos where id = $1";
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

const findByIdAndUpdate = async function (productoId, req) {
  logger.info(`Find product by id and update: ${JSON.stringify(req)}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "update productos set"
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
      params.push(productoId);
      query += campos
      + ` where id = $${++cont}`;

      logger.info('Query: ' + query);
      let resultado = await client.query(query, params);   
      console.log(params);
      return resultado.rowCount;
  } catch (err) {
      logger.error("Error en Base de datos " + err);
      return null;
  } finally {
      if (client)
          await client.end();
  }
};

const newProducto = async function (req) {
  logger.info(`New Producto: ${req.codigo}`);
  let client = null;
  try {
      client = new Client(dbConfig);
      await client.connect();
      let query = "INSERT INTO productos (codigo, descripcion, userid) "
      + " VALUES ($1, $2, $3);";
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

function json2array(json){
  var result = [];
  var keys = Object.keys(json);
  keys.forEach(function(key){
      result.push(json[key]);
  });
  return result;
}

module.exports = {
  listProductos,
  findById,
  newProducto,
  findByIdAndUpdate
}
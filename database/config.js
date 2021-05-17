const lodash = require('lodash');
var logger = require("../utils/logger");

const configDbPostgres = {
  database_config_pg: {
    host: process.env.POSTGRES_HOST,
    database: process.env.POSTGRES_DATABASE,
    user: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    port: process.env.POSTGRES_PORT
  }
}
global.gConfig = configDbPostgres;

logger.info(`Configuración a DB: ${process.env.POSTGRES_HOST}`);
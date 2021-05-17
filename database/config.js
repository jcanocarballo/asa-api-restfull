const lodash = require('lodash');
var logger = require("../utils/logger");

const conexion = require('./conexion.json');
const default_config = conexion.desarrollo;
const environment = process.env.NODE_ENV || 'desarrollo';

const environment_config = conexion[environment];

environment_config.database_config_pg.database = environment_config.database_config_pg.database;
environment_config.database_config_pg.user = environment_config.database_config_pg.user;
environment_config.database_config_pg.password = environment_config.database_config_pg.password;
const final_config = lodash.merge(default_config, environment_config);

global.gConfig = final_config;

logger.info('Environment configurado: ' + environment);
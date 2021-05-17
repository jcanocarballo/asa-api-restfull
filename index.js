const express = require('express');
require('dotenv').config();
const cors = require('cors');
const morgan = require('morgan');
const logger = require("./utils/logger");
const uuid = require('uuid');
const httpContext = require('express-http-context');

// Asignar puerto desde variables de entorno
const PORT = process.env.PORT || 9797

// Crear el servidor de express
const app = express();

// CORS
app.use(cors())

app.use(httpContext.middleware);

app.use(function(req, res, next) {
  
  var uuidReq = req.headers.id_tracking ? req.headers.id_tracking : uuid.v1();
  res.setHeader('id_tracking', uuidReq);
  httpContext.set('id_tracking', uuidReq);
  next();
});

morgan.token('header', function(req, res) { return JSON.stringify(req.headers); });

app.use(morgan(':status ":method :url"', { stream: logger.stream }));

//Directorio publico
app.use( express.static('public') );

//Lectura y paraseo del body
app.use(express.json());

//Rutas
app.use('/login', express.static('public'));
app.use('/auth/login', express.static('public'));
//TODO: auth -> crear, login, renew
app.use('/api/auth', require('./routes/auth'));
//TODO: productos
app.use('/api/productos', require('./routes/productos'));

//Escuchar peticiones
app.listen(PORT, () => {
  logger.info(`Servidor ejecutandose en en el puerto: ${PORT}`);
})
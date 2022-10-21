import express = require("express");
import config from '../config';
import * as routes from './routes'
import * as path from 'path';

const server = express();
 
server.set('view engine', 'pug');
server.set('views', path.join(__dirname, 'views'));

server.use('/api', express.json());
server.use(`/bot${config.BOT_TOKEN}`, express.json());
server.use(`/order-form`, express.urlencoded());


server.post(`/bot${config.BOT_TOKEN}`, routes.tgBotWebHook)
server.post('/api/v1/calls/entry', routes.callsEntry)
server.get(`/order-form`, routes.orderFormPage)
server.post(`/order-form`, routes.orderFormPage)

export default server
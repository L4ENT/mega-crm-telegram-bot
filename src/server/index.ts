import express = require("express");
import multer = require("multer");
import config from '../config';
import * as routes from './routes'
import * as path from 'path';


const m = multer({dest: config.UPLOADS_PATH})
const server = express();
 
server.set('view engine', 'pug');
server.set('views', path.join(__dirname, 'views'));

server.use('/api', express.json());
server.use(`/bot${config.BOT_TOKEN}`, express.json());
server.use(`/order-form`, express.urlencoded());
server.use(`/warranty-form`, express.urlencoded());

server.post(`/bot${config.BOT_TOKEN}`, routes.tgBotWebHook)
server.post('/api/v1/calls/entry', routes.callsEntry)
server.get(`/order-form`, routes.orderFormPage)
server.post(`/order-form`, routes.orderFormPage)
server.get(`/warranty-form`, routes.warrantyFormPage)
server.post(`/warranty-form`, routes.warrantyFormPage)
server.get(`/download/warranty-:warrantyId-file.docx`, routes.downloadWarranty)

export default server
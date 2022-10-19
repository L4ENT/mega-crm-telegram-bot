import { PrismaClient } from '@prisma/client';
import express, { json, urlencoded } from 'express';
import config from '../config.js';
import * as routes from './routes.js'
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

const __dirname = path.dirname(__filename);

const prisma = new PrismaClient()

const server = express();
 
server.set('view engine', 'pug');
server.set('views', path.join(__dirname, 'views'));
console.log(path.join(__dirname, 'views'))

server.use('/api', json());
server.use(`/bot${config.BOT_TOKEN}`, json());
server.use(`/order-form`, urlencoded());


server.post(`/bot${config.BOT_TOKEN}`, routes.tgBotWebHook)
server.post('/api/v1/calls/entry', routes.callsEntry)
server.get(`/order-form`, routes.orderFormPage)
server.post(`/order-form`, routes.orderFormPage)

export default server
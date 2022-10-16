import express, { json } from 'express';
import config from '../config.js';
import * as routes from './routes.js'

const server = express();
 
server.use(json());

server.post(`/bot${config.BOT_TOKEN}`, routes.tgBotWebHook)
server.post('/api/v1/calls/entry', routes.callsEntry)

export default server
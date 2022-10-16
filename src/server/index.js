import { PrismaClient } from '@prisma/client';
import express, { json } from 'express';
import config from '../config.js';
import * as routes from './routes.js'

const prisma = new PrismaClient()

const server = express();
 
server.use(json());

server.use((req, res, next) => {
    req.app.prisma = prisma;
    next()
})

server.post(`/bot${config.BOT_TOKEN}`, routes.tgBotWebHook)
server.post('/api/v1/calls/entry', routes.callsEntry)

export default server
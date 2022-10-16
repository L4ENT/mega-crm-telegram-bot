/**
 * This example demonstrates setting up a webook, and receiving
 * updates in your express app
 */
/* eslint-disable no-console */

import config from './src/config.js';
import server from './src/server/index.js';

const port = config.PORT;

server.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

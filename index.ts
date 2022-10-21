import config from "./src/config";
import server from "./src/server/index";

const port = config .PORT;

server.listen(port, () => {
  console.log(`Express server is listening on ${port}`);
});

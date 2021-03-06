require("console-stamp")(console, { pattern: "dd/mm/yyyy HH:MM:ss.l" });
const http = require("http");
const url = require("url");
const mainHandler = require("./mainHandler");
const MongoDB = require("./mongo");

async function initDB() {
  const mongo = await MongoDB();
  this.mongo = mongo;
  return mongo;
}

initDB();

const server = http.createServer(mainHandler);

server.listen(6000, "0.0.0.0", () => {});

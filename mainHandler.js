const Router = require("router");
const finalhandler = require("finalhandler");

function sendJSONObject(res, object) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(object));
}

function sendErrorObject(res, code, message) {
  res.statusCode = code;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify({ message }));
}

function getRequestBody(req) {
  return new Promise(function(resolve, reject) {
    var data = "";
    req.on("data", function(chunk) {
      data += chunk;
    });
    req.on("end", function() {
      console.log(data);
      try {
        resolve(JSON.parse(data));
      } catch (e) {
        resolve(data);
      }
    });
  });
}

function genericAPIModuleRouter() {
  const router = Router();
  router.get("/api/modules/:module", async (req, res) => {
    const module = req.params.module;
    const result = await this.mongo.getAll(module);
    res.sendJSONObject(result);
    return;
  });
  router.post("/api/modules/:module", async (req, res) => {
    const module = req.params.module;
    const obj = await req.getRequestBody();
    const r = await this.mongo.insert(module, obj);
    res.sendJSONObject(r);
    return;
  });
  router.delete("/api/modules/:module/:id", async (req, res) => {
    const id = req.params.id;
    const module = req.params.module;

    if (id.length === 24) {
      const r = await this.mongo.delete(module, id);
      res.sendJSONObject(r);
    } else {
      res.sendError(422, "Invalid format for Id");
    }
    return;
  });
  return router;
}

async function mainHandler(req, res) {
  res.sendJSONObject = o => sendJSONObject(res, o);
  res.sendErrorObject = (code, message) => sendErrorObject(res, code, message);
  req.getRequestBody = () => getRequestBody(req);

  printRequest(req);
  if (req.url.startsWith("/api/modules/"))
    genericAPIModuleRouter()(req, res, finalhandler(req, res));
  else res.sendErrorObject(404, "Invalid path");
}

function printRequest(req) {
  const ip =
    (req.headers["x-forwarded-for"] || "").split(",").pop() ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  console.log("\x1b[33m%s\x1b[0m", `${ip} ${req.method} ${req.url}`);
}

module.exports = mainHandler;

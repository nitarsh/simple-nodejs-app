const Router = require("router");
const finalhandler = require("finalhandler");

function sendJSONObject(res, object) {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(object));
}

function sendErrorObject(res, code, message) {
  res.statusCode = code;
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

function apiRouter() {
  const router = Router();
  router.get("/api/something", (req, res) => res.sendJSONObject({ a: "a" }));
  return router;
}

async function mainHandler(req, res) {
  res.sendJSONObject = o => sendJSONObject(res, o);
  res.sendErrorObject = (code, message) => sendErrorObject(res, code, message);
  req.getRequestBody = () => getRequestBody(req);

  printRequest(req);
  if (req.url.startsWith("/api")) apiRouter()(req, res, finalhandler(req, res));
  res.end();
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

require("dotenv").config();
const http = require("http");
const app = require("./app");
const { loadPlanets } = require("./models/planets.model");
const { mongoConnect } = require("./services/mongo");
const { loadLaunchData } = require("./models/launches.model");

const server = http.createServer(app);
const PORT = process.env.PORT || 8000;

async function startServer() {
  await mongoConnect();
  await loadLaunchData();
  await loadPlanets();
  server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
}
startServer();

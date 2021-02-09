const servers = require("./resources/servers.json");
const Configurator = require("./Configurator");

const job = new Configurator(servers).start(5000000);

process.on("SIGINT", function () {
  console.log(job.passed);
  process.exit();
});

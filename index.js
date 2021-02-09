const servers = require("./resources/servers.json");
const Configurator = require("./Configurator");

new Configurator(servers).start(10000000);

const { randomInt } = require("./resources/helpers");

class Configurator {
  components = null;
  passed = null;

  constructor(components) {
    this.components = components;
  }

  generateRandomIntArray = (amount, min, max) => {
    const randomInts = [];

    for (let i = 0; i <= amount; i++) {
      randomInts.push(randomInt(min, max));
    }

    return randomInts;
  };

  calculate = (generated) => {
    const { db, web, firewall } = generated.servers;

    const firewallOptions = this.calculateItem(firewall);
    const webOptions = this.calculateItem(web);
    const dbOptions = this.calculateItem(db);

    const totalFirewallCost = this.getTotalCost(firewallOptions.price);
    const totalWebCost = this.getTotalCost(webOptions.price);
    const totalDbCost = this.getTotalCost(dbOptions.price);

    const combinedCost = totalFirewallCost + totalWebCost + totalDbCost;

    const totalFirewallAvailability = this.getTotalAvailability(
      firewallOptions.availability
    );

    const totalWebAvailability = this.getTotalAvailability(
      webOptions.availability
    );

    const totalDbAvailability = this.getTotalAvailability(
      dbOptions.availability
    );

    const combinedAvailability =
      totalFirewallAvailability * totalWebAvailability * totalDbAvailability;

    return { combinedCost, combinedAvailability, generated };
  };

  getTotalAvailability = (availabilityArr) => {
    let outcomes = [];
    let finalOutcome = 1;

    availabilityArr.forEach((availability) => {
      outcomes.push(1 - availability);
    });

    outcomes.forEach((f) => {
      finalOutcome = finalOutcome *= f;
    });

    return 1 - finalOutcome;
  };

  getTotalCost = (costArr) => {
    let total = 0;

    costArr.forEach((cost) => {
      total += cost;
    });

    return total;
  };

  calculateItem = (item) => {
    const availability = item.items.map((el) => {
      return el.availability;
    });

    const price = item.items.map((el) => {
      return el.price;
    });

    return { availability, price };
  };

  createWeb = () => {
    const randomInts = this.generateRandomIntArray(randomInt(1, 10), 0, 2);
    const servers = { items: [] };

    for (const int in randomInts) {
      servers.items.push(this.components.web[randomInts[int]]);
    }

    return servers;
  };

  createDb = () => {
    const randomInts = this.generateRandomIntArray(randomInt(1, 10), 0, 2);
    const servers = { items: [] };

    for (const int in randomInts) {
      servers.items.push(this.components.db[randomInts[int]]);
    }

    return servers;
  };

  createFw = () => {
    return { items: [this.components.firewall[0]] };
  };

  generate = () => {
    const db = this.createDb();
    const web = this.createWeb();
    const firewall = this.createFw();

    return { servers: { db, web, firewall } };
  };

  start = (iterations) => {
    for (let i = 0; i < iterations; i++) {
      const item = this.calculate(this.generate());

      if (!this.passed) {
        this.passed = item;
        console.log("Initial item set");
      } else {
        if (
          item.combinedCost < this.passed.combinedCost &&
          item.combinedAvailability >= item.combinedAvailability &&
          item.combinedAvailability.toFixed(4) >= 0.9999
        ) {
          console.log("Passed " + i);
          this.passed = item;
        }
      }

      if (Number.isInteger(i / 1000000)) {
        console.log(`Iteration: ${i}`);
      }
    }

    console.log(JSON.stringify(this.passed, null, 4));
  };
}

module.exports = Configurator;

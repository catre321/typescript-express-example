"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
const dotenv = require("dotenv");
dotenv.config();
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Card_1 = require("./src/entity/Card");
const Customer_1 = require("./src/entity/Customer");
const Reader_1 = require("./src/entity/Reader");
const Gate_1 = require("./src/entity/Gate");
const TicketType_1 = require("./src/entity/TicketType");
const CustomerCardsTicketType_1 = require("./src/entity/CustomerCardsTicketType");
const TicketTypeGate_1 = require("./src/entity/TicketTypeGate");
const CustomerCardTicketTypeLog_1 = require("./src/entity/CustomerCardTicketTypeLog");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "test",
    synchronize: true,
    logging: ["query"],
    logger: "advanced-console",
    entities: [Card_1.Card, Customer_1.Customer, Gate_1.Gate, TicketType_1.TicketType, Reader_1.Reader, CustomerCardsTicketType_1.CustomerCardTicketType,
        TicketTypeGate_1.TicketTypeGate, CustomerCardTicketTypeLog_1.CustomerCardTicketTypeLog],
    migrations: ['src/migration/**/*{.ts,.js}'],
    subscribers: [],
});
//# sourceMappingURL=ormconfig.js.map
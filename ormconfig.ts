import * as dotenv from 'dotenv'
dotenv.config();

import 'reflect-metadata'
import { DataSource } from "typeorm";
import { Card } from './src/entity/Card';
import { Customer } from './src/entity/Customer';
import { Reader } from './src/entity/Reader';
import { Gate } from './src/entity/Gate';
import { TicketType } from './src/entity/TicketType';
import { CustomerCardTicketType } from './src/entity/CustomerCardsTicketType';
import { TicketTypeGate } from './src/entity/TicketTypeGate';
import { CustomerCardTicketTypeLog } from './src/entity/CustomerCardTicketTypeLog';

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "postgres",
    password: "postgres",
    database: "test",
    synchronize: true,
    logging: ["query"],
    logger: "advanced-console",
    entities: [Card, Customer, Gate, TicketType, Reader, CustomerCardTicketType,
         TicketTypeGate, CustomerCardTicketTypeLog],
    migrations: ['src/migration/**/*{.ts,.js}'],
    subscribers: [],
})
 
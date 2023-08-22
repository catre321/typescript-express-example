import * as dotenv from 'dotenv'

import 'reflect-metadata'
import { DataSource } from "typeorm";
import { Card } from './entity/Card';
import { Customer } from './entity/Customer';
import { Reader } from './entity/Reader';
import { Gate } from './entity/Gate';
import { TicketType } from './entity/TicketType';
import { CustomerCardTicketType } from './entity/CustomerCardsTicketType';
import { TicketTypeGate } from './entity/TicketTypeGate';
import { CustomerCardTicketTypeLog } from './entity/CustomerCardTicketTypeLog';

dotenv.config();

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: Number(process.env.PG_PORT),
    username: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    synchronize: true,
    logging: ["schema"],
    logger: "advanced-console",
    entities: [Card, Customer, Gate, TicketType, Reader, CustomerCardTicketType,
         TicketTypeGate, CustomerCardTicketTypeLog],
    migrations: ['src/migration/**/*{.ts,.js}'],
    subscribers: [],
})
 
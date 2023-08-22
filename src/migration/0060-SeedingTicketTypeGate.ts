import { MigrationInterface, QueryRunner } from 'typeorm';
import { Gate } from '../entity/Gate';
import { TicketType } from '../entity/TicketType';
import { TicketTypeGate } from "../entity/TicketTypeGate";

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';


export class SeedingTicketTypeGate1686536480976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.synchronize(false);

        const filePath = path.join(__dirname, '../../test_data/TicketTypeGate.yml');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = yaml.parse(fileContents);

        const ticketTypeRepository = queryRunner.connection.getRepository(TicketType);
        const gateRepository = queryRunner.connection.getRepository(Gate);
        const ticketTypeGateRepository = queryRunner.connection.getRepository(TicketTypeGate);

        // Assuming the data in the YAML file is under the 'ticketTypeGate' key as an array
        const ticketTypeGateData = data['TicketTypeGate'] as (TicketTypeGate & {gateName: string} & {ticketTypeName: string})[];

        // Save each ticketTypeGate separately
        for (let i = 0; i < ticketTypeGateData.length; i++) {
            ticketTypeGateData[i].ticketType = await ticketTypeRepository.findOneBy({ name: ticketTypeGateData[i].ticketTypeName});
            ticketTypeGateData[i].gate = await gateRepository.findOneBy({ name: ticketTypeGateData[i].gateName});
            await ticketTypeGateRepository.save(ticketTypeGateData[i]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const ticketTypeGateRepository = queryRunner.connection.getRepository(TicketTypeGate);

        // Delete all records from the entities in reverse order
        await ticketTypeGateRepository.delete({});
    }
}
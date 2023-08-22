import { MigrationInterface, QueryRunner } from 'typeorm';
import { Gate } from '../entity/Gate';
import { TicketType } from "../entity/TicketType";

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export class SeedingTicketType1686536480976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.synchronize(false);

        const filePath = path.join(__dirname, '../../test_data/TicketType.yml');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = yaml.parse(fileContents);

        const ticketTypeRepository = queryRunner.connection.getRepository(TicketType);

        // Assuming the data in the YAML file is under the 'ticketType' key as an array
        const ticketTypeData = data['TicketType'] as (TicketType & {gateName: string})[];

        // Save each ticketType separately
        for (let i = 0; i < ticketTypeData.length; i++) {
            await ticketTypeRepository.save(ticketTypeData[i]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const ticketTypeRepository = queryRunner.connection.getRepository(TicketType);

        // Delete all records from the entities in reverse order
        await ticketTypeRepository.delete({});
    }
}
import { MigrationInterface, QueryRunner } from 'typeorm';
import { Gate } from '../entity/Gate';
import { Reader } from "../entity/Reader";

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export class SeedingReader1686536480976 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.connection.synchronize(false);

        const filePath = path.join(__dirname, '../../test_data/Reader.yml');
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = yaml.parse(fileContents);

        const gateRepository = queryRunner.connection.getRepository(Gate);
        const readerRepository = queryRunner.connection.getRepository(Reader);

        // Assuming the data in the YAML file is under the 'reader' key as an array
        const readerData = data['Reader'] as (Reader & {gateName: string})[];

        // Save each reader separately
        for (let i = 0; i < readerData.length; i++) {
            readerData[i].gate = await gateRepository.findOneBy({ name: readerData[i].gateName});
            await readerRepository.save(readerData[i]);
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const readerRepository = queryRunner.connection.getRepository(Reader);

        // Delete all records from the entities in reverse order
        await readerRepository.delete({});
    }
}
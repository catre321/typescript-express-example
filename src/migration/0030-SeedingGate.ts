import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { Gate } from "../entity/Gate";

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export class SeedingGate1686536480976 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.synchronize(false);

    const filePath = path.join(__dirname, '../../test_data/Gate.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.parse(fileContents);

    const gateRepository = queryRunner.connection.getRepository(Gate);

    // Assuming the data in the YAML file is under the 'gate' key as an array
    const gateData = data['Gate'] as Gate[];

    // Save each gate separately
    for (let i = 0; i < gateData.length; i++) {
      await gateRepository.save(gateData[i]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const gateRepository = queryRunner.connection.getRepository(Gate);
    
    // Delete all records from the entities in reverse order
    await gateRepository.delete({});
  }
}
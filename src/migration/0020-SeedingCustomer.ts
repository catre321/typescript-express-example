import { MigrationInterface, QueryRunner, Repository } from 'typeorm';
import { Customer } from "../entity/Customer";

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';

export class SeedingCustomer1686536480976 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.synchronize(false);

    const filePath = path.join(__dirname, '../../test_data/Customer.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.parse(fileContents);

    const customerRepository = queryRunner.connection.getRepository(Customer);

    // Assuming the data in the YAML file is under the 'customer' key as an array
    const customerData = data['Customer'] as Customer[];

    // Save each customer separately
    for (let i = 0; i < customerData.length; i++) {
      await customerRepository.save(customerData[i]);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const customerRepository = queryRunner.connection.getRepository(Customer);
    
    // Delete all records from the entities in reverse order
    await customerRepository.delete({});
  }
}
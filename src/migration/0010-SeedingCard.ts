import { MigrationInterface, QueryRunner } from 'typeorm';
import { Card } from "../entity/Card";

import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'yaml';
// import * as _ from 'lodash'

export class SeedingCard1686536480976 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.connection.synchronize(false);

    const filePath = path.join(__dirname, '../../test_data/Card.yml');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const data = yaml.parse(fileContents);

    const cardRepository = queryRunner.connection.getRepository(Card);
    // const readerRepository = queryRunner.connection.getRepository(Reader);

    // Assuming the data in the YAML file is under the 'Card' key as an array
    const cardData = data['Card'] as Card[];
    // const readerData = data['Reader'] as (Reader & {gateName: string})[];

    // Save each card separately
    for (let i = 0; i < cardData.length; i++) {
      await cardRepository.save(cardData[i]);
    }

    // const gateMap = _.mapKeys(gateData, 'name')

    // for (let i = 0; i < readerData.length; i++) {
    //   readerData[i].gateId = gateMap[readerData[i].gateName].id;
    //   delete readerData[i].gateName;
    //   console.log(readerData[i].gateId);
    //   await readerRepository.save(readerData[i])
    // }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const cardRepository = queryRunner.connection.getRepository(Card);
    
    // Delete all records from the entities in reverse order
    await cardRepository.delete({});
  }

}
//connect to mqtt
import { AppDataSource } from './DataSource';
import { Card } from './entity/Card';
import { CustomerCardTicketType } from './entity/CustomerCardsTicketType';
import { Reader } from './entity/Reader';
import { getMqtt } from './getMqtt';
import { CustomerCardTicketTypeLog } from './entity/CustomerCardTicketTypeLog';
import { Repository } from 'typeorm';
import { TicketTypeGate } from './entity/TicketTypeGate';
import { DateTime, Duration } from 'luxon';
import { Gate } from './entity/Gate';
import { TicketType } from './entity/TicketType';

const mqtt = getMqtt();

const topicSub = process.env.MQTT_TOPIC_SUB;
const topicPub = process.env.MQTT_TOPIC_PUB;

// mqtt
function mqttSub(): void {
    mqtt.subscribe(topicSub, function (err: Error): void {
        if (!err) {
            console.log('Subscribed to topic:', topicSub);
        } else {
            console.log('Failed to subscribe to topic:', topicSub, err);
        }
    });
}

function mqttPub(message: string): void {
    mqtt.publish(topicPub, message, function (err: Error) {
        if (!err) {
            console.log('Publish to topic:', topicPub);
        } else {
            console.log('Failed to subscribe to topic:', topicPub, err);
        }
    });
}

async function checkGateType(dataReader: Reader, dataGateType: string): Promise<boolean> {
    console.log("\x1b[32m", 'checkGateType being executed!');
    try {
        if (dataReader.gateType !== dataGateType) {
            console.log(`0 reader with serial number "${dataReader.serialNumber}" and type "${dataGateType}". `);
            return false;
        }
        console.log(`Found reader with serial number "${dataReader.serialNumber}" and type "${dataGateType}". `);
        return true;
    } catch (error) {
        console.error(`Error checking gate type for serial number "${dataReader.serialNumber}" and type "${dataGateType}": `, error);
        throw error;
    }
}

async function checkCardStatus(dataCard: Card, dataStatus: string): Promise<boolean> {
    console.log("\x1b[32m", 'checkCardStatus being executed!');
    try {
        

        if (dataCard.status !== dataStatus) {
            console.log(`0 card with code "${dataCard.code}" and status "${dataStatus}". `);
            return false;
        }
        console.log(`Found card with code "${dataCard.code}" and status "${dataStatus}". `);
        return true;
    } catch (error) {
        console.error(`Error checking card status for card code "${dataCard.code}" and status "${dataStatus}": `, error);
        throw error;
    }
}

async function logCustomerCardTicketType(dataCustomerCardTicketType: CustomerCardTicketType, dataReader: Reader): Promise<void> {
    console.log("\x1b[32m", 'logCustomerCardTicketType being executed')
    try {
        const customerCardTicketTypeLogRepository: Repository<CustomerCardTicketTypeLog> = AppDataSource.getRepository(CustomerCardTicketTypeLog);

        const gate: Gate = await AppDataSource.getRepository(Gate).findOneBy({ id: dataReader.gateId });
        const newCustomerCardTicketTypeLog = new CustomerCardTicketTypeLog();
        newCustomerCardTicketTypeLog.customerCardsTicketType = dataCustomerCardTicketType;
        newCustomerCardTicketTypeLog.gate = gate;
        newCustomerCardTicketTypeLog.createdBy = 'Reader: ' + dataReader.serialNumber;
        await customerCardTicketTypeLogRepository.save(newCustomerCardTicketTypeLog);

        console.log('logCustomerCardTicketType executed sueccesfully')
    } catch (error) {
        console.error(`Error log customer card ticket type: `, error);
        throw error;
    }
}

async function customerExit(dataCard: Card, dataReader: Reader, dataCustomerCardTicketType: CustomerCardTicketType): Promise<void> {
    console.log("\x1b[32m", 'customerExit being executed!');
    try {
        const cardRepository: Repository<Card> = AppDataSource.getRepository(Card);

        const customerCardTicketTypeRepository: Repository<CustomerCardTicketType> = AppDataSource.getRepository(CustomerCardTicketType);

        dataCard.status = 'available';
        dataCard.updatedBy = 'Reader: ' + dataReader.serialNumber;
        await cardRepository.save(dataCard);

        dataCustomerCardTicketType.status = 'exited';
        dataCustomerCardTicketType.updatedBy = 'Reader: ' + dataReader.serialNumber;
        dataCustomerCardTicketType.exitedAt = new Date();
        await customerCardTicketTypeRepository.save(dataCustomerCardTicketType);

        await logCustomerCardTicketType(dataCustomerCardTicketType, dataReader);
        console.log('Customer has exited the area!');

    } catch (error) {
        throw error;
    }
}

async function checkValidGate(dataCustomerCardTicketType: CustomerCardTicketType, dataReader: Reader): Promise<boolean> {
    console.log("\x1b[32m", 'checkValidGate being executed!');
    try {
        const ticketType: TicketType = await AppDataSource.getRepository(TicketType).findOneBy({ id: dataCustomerCardTicketType.ticketTypeId });
        const gate: Gate = await AppDataSource.getRepository(Gate).findOneBy({ id: dataReader.gateId });

        const ticketTypeGate = await AppDataSource.getRepository(TicketTypeGate).findOneBy({
            ticketTypeId: ticketType.id,
            gateId: gate.id,
            status: 'available'
        });

        if (ticketTypeGate === null) {
            console.log('0 vaid gate with ticket type');
            return false;
        }
        else {
            console.log('Found vaid gate with ticket type');
            return true;
        }
    } catch (error) {
        throw error;
    }
}

async function checkActive(dataCustomerCardTicketType: CustomerCardTicketType): Promise<boolean> {
    console.log("\x1b[32m", 'checkActive being executed!');
    try {
        console.log(`customercardtickettype: ${dataCustomerCardTicketType.id}`);
        if (dataCustomerCardTicketType === null) {
            throw new Error('customerCardTicketType not found!');
        }
        else {
            const dataExpiredAt = DateTime.fromJSDate(dataCustomerCardTicketType.expiredAt);
            console.log(`expiredat: ${dataExpiredAt}`);
            if (DateTime.now() > dataExpiredAt) {
                console.log('expired card');
                return false;
            } else {
                console.log('valid card');
                return true;
            }
        }
    } catch (error) {
        throw error;
    }
}

async function checkValidEnterCount(dataCustomerCardTicketType: CustomerCardTicketType, dataReader: Reader) {
    console.log("\x1b[32m", 'checkValidEnterTime being executed!');
    try {

        if (dataCustomerCardTicketType === null) {
            throw new Error('customerCardTicketType not found!');
        }
        else if (dataReader === null) {
            throw new Error('reader not found!');
        }
        const ticketTypeGate: TicketTypeGate = await AppDataSource.getRepository(TicketTypeGate).findOneBy({ 
            ticketTypeId: dataCustomerCardTicketType.ticketTypeId, 
            gateId: dataReader.gateId, 
            status: 'available' 
        });
        if (ticketTypeGate === null) {
            throw new Error('ticketTypeGate not found!');
        }
        else {
            const listLog: CustomerCardTicketTypeLog[] = await AppDataSource.getRepository(CustomerCardTicketTypeLog).findBy({
                customerCardsTicketTypeId: dataCustomerCardTicketType.id,
                gateId: dataReader.gateId
            })

            let count: number = 0;
            let diff: Duration;
            for (let i = 0; i < listLog.length; i++) {
                diff = DateTime.fromJSDate(listLog[i].createdAt).diffNow();

                if (diff.as('hours') <= 24) {
                    count++;
                }
            }
            if (count > ticketTypeGate.maxEntry) {
                console.log('exceed enter times');
                return false;
            } else {
                console.log('valid enter times');
                return true;
            }
        }
    } catch (error) {
        throw error;
    }
}

async function customerEntry(dataCardCode: string, dataSerialNumber: string) {
    console.log("\x1b[32m", 'customerEntry being executed!');
    try {
        const customerCardTicketType: CustomerCardTicketType = await AppDataSource.getRepository(CustomerCardTicketType).findOneBy({
            card: { code: dataCardCode },
            status: 'entered'
        });
        const reader: Reader = await AppDataSource.getRepository(Reader).findOneBy({
            serialNumber: dataSerialNumber,
            status: 'online'
        });
        if (customerCardTicketType === null) {
            throw new Error('customerCardTicketType not found!');
        }
        else if (reader === null) {
            throw new Error('reader not found!');
        }
        else {
            console.log(`Reader: ${reader.serialNumber}`);
            await logCustomerCardTicketType(customerCardTicketType, reader);
        }
    } catch (error) {
        throw error;
    }
}

export function mqttJob(): void {
    mqttSub();
    //mqtt wait for msg
    mqtt.on('message', async function (topicSub, message) {
        console.log("message is " + message);
        console.log("topic is " + topicSub);

        /*
            "card_code": "111111",
            "serial_number": "a1" 
        */
        const jsonMsg = JSON.parse(message.toString());
        const dataCardCode: string = jsonMsg["card_code"];
        const dataSerialNumber: string = jsonMsg["serial_number"];


        try {
            const dataCard: Card = await AppDataSource.getRepository(Card).findOneBy({ code: dataCardCode });
            const dataReader: Reader = await AppDataSource.getRepository(Reader).findOneBy({ serialNumber: dataSerialNumber });
            const dataCustomerCardTicketType: CustomerCardTicketType = await AppDataSource.getRepository(CustomerCardTicketType).findOneBy({
                cardId: dataCard.id,
                status: 'entered'
            })
            if(dataCard === null){
                throw new Error('Card not found!');
            }
            else if(dataReader === null){
                throw new Error('Reader not found!');
            }
            else if(dataCustomerCardTicketType === null){
                throw new Error('CustomerCardTicketType not found!');
            }


            if (!await checkCardStatus(dataCard, 'occupied')) {
                throw new Error('Do not let through! (invalid card)');
            }
            // Check if it is an exit gate
            if (await checkGateType(dataReader, 'exit')) {
                await customerExit(dataCard, dataReader, dataCustomerCardTicketType);
                mqttPub('Valid');
            }
            if (!await checkValidGate(dataCustomerCardTicketType, dataReader)) {
                throw new Error('Do not let through! (invalid gate)');
            }
            if (!await checkActive(dataCustomerCardTicketType)) {
                throw new Error('Do not let through! (expired card)');
            }
            if (!await checkValidEnterCount(dataCustomerCardTicketType, dataReader)) {
                throw new Error('Do not let through! (exceed enter times)');
            } else {
                console.log('Welcome in!');
                await customerEntry(dataCardCode, dataSerialNumber);
                mqttPub('Valid');
            }

        } catch (error) {
            console.error(`Error at reader: "${dataSerialNumber}", error code: ${error.message}`);
            mqttPub('Invalid');
        }
    });
}
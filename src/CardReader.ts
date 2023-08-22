import * as dotenv from 'dotenv';
dotenv.config();

//import luxon
import { Duration } from 'luxon';

// connect to psql
import { getClient } from '../getClient';
import { QueryResult }  from 'pg'

const client = getClient();

// api connection
import express from 'express';
import * as bodyParser from 'body-parser';

const app = express();
app.use(bodyParser.json());

app.listen(8080, () => {
    console.log(`Listening to port 8080`);
});

//connect to mqtt
import { getMqtt } from './getMqtt';

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

mqttSub();

// {
//     "card_code": "abcxyz",
//     "customer_id": "1",
//     "ticket_type_name": 
// }

//get function
async function getCard_idFromCards(card_code: String): Promise<number> {
    console.log(`getCard_idFromCards being executed`);

    const query = {
        text: `SELECT id FROM cards WHERE card_code = $1`,
        values: [card_code]
    };
    const result = await client.query(query);

    return result.rows[0].id as number;
}

async function getTicket_type_idFromTicket_types(name: String): Promise<number> {
    console.log("getTicket_type_idFromTicket_types being executed");

    const query = {
        text: `SELECT id FROM ticket_types WHERE name = $1 AND status = $2`,
        values: [name, 'available']
    };
    const result = await client.query(query) as QueryResult<{ id: number }>;

    return result.rows[0].id
}

async function getTicket_type_idFromCustomer_cards(card_id: number): Promise<number> {
    console.log(`getTicket_type_idFromCustomer_cards being executed!`);

    const query = {
        text: `SELECT ticket_type_id FROM customer_cards WHERE card_id = $1 AND status = 'entered'`,
        values: [card_id]
    };
    const result = await client.query(query);


    return result.rows[0].ticket_type_id as number;
}

async function getGate_idFromTicket_type_gates(ticket_type_id) {
    console.log(`getGate_idFromTicket_type_gates being executed!`);

    const query = {
        text: `SELECT gate_id FROM ticket_type_gates WHERE ticket_type_id = $1`,
        values: [ticket_type_id]
    };
    const result = await client.query(query);

    return result.rows.map(row => row.gate_id);
}

async function getGate_idFromReader(serial_number) {
    console.log(`getGate_idFromReader being executed!`);

    const query = {
        text: `SELECT gate_id FROM readers WHERE serial_number = $1`,
        values: [serial_number]
    };
    const result = await client.query(query);

    return result.rows[0].gate_id;
}

async function getIdFromCustomer_cards(card_id) {
    console.log(`getIdFromCustomer_cards being executed!`);

    const query = {
        text: `SELECT id FROM customer_cards WHERE card_id = $1 AND status = $2`,
        values: [card_id, 'entered']
    };
    const result = await client.query(query);

    return result.rows[0].id;
}

async function getMax_entryFromTicket_type_gates(ticket_type_id, gate_id) {
    console.log(`getMax_entryFromTicket_type_gates being executed!`);

    const query = {
        text: `SELECT max_entry FROM ticket_type_gates WHERE ticket_type_id = $1 AND gate_id = $2`,
        values: [ticket_type_id, gate_id]
    };
    const result = await client.query(query);

    return result.rows[0].max_entry;
}


//check function
async function check4Duplicate(table, column, variable) {
    console.log(`check4Duplicate being executed!`);

    const query = {
        text: `SELECT EXISTS(SELECT 1 FROM ${table} WHERE ${column} = $1)`,
        values: [variable]
    };

    const result = await client.query(query);

    if (result.rows[0].exists) {
        console.log(`This "${variable}" already exists in the database`);
        return true;
    } else {
        console.log(`This "${variable}" NOT exists in the database`);
        return false;
    }
}

// de xai chung voi customerEnter vi chua biet customer_id se nhu the nao va ai se map the-khach
async function checkCustomerEnter(customer_id, card_id) {
    console.log(`checkCustomerEnter being executed!`);

    const query = {
        text: `SELECT EXISTS(SELECT 1 FROM customer_cards WHERE customer_id = $1 AND status = 'entered'
        UNION ALL 
        SELECT 1 FROM cards WHERE id = $2 AND status != 'available'
        LIMIT 1)`,
        values: [customer_id, card_id]
    };

    const result = await client.query(query);

    if (result.rows[0].exists) {
        console.log(`Customer_id "${customer_id}" already entered OR this card "${card_id} is NOT available`);
        return true;
    } else {
        console.log(`Customer_id "${customer_id}" NOT enter AND this card "${card_id} is available`);
        return false;
    }
}

async function checkCardAvailable(card_id) {
    console.log(`checkCardAvailable being executed!`);
    try {
        const query = {
            text: `SELECT EXISTS(SELECT 1 FROM cards WHERE id = $1 AND status = 'available')`,
            values: [card_id]
        };
        const result = await client.query(query);

        if (result.rows[0].exists) {
            console.log(`This card_id: "${card_id}" is available`);
            return true;
        } else {
            console.log(`This card_id: "${card_id}" is NOT available`);
            return false;
        }
    } catch (error) {
        console.error(`Error in checkCardAvailable: ${error}`);
        throw error;
    }
}

async function checkGateType(serial_number, gate_type) {
    console.log(`checkGateType being executed`);

    const query = {
        text: `SELECT EXISTS(SELECT 1 FROM readers WHERE serial_number = $1 AND gate_type = $2 )`,
        values: [serial_number, gate_type]
    };

    const result = await client.query(query);

    if (result.rows[0].exists) {
        console.log(`This reader with serial number: "${serial_number}" is a "${gate_type}" gate`);
        return true;
    } else {
        console.log(`This reader with serial number: "${serial_number}" is NOT a "${gate_type}" gate`);
        return false;
    }
}

function checkValidGate(gate_id_reader, gate_id_ticket) {
    console.log(`checkValidGate being executed!`);

    if (gate_id_ticket.includes(gate_id_reader)) {
        console.log(`Valid ticket type!`);
        return true;
    } else {
        console.log(`Invalid ticket type!`);
        return false;
    }
}

function checkValidEnter(max_entry, count) {
    console.log(`checkValidEnter being executed!`);
    if (count <= max_entry) {
        console.log(`<= limit entry time`);
        return true;
    } else {
        console.log(`> limit entry time`);
        return false;
    }
}

// check active about expired time
async function checkActive(card_id) {
    try {
        const query = {
            text: `SELECT expired_at FROM customer_cards WHERE card_id = $1 AND status = 'entered'`,
            values: [card_id]
        };
        const result = await client.query(query);
        const expired_at = result.expired_at;

        const now = new Date();
        const diff = now.getTime() - new Date(expired_at).getTime(); // calculate the difference between now and the time

        if (diff >= 0) {
            console.log(`This card NOT expired yet!`);
            return true;
        } else {
            console.log(`This card is expired!`);
            return false;
        }
    } catch (error) {
        console.error(`Error check expired: ${error}`);
        throw error;
    }
}


//other function

//api addcard rescan the bi mat de add lai vao db
async function addCard() {
    console.log(`addCard being executed!`);
    app.post(`/addCard`, async (req, res) => {
        const data_card_code = req.body.card_code;
        const data_status = `available`;
        const data_created_at = new Date().toISOString();
        const data_created_by = req.body.created_by;

        const data_table = "cards";
        const data_column = "card_code";
        try {
            if (await check4Duplicate(data_table, data_column, data_card_code)) {
                console.log(`This card: "${data_card_code}" already exists in the database`);
                await setStatus(data_table, data_column, data_card_code, data_created_by, data_status); // set status of this data to available

                res.sendStatus(200); // Return a 200 OK status code
            } else {

                const insertQuery = {
                    text: `INSERT INTO cards(card_code, status, created_at, created_by) VALUES($1, $2, $3, $4)`,
                    values: [data_card_code, data_status, data_created_at, data_created_by]
                };
                const insertResult = await client.query(insertQuery);
                console.log(`Inserted ${insertResult.rowCount} row`);

                res.sendStatus(201); // Return a 201 Created status code
            }
        } catch (error) {
            console.error(`Error inserting card with code "${data_card_code}": `, error);
            res.status(500).send({ message: 'Error inserting card' });
        }
    })
}

async function setExpired_at(ticket_type_id) {
    console.log(`setExpired_at being executed!`);

    const query = {
        text: `SELECT duration FROM ticket_types WHERE id = $1`,
        values: [ticket_type_id]
    };
    const result = await client.query(query);

    const duration = Duration.fromISO(result.rows[0].duration);

    const currentTime = new Date();
    const expired_at = new Date(currentTime.getTime() + duration.toMillis());

    const expired_atResult = expired_at.toISOString();

    return expired_atResult;
}

function durationToMilliseconds(duration) {
    const match = duration.match(/^PT(\d+H)?(\d+M)?$/);

    if (!match) {
        throw new Error('Invalid duration format');
    }

    const hours = match[1] ? parseInt(match[1]) : 0;
    const minutes = match[2] ? parseInt(match[2]) : 0;

    const totalMilliseconds = (hours * 60 * 60 * 1000) + (minutes * 60 * 1000);

    return totalMilliseconds;
} // use 'luxon' package instead

async function setStatus(table, where_column, where_variable, update_by, status) {
    try {
        console.log(`setStatus being executed`);

        const updated_at = new Date().toISOString();

        const query = {
            text: `UPDATE ${table} SET status = $1, updated_at = $2, updated_by = $3 WHERE ${where_column} = $4`,
            values: [status, updated_at, update_by, where_variable]
        };

        const result = await client.query(query);

        if (result.rowCount === 1) {
            console.log(`Successfully updated "${table}" record where ${where_column} = "${where_variable}"`);
        } else {
            console.log(`No "${table}" record found where ${where_column} = "${where_variable}"`);
        }

    } catch (error) {
        console.error(`Error updating "${table}" record where ${where_column} = "${where_variable}": `, error);
        throw new Error(`Error updating "${table}" record where ${where_column} = "${where_variable}"`);
    }
}

//api addTicket_types
async function addTicket_types() {
    console.log(`addTicket_types being executed!`);

    app.post(`/addTicket_type`, async (req, res) => {
        const data_name = req.body.name;
        const data_status = `available`;
        const data_duration = req.body.duration; // ISO standard (PT5H30M)
        const data_created_at = new Date().toISOString();
        const data_created_by = req.body.created_by;

        try {
            if (await check4Duplicate(`ticket_types`, `name`, data_name)) {
                console.log(`This ticket_type: ${data_name} already exists in the database`);
                await setStatus(`ticket_types`, `name`, data_name, data_created_by, data_status); // set status of this data to available 

                res.sendStatus(200); // Return a 200 OK status code to indicate that the ticket type already exists

            } else {
                const insertQuery = {
                    text: `INSERT INTO ticket_types(name, status, duration, created_at, created_by) VALUES($1, $2, $3, $4, $5)`,
                    values: [data_name, data_status, data_duration, data_created_at, data_created_by]
                };
                const insertResult = await client.query(insertQuery);
                console.log(`Inserted ${insertResult.rowCount} row`);

                res.sendStatus(201); // Return a 201 Created status code on successful insertion
            }

        } catch (error) {
            console.error(`Error inserting ticket type with name ${data_name}: `, error);
            res.status(500).send({ message: 'Error inserting ticket type' });
            throw error;
        }
    })
}

// tinh nang nay chua biet co xai hay ko vi ko chua biet ai se map the-khach
async function customerEnter() {
    console.log(`customerEnter being executed!`);
    app.post(`/customerEnter`, async (req, res) => {
        const data_customer_id = req.body.customer_id;
        try {
            const data_card_id = await getCard_idFromCards(req.body.card_code);
            const data_ticket_type_id = await getTicket_type_idFromTicket_types(req.body.ticket_type_name);
            const data_status = `entered`;
            const data_created_at = new Date().toISOString();
            const data_created_by = req.body.created_by;
            const data_expired_at = await setExpired_at(data_ticket_type_id); // current time + duartion 

            const data_card_table = `cards`;
            const data_card_column = `id`;
            const data_card_status = `occupied`;


            if (!checkCardAvailable(data_card_id)) {
                console.log(`Card is not available`);
                res.sendStatus(409); // Return a 409 Conflict status code if already exists
                return;
            }

            const insertQuery = {
                text: `INSERT INTO customer_cards(customer_id, card_id, ticket_type_id, status, created_at, created_by, expired_at) VALUES($1, $2, $3, $4, $5, $6, $7)`,
                values: [data_customer_id, data_card_id, data_ticket_type_id, data_status, data_created_at, data_created_by, data_expired_at]
            };
            const insertResult = await client.query(insertQuery);
            console.log(`Inserted ${insertResult.rowCount} row`);

            await setStatus(data_card_table, data_card_column, data_card_id, data_created_by, data_card_status);

            res.sendStatus(201); // Return a 201 Created status code on successful insertion
        } catch (error) {
            console.error(`Error inserting customer with code ${data_customer_id}: `, error);
            res.status(500).send({ message: 'Error inserting card' });
        }
    })
}

async function customerExit(card_id, update_by) {
    console.log(`customerExit being executed!`);

    const data_table = `customer_cards`;
    const data_column = `card_id`;
    const data_update_by = update_by;
    const data_status = `exited`;

    await setStatus(data_table, data_column, card_id, update_by, data_status);
}

async function logCustomer(customer_cards_id, gate_id, created_by) {
    console.log(`logCustomer being executed!`);

    const data_created_at = new Date().toISOString();

    const query = {
        text: `INSERT INTO customer_card_logs(customer_cards_id, gate_id, created_at, created_by) VALUES($1, $2, $3, $4)`,
        values: [customer_cards_id, gate_id, data_created_at, created_by]
    };
    const result = await client.query(query);
    console.log(`Inserted ${result.rowCount} row`);
}

async function countEntryTime(customer_cards_id, gate_id_reader) {
    console.log(`countEntryTime being executed!`);

    const query = {
        text: `SELECT * FROM customer_card_logs WHERE customer_cards_id = $1 AND gate_id = $2`,
        values: [customer_cards_id, gate_id_reader]
    };
    const result = await client.query(query);

    return result.rowCount;
}



addCard();
addTicket_types();
customerEnter();

// mqtt wait for msg
mqtt.on('message', async function (topic_sub, message) {
    console.log("message is " + message);
    console.log("topic is " + topic_sub);

    /*
        "card_code": "ABC",
        "serial_number": "ljdkashd" 
    */
    const json_message = JSON.parse(message);
    const data_card_code = json_message["card_code"];
    const data_serial_number = json_message["serial_number"];
    try {
        const data_card_id = await getCard_idFromCards(data_card_code);
        const data_update_by = `Reader: ${data_serial_number}`;

        const data_ticket_type_id_customer = await getTicket_type_idFromCustomer_cards(data_card_id)

        const data_gate_id_reader = await getGate_idFromReader(data_serial_number);
        const data_gate_id_ticket = await getGate_idFromTicket_type_gates(data_ticket_type_id_customer);

        const data_max_entry = await getMax_entryFromTicket_type_gates(data_ticket_type_id_customer, data_gate_id_reader);
        const data_customer_cards_id = await getIdFromCustomer_cards(data_card_id);
        const data_customer_entry_time = await countEntryTime(data_customer_cards_id, data_gate_id_reader);

        //check if it is a exit gate
        if (await checkGateType(data_serial_number, `exit`)) {
            await customerExit(data_card_id, data_update_by);
            console.log(`Customer have exit the area!`);
            return;
        }
        if (!checkValidGate(data_gate_id_reader, data_gate_id_ticket)) {
            console.log(`Do not let through! (invalid gate)`);
            return;
        }
        if (!await checkActive(data_card_id)) {
            console.log(`Do not let through! (expired card)`);
            return;
        }
        if (!checkValidEnter(data_max_entry, data_customer_entry_time)) {
            console.log(`Do not let through! (exceed enter times)`);
            return;
        }
        console.log(`Welcome in!`);
        await logCustomer(data_customer_cards_id, data_gate_id_reader, data_update_by);

    } catch (error) {
        console.error(`Error at reader: "${data_serial_number}", error code: ${error}`);
    }

})
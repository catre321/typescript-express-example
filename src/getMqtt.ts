import * as mqtt from 'mqtt';

import * as dotenv from 'dotenv';
dotenv.config();

console.log(`MQTT config: host:${process.env.MQTT_HOST}, user:${process.env.MQTT_USER}, pass:${process.env.MQTT_PASSWORD}, topic_sub:${process.env.MQTT_TOPIC_SUB}, topic_pub:${process.env.MQTT_TOPIC_PUB}`);

const client = mqtt.connect(process.env.MQTT_HOST, {
    username: process.env.MQTT_USER,
    password: process.env.MQTT_PASSWORD,
    // reconnectPeriod: 1
});

client.on('connect', function () {
    console.log('Connected to MQTT broker');
})

client.on('error', function (err) {
    console.log("Connected flag  " + client.connected);
})

export function getMqtt() {
    return client;
}
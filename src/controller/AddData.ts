import { Request, Response } from "express";
import { Card } from "../entity/Card";
import { AppDataSource } from "../DataSource";
import { Customer } from "../entity/Customer";
import { Gate } from "../entity/Gate";
import { Repository } from "typeorm";
import { TicketType } from "../entity/TicketType";
import { DateTime, Duration } from 'luxon';
import { Reader } from "../entity/Reader";
import { TicketTypeGate } from '../entity/TicketTypeGate';
import { CustomerCardTicketType } from "../entity/CustomerCardsTicketType";

export type AddCardRequest = {
    cardCode: string,
    cardStatus: string,
    createdBy: string
}
export async function addCard(request: Request, response: Response) {
    console.log("addCard being executed!");
    const body = request.body as AddCardRequest;

    const dataCardCode = body.cardCode;
    const dataStatus = body.cardStatus;
    const dataCreatedBy = body.createdBy;

    try {
        const cardRepository: Repository<Card> = AppDataSource.getRepository(Card);

        const existingCard: Card = await cardRepository.findOneBy({ code: dataCardCode });

        if (existingCard) {
            console.log(`Card with code "${dataCardCode}" already exists`);
            response.send(`Card with code "${dataCardCode}" already exists`);
        } else {
            const newCard: Card = new Card();
            newCard.code = dataCardCode;
            newCard.status = dataStatus;
            newCard.createdBy = dataCreatedBy;
            await cardRepository.save(newCard);
            console.log(`Successfully inserted card with code "${dataCardCode}"`);
            response.send(`Successfully inserted card with code "${dataCardCode}"`);
        }
    } catch (error) {
        console.error(`Error inserting card with code "${dataCardCode}": `, error);
        response.send(`Error: ${error.message}`);
    }
}

export type AddCustomerRequest = {
    customerName: string,
    customerStatus: string,
    createdBy: string
}
export async function addCustomer(request: Request, response: Response) {
    console.log("addCustomer being executed!");
    const body = request.body as AddCustomerRequest;

    const dataName = body.customerName;
    const dataStatus = body.customerStatus;
    const dataCreatedBy = body.createdBy;

    try {
        const customerRepository: Repository<Customer> = AppDataSource.getRepository(Customer);

        const existingCustomer: Customer = await customerRepository.findOneBy({ name: dataName });

        if (existingCustomer) {
            console.log(`Customer with name "${dataName}" already exists`);
            response.send(`Customer with name "${dataName}" already exists`);
        } else {
            const newCustomer: Customer = new Customer();
            newCustomer.name = dataName;
            newCustomer.status = dataStatus;
            newCustomer.createdBy = dataCreatedBy;
            await customerRepository.save(newCustomer);
            console.log(`Successfully inserted customer with name "${dataName}"`);
            response.send("Complete");
        }
    } catch (error) {
        console.error(`Error inserting customer with name "${dataName}": `, error);
        response.send(`Error: ${error.message}`);
    }

}

export type AddGateRequest = {
    gateName: string,
    gateStatus: string,
    createdBy: string
}
export async function addGate(request: Request, response: Response) {
    console.log("addGate being executed!");
    const body = request.body as AddGateRequest;

    const dataName = body.gateName;
    const dataStatus = body.gateStatus;
    const dataCreatedBy = body.createdBy;

    try {
        const gateRepository: Repository<Gate> = AppDataSource.getRepository(Gate);

        const existingGate: Gate = await gateRepository.findOneBy({ name: dataName });

        if (existingGate) {
            console.log(`Gate with name "${dataName}" already exists`);
            response.send(`Gate with name "${dataName}" already exists`);
        } else {
            const newGate: Gate = new Gate();
            newGate.name = dataName;
            newGate.status = dataStatus;
            newGate.createdBy = dataCreatedBy;
            await gateRepository.save(newGate);
            console.log(`Successfully inserted gate with name "${dataName}"`);
            response.send("Complete");
        }
    } catch (error) {
        console.error(`Error inserting gate with name "${dataName}": `, error);
        response.send(`Error: ${error.message}`);
    }
}

export type AddTicketTypeRequest= {
    ticketTypeName: string,
    ticketTypeStatus: string,
    ticketTypeDuration: string,
    createdBy:string
}
export async function addTicketType(request: Request, response: Response) {
    console.log("addTicketType being executed!");
    const body = request.body as AddTicketTypeRequest;

    const dataName = body.ticketTypeName;
    const dataStatus = body.ticketTypeStatus;
    const dataDurationString = body.ticketTypeDuration;
    const dataCreatedBy = body.createdBy;

    try {
        if (!Duration.isDuration(Duration.fromISO(dataDurationString))) {
            console.log("duration: ", dataDurationString);
            throw new Error("Duration is not a valid ISO duration");
        }

        const ticketTypeRepository: Repository<TicketType> = AppDataSource.getRepository(TicketType);

        const existingTicketType: TicketType = await ticketTypeRepository.findOneBy({ name: dataName });

        if (existingTicketType) {
            console.log(`TicketType with name "${dataName}" already exists`);
            response.send(`TicketType with name "${dataName}" already exists`);
        } else {
            const newTicketType: TicketType = new TicketType();
            newTicketType.name = dataName;
            newTicketType.status = dataStatus;
            newTicketType.duration = dataDurationString;
            newTicketType.createdBy = dataCreatedBy;
            await ticketTypeRepository.save(newTicketType);
            console.log(`Successfully inserted TicketType with name "${dataName}"`);
            response.send("Complete");
        }
    } catch (error) {
        console.error(`Error inserting TicketType with name "${dataName}": `, error);
        response.send(`Error: ${error.message}`);
    }

}

export type AddReaderRequest = {
    gateType: string,
    serialNumber: string,
    gateName: string,
    readerStatus: string,
    createdBy: string
}
export async function addReader(request: Request, response: Response) {
    console.log("addReader being executed!");
    const body = request.body as AddReaderRequest;

    const dataGateType = body.gateType;
    const dataSerialNumber = body.serialNumber;
    const dataGateName = body.gateName;
    const dataStatus = body.readerStatus;
    const dataCreatedBy = body.createdBy;

    try {
        const gate: Gate = await AppDataSource.getRepository(Gate).findOneBy({ name: dataGateName });
        if(gate === null){
            console.log(`Cannot find gate with ${dataGateName}`);
            throw new Error("Gate not found");
        }

        const readerRepository: Repository<Reader> = AppDataSource.getRepository(Reader);

        const existingReader: Reader = await readerRepository.findOneBy({ serialNumber: dataSerialNumber });

        if (existingReader) {
            console.log(`Reader with serial number "${dataSerialNumber}" already exists`);
            response.send(`Reader with serial number "${dataSerialNumber}" already exists`);
        } else {
            const newReader: Reader = new Reader();
            newReader.gateType = dataGateType;
            newReader.serialNumber = dataSerialNumber;
            newReader.gate = gate;
            newReader.status = dataStatus;
            newReader.createdBy = dataCreatedBy;
            await readerRepository.save(newReader);
            console.log(`Successfully inserted reader with serial number "${dataSerialNumber}"`);
            response.send("Complete");
        }
    } catch (error) {
        console.error(`Error inserting reader with serial number "${dataSerialNumber}": `, error);
        response.send(`Error: ${error.message}`);
    }

}

export type AddTicketTypeGateRequest = {
    ticketTypeName: string;
    gateName: string;
    maxEntry: number;
    status: string;
    createdBy: string;
}
export async function addTicketTypeGate(request: Request, response: Response) {
    console.log("addTicketTypeGates being executed!");
    const body = request.body as AddTicketTypeGateRequest;
    
    const dataTicketTypeName = body.ticketTypeName;
    const dataGateName = body.gateName;
    const dataMaxEntry = body.maxEntry;
    const dataStatus = body.status;
    const dataCreatedBy = body.createdBy;

    try {
        const ticketType: TicketType = await AppDataSource.getRepository(TicketType).findOneBy({ 
            name: dataTicketTypeName
        });
        const gate: Gate = await AppDataSource.getRepository(Gate).findOneBy({ name: dataGateName });
        if(ticketType === null){
            console.log(`Cannot find ticketType with ${dataTicketTypeName}`);
            throw new Error("TicketType not found");
        } else if(gate === null){  
            console.log(`Cannot find gate with ${dataGateName}`);
            throw new Error("Gate not found");
        }

        const ticketTypeGateRepository: Repository<TicketTypeGate> = AppDataSource.getRepository(TicketTypeGate);

        const existingTicketTypeGate: TicketTypeGate = await ticketTypeGateRepository.findOneBy({ 
            ticketTypeId: ticketType.id, 
            gateId: gate.id 
        });

        if (existingTicketTypeGate) {
            console.log(`TicketTypeGate with ticketType "${dataTicketTypeName}, gate name "${dataGateName}" already exists`);
            response.send(`TicketTypeGate with ticketType "${dataTicketTypeName}, gate name "${dataGateName}" already exists`);
        } else {
            const newTicketTypeGate: TicketTypeGate = new TicketTypeGate();
            newTicketTypeGate.ticketType = ticketType;
            newTicketTypeGate.gate = gate;
            newTicketTypeGate.maxEntry = dataMaxEntry;
            newTicketTypeGate.status = dataStatus;
            newTicketTypeGate.createdBy = dataCreatedBy;
            await ticketTypeGateRepository.save(newTicketTypeGate);
            console.log(`Successfully inserted TicketTypeGate with ticketType "${dataTicketTypeName}, gate name "${dataGateName}"`);
            response.send("Complete");
        }
    } catch (error) {
        console.error(`Error inserting TicketTypeGate with ticketType "${dataTicketTypeName}", gate name "${dataGateName}": `, error);
        response.send(`Error: ${error.message}`);
    }

}

export type AddCustomerCardTicketTypeRequest = {
    customerName: string;
    customerCardCode: string;
    customerTicketTypeName: string;
    createdBy: string;
}
export async function addCustomerCardTicketType(request: Request, response: Response) {
    console.log('addCustomerCardTicketType being executed!');
    const body = request.body as AddCustomerCardTicketTypeRequest;

    const dataCustomerName = body.customerName;
    const dataCustomerCardCode = body.customerCardCode;
    const dataCustomerTicketTypeName = body.customerTicketTypeName;
    const dataCreatedBy = body.createdBy;

    try {
        const dataCustomer: Customer = await AppDataSource.getRepository(Customer).findOneBy({ name: dataCustomerName });

        const cardRepository: Repository<Card> = AppDataSource.getRepository(Card);
        const dataCard: Card = await cardRepository.findOneBy({
            code: dataCustomerCardCode,
            status: 'available' 
        });

        const dataTicketType: TicketType = await AppDataSource.getRepository(TicketType).findOneBy({ 
            name: dataCustomerTicketTypeName,
            status: 'available' 
        });

        if (dataCustomer == null) {
            console.log(`Customer with name "${dataCustomerName}" does not exist`);
            throw new Error(`Customer not found`);
        }
        else if (dataCard == null) {
            console.log(`Card with code "${dataCustomerCardCode}" does not exist`);
            throw new Error(`Card not found`);
        }
        else if (dataTicketType == null) {
            console.log(`TicketType with name "${dataCustomerTicketTypeName}" does not exist`);
            throw new Error(`TicketType not found`);
        }
        const customerCardTickeTypeRepository: Repository<CustomerCardTicketType> = AppDataSource.getRepository(CustomerCardTicketType);

        const existingCustomerCardTicketType: CustomerCardTicketType = await customerCardTickeTypeRepository.findOneBy({
            customerId: dataCustomer.id,
            cardId: dataCard.id,
            ticketTypeId: dataTicketType.id
        })

        if (existingCustomerCardTicketType != null) {
            console.log(`CustomerCardTicketType with customer "${dataCustomerName}", card "${dataCustomerCardCode}", ticketType "${dataCustomerTicketTypeName}" already exists`);
            response.send("This map already exists");
        } else {
            console.log(`existingMap: ${existingCustomerCardTicketType}`)

            dataCard.status = 'occupied'
            dataCard.updatedBy = dataCreatedBy;
            cardRepository.save(dataCard);

            const newCustomerCardTicketType: CustomerCardTicketType = new CustomerCardTicketType();
            newCustomerCardTicketType.customer = dataCustomer;
            newCustomerCardTicketType.card = dataCard;
            newCustomerCardTicketType.ticketType = dataTicketType;
            newCustomerCardTicketType.status = 'entered';
            newCustomerCardTicketType.createdBy = dataCreatedBy;
            // Parse the ISO duration using Luxon's Duration object
            const duration: Duration = Duration.fromISO(dataTicketType.duration);
            // Get the current date and time
            const currentDate: DateTime = DateTime.now();
            // Add the duration to the current date to calculate the expiration date
            const expirationDate: DateTime = currentDate.plus(duration);
            // Assign the expiration date to the expiredAt property of newCustomerCardTicketType
            newCustomerCardTicketType.expiredAt = expirationDate.toJSDate();
            customerCardTickeTypeRepository.save(newCustomerCardTicketType);
            console.log(`Successfully inserted CustomerCardTicketType with customer "${dataCustomerName}", card "${dataCustomerCardCode}", ticketType "${dataCustomerTicketTypeName}"`);

            response.send("Complete");
        }
    } catch (error) {
        console.error(`Error inserted CustomerCardTicketType with customer "${dataCustomerName}", card "${dataCustomerCardCode}", ticketType "${dataCustomerTicketTypeName}": `, error);
        response.send("Error");
    }
}
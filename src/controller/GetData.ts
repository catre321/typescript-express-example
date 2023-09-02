import { Request, Response } from "express";
import { Card } from "../entity/Card";
import { AppDataSource } from "../DataSource";
import { Customer } from "../entity/Customer";
import { Gate } from "../entity/Gate";
import { Repository } from "typeorm";
import { TicketType } from "../entity/TicketType";
import { DateTime, Duration } from "luxon";
import { Reader } from "../entity/Reader";
import { TicketTypeGate } from "../entity/TicketTypeGate";
import { CustomerCardTicketType } from "../entity/CustomerCardsTicketType";

export async function getCardList(request: Request, response: Response) {
  try {
    console.log("getCardList being executed");
    const cardRepository: Repository<Card> = AppDataSource.getRepository(Card);
    const cardList: Card[] = await cardRepository.find();

    response.json(cardList);
  } catch (error) {
    console.error("Error getting card list: ", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

export async function getCustomerList(request: Request, response: Response) {}
export async function getGateList(request: Request, response: Response) {
  try {
    const gateRepository: Repository<Gate> = AppDataSource.getRepository(Gate);
    const gateList: Gate[] = await gateRepository.find();

    response.json(gateList);
  } catch (error) {
    console.error("Error getting gate list: ", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}
export async function getTicketTypeList(request: Request, response: Response) {
  try {
    const TicketTypeRepository: Repository<TicketType> = AppDataSource.getRepository(TicketType);
    const ticketTypeList: TicketType[] = await TicketTypeRepository.find();

    response.json(ticketTypeList);
  } catch (error) {
    console.error("Error getting ticket type list: ", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

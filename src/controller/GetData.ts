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
    const cardRepository: Repository<Card> = AppDataSource.getRepository(Card);
    const cardList: Card[] = await cardRepository.find();

    response.json(cardList);
  } catch (error) {
    console.error("Error getting card list: ", error);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

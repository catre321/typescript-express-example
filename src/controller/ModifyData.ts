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

export async function updateCard(request: Request, response: Response) {
  try {
    console.log("updateCard being executed!");
    const dataCardCode: string = request.body.cardCode;
    const dataStatus: string = request.body.cardStatus;
    const dataNote: string = request.body.cardNote;
    const dataUpdatedBy: string = request.body.updatedBy;

    const cardRepository: Repository<Card> = AppDataSource.getRepository(Card);

    const existingCard: Card = await cardRepository.findOneBy({
      code: dataCardCode,
    });

    if (!existingCard) {
      console.log(`Card with code "${dataCardCode}" DO NOT exists`);
      response.send(`Card with code "${dataCardCode}" DO NOT exists`);
    } else {
      // const existingCard: Card = new Card();
      existingCard.code = dataCardCode;
      existingCard.status = dataStatus;
      existingCard.note = dataNote;
      existingCard.updatedBy = dataUpdatedBy;
      await cardRepository.update(existingCard.id, existingCard);
      console.log(`Successfully updated card with code "${dataCardCode}"`);
      response.send(`Successfully updated card with code "${dataCardCode}"`);
    }
  } catch (error) {
    console.error("Error update card: ", error);
    response.send(`Error: ${error.message}`);
    response.status(500).json({ error: "Internal Server Error" });
  }
}

import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { CustomerCardTicketType } from "./CustomerCardsTicketType";

@Entity('card')
export class Card {

    @PrimaryGeneratedColumn()
    id: number;

    @Index("card_code_idx", { unique: true})
    @Column({ unique: true, name: 'code'})
    code: string;
    
    @Column()
    status: string;

    @Column({ nullable: true })
    note: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by' })
    createdBy: string;

    @Column({ nullable: true, name: 'updated_by' })
    updatedBy: string;

    // CustomerCardsTicketType
    @OneToMany(
        () => CustomerCardTicketType,
        customerCardsTicketType => customerCardsTicketType.customer
    )
    customerCardsTicketTypes: CustomerCardTicketType[];
}

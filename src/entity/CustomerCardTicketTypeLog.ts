import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from "typeorm";
import { CustomerCardTicketType } from "./CustomerCardsTicketType";
import { Gate } from "./Gate";

@Entity('customer_card_ticket_type_log')
export class CustomerCardTicketTypeLog {
    
    @PrimaryColumn({ name: 'customer_cards_ticket_type_id' })
    customerCardsTicketTypeId: number;

    @PrimaryColumn({ name: 'gate_id' })
    gateId: number;
    
    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by' })
    createdBy: string;

    @Column({ nullable: true, name: 'updated_by' })
    updatedBy: string;

    // CustomerCardsTicketType
    @ManyToOne(
        () => CustomerCardTicketType,
        customerCardsTicketType => customerCardsTicketType.customerCardsTicketTypeLogs
    )
    @JoinColumn({ name: 'customer_cards_ticket_type_id' })
    customerCardsTicketType: CustomerCardTicketType;

    // Gates
    @ManyToOne(
        () => Gate,
        gate => gate.customerCardsTicketTypeLogs
    )
    @JoinColumn({ name: 'gate_id' })
    gate: Gate;
}
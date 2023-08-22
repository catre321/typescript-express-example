import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany, RelationId, Index } from "typeorm";
import { Customer } from './Customer';
import { Card } from "./Card";
import { TicketType } from "./TicketType";
import { CustomerCardTicketTypeLog } from "./CustomerCardTicketTypeLog";

@Index("customer_card_ticket_type_card_id_status_idx", ["cardId", "status"])
@Entity('customer_card_ticket_type')
export class CustomerCardTicketType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    status: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by' })
    createdBy: string;

    @Column({ nullable: true, name: 'updated_by' })
    updatedBy: string;

    @Column({ nullable: true, type: 'timestamptz', name: 'exited_at' })
    exitedAt: Date;

    @Column({ type: 'timestamptz', name: 'expired_at' })
    expiredAt: Date;

    // Customer
    @ManyToOne(
        () => Customer,
        customer => customer.customerCardsTicketTypes
    )
    @JoinColumn({ name: 'customer_id'})
    customer: Customer;
    @Column({ name: 'customer_id' })
    customerId: number;

    // Card
    @ManyToOne(
        () => Card,
        card => card.customerCardsTicketTypes
    )
    @JoinColumn({ name: 'card_id' })
    card: Card;
    @Column({ name: 'card_id' })
    cardId: number;

    // TicketType
    @ManyToOne(
        () => TicketType,
        ticketType => ticketType.customerCardsTicketTypes
    )
    @JoinColumn({ name: 'ticket_type_id' })
    ticketType: TicketType;
    @Column({ name: 'ticket_type_id' })
    ticketTypeId: number;

    //CustomerCardsTicketTypeLogs
    @OneToMany(
        () => CustomerCardTicketTypeLog,
        customerCardsTicketTypeLog => customerCardsTicketTypeLog.customerCardsTicketType
    )
    customerCardsTicketTypeLogs: CustomerCardTicketTypeLog[];
}

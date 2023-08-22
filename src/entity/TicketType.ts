import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { CustomerCardTicketType } from "./CustomerCardsTicketType";
import { TicketTypeGate } from "./TicketTypeGate";

@Index('ticket_type_name_status_idx', ['name', 'status'])
@Entity('ticket_type')
export class TicketType {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
    @Column()
    status: string;

    @Column({  })
    duration: string;

    @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'created_by' })
    createdBy: string;

    @Column({ nullable: true, name: 'updated_by' })
    updatedBy: string;

    // TicketTypeGates
    @OneToMany(
        () => TicketTypeGate,
        ticketTypeGate => ticketTypeGate.ticketType
    )
    ticketTypeGates: TicketTypeGate[];

    // CustomerCardsTicketType
    @OneToMany(
        () => CustomerCardTicketType,
        customerCardsTicketType => customerCardsTicketType.customer
    )
    customerCardsTicketTypes: CustomerCardTicketType[];
}
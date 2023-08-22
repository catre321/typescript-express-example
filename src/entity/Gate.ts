import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { Reader } from "./Reader";
import { TicketTypeGate } from "./TicketTypeGate";
import { CustomerCardTicketTypeLog } from "./CustomerCardTicketTypeLog";

@Entity('gate')
export class Gate {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;
    
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

    // TicketTypeGates
    @OneToMany(
        () => TicketTypeGate,
        ticketTypeGate => ticketTypeGate.gate
    )
    ticketTypeGates: TicketTypeGate[];

    // Readers
    @OneToMany(
        () => Reader,
        reader => reader.gate
    )
    readers: Reader[];

    // CustomerCardsTicketTypeLogs
    @OneToMany(
        () => CustomerCardTicketTypeLog,
        customerCardsTicketTypeLog => customerCardsTicketTypeLog.gate
    )
    customerCardsTicketTypeLogs: CustomerCardTicketTypeLog[];
}

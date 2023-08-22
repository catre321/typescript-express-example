import { Entity, Column, PrimaryColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, Index } from "typeorm";
import { TicketType } from "./TicketType";
import { Gate } from "./Gate";

@Index('ticket_type_gate_ticket_type_id_gate_id_status_idx', ['ticketTypeId', 'gateId', 'status'], { unique: true })
@Entity('ticket_type_gate')
export class TicketTypeGate {

    @PrimaryColumn({ name: 'ticket_type_id' })
    ticketTypeId: number;

    @PrimaryColumn({ name: 'gate_id' })
    gateId: number;

    @Column({ name: 'max_entry'})
    maxEntry: number;

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

    // TicketTypes
    @ManyToOne(
        () => TicketType,
        ticketType => ticketType.ticketTypeGates
    )
    @JoinColumn({ name: 'ticket_type_id' })
    ticketType: TicketType;

    // Gates
    @ManyToOne(
        () => Gate,
        gate => gate.ticketTypeGates
    )
    @JoinColumn({
        name: 'gate_id'
    })
    gate: Gate;
}

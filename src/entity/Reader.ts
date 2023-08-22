import { Entity, RelationId, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from "typeorm";
import { Gate } from "./Gate";

@Entity('reader')
export class Reader {

    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'gate_type' })
    gateType: string;
    
    @Column({ name: 'serial_number' })
    serialNumber: string;

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

    // Gates
    @ManyToOne(
        () => Gate,
        gate => gate.readers
    )
    // the foreign key is set automatically by using JoinColumn decorator
    @JoinColumn({ name: 'gate_id' })
    gate: Gate;
    @Column({ name: 'gate_id' })
    gateId: number;

    // @RelationId((reader: Reader) => reader.gate)
    // gateId: number; // Define the gateId property to access the ID of the associated Gate

    // @Column({ name: 'gate_id' })
    // gateId: number;

}
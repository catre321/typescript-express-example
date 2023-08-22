import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, Index } from "typeorm";
import { CustomerCardTicketType } from "./CustomerCardsTicketType";

@Entity('customer')
export class Customer {

    @PrimaryGeneratedColumn()
    id: number;

    @Index('Customer_name_idx')
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

    // CustomerCardsTicketType
    @OneToMany(
        () => CustomerCardTicketType,
        customerCardsTicketType => customerCardsTicketType.customer
    )
    customerCardsTicketTypes: CustomerCardTicketType[];
}
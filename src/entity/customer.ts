import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: "contact",
  engine: "InnoDB",
  database: 'quickbooks',
})
class Customer extends BaseEntity {
    
  @PrimaryGeneratedColumn("uuid")
  id: string

  @UpdateDateColumn()
  updatedDate: Date

  @CreateDateColumn()
  createdDate: Date

  @Column()
  qbo_sync_token: string

  @Column()
  name: string

  @Column()
  company: string
  
  @Column()
  email: string

  @Column()
  phone: string

  @Column()
  website: string

  @Column()
  active: string

  @Column()
  qbo_qualified_name: string

  @Column()
  qbo_customer_type: string

  @Column()
  notes: string

}

export default Customer
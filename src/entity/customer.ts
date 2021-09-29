import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity({
  name: "Customer",
  engine: "InnoDB",
  database: 'quickbooks',
})
class Customer extends BaseEntity {

  @PrimaryGeneratedColumn("uuid")
  uuid: string

  @UpdateDateColumn()
  updatedDate: Date

  @CreateDateColumn()
  createdDate: Date

  @Column()
  Balance: string

  @Column()
  CurrencyRef_value: string

  @Column()
  CurrencyRef_name: string

  @Column()
  Id: string

  @Column()
  SyncToken: string

  @Column()
  MetaData_CreateTime: string

  @Column()
  MetaData_LastUpdatedTime: string

  @Column()
  CompanyName: string

  @Column()
  DisplayName: string

  @Column()
  Active: string

  @Column()
  V4IDPseudonym: string

  @Column()
  PrimaryPhone_FreeFormNumber: string

  @Column()
  WebAddr_URI: string

  @Column()
  Notes: string

}

export default Customer
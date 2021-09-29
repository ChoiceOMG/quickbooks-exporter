import { EntityManager, getConnection } from 'typeorm';
import customer_record from '../entity/customer';
import { flattenObj } from "../helpers/flatten_object";
import { get_all_customers } from "./fetch_customers";

export const customer_sync = async () => {
  const connection = getConnection()
  const manager: EntityManager = connection.manager

  //const { totalCount } = await get_customer_count()
  

  const {Customer} = await get_all_customers(0,500)



  Customer.forEach(async (customer: any) => {
    let record = new customer_record()
    let customer_as_flat_object = flattenObj(customer)
    
    Object.assign(record, customer_as_flat_object)
    //console.log(record)
    manager.save(record)
      .catch((error) => error.message)
  })

}
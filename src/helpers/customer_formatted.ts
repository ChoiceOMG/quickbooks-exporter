const customer_formatted = (qboCustomer) => {
  return {
    id: qboCustomer.Id,
    updatedDate: qboCustomer.MetaData.LastUpdatedTime,
    createdDate: qboCustomer.MetaData.CreateTime,
    qbo_sync_token: qboCustomer.SyncToken,
    name: qboCustomer.DisplayName,
    company: qboCustomer.CompanyName,
    email: qboCustomer.PrimaryEmailAddr.Address,
    phone: qboCustomer.PrimaryPhone.FreeFormNumber,
    website: qboCustomer.WebAddr.URI,     
    active: qboCustomer.Active,
    qbo_qualified_name: qboCustomer.FullyQualifiedName,
    qbo_customer_type: qboCustomer.CustomerTypeRef.value,    
    notes: qboCustomer.Notes
  }
}

export default customer_formatted
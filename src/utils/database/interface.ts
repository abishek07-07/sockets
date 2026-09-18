export interface Users {

  id: number,
  username : string ,
  email: string,
  password: string,
  roles : Roles
  uid : string
}


export enum Roles  {

  CUSTOMER = "customer",
  ADMIN = 'admin',
  STORES = "stores",
  DRIVERS= "driver"

}

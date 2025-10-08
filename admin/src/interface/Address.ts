export interface Address {
  _id: string;
  name: string;
  image: string | string[];
  address: string;
  addressLink: string;

}

export interface CustomerAddress {
  _id: string;
  name: string;
  isDefault: boolean;
}
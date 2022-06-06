import { District, Municipality, Place } from "./location.model";

export interface UngulateOwner {
  id?: number,
  name: string,
  surname: string,
  companyName: string,
  identificationNumber: string,
  companyIdentificationNumber: string,
  passport: string,
  address: string,
  phone: string,
  district: District,
  municipality: Municipality,
  place: Place,
  active: boolean,
  createdAt?: string,
}

export interface UngulateOwnerFilterOptions {
  name?: string,
  surname?: string,
  passport?: string,
  identificationNumber?: string
  companyName?: string,
  companyIdentificationNumber?: string
}
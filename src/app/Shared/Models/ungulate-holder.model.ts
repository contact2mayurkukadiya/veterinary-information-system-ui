import { Municipality, Place } from './location.model';

export interface UngulateHolder {
  id?: number,
  hid: string,
  name: string,
  surname: string,
  identificationNumber: string,
  address: string,
  phone: string,
  district: {
    id: string,
    name: string
  },
  municipality: Municipality,
  place: Place,
  farmType: {
    active: boolean,
    createdAt: string,
    id: number,
    name: string
  },
  active: boolean,
  createdAt?: string,
}

export interface UngulateHolderFilterOptions {
  hid?: string,
  name?: string,
  surname?: string,
  identificationNumber?: string
}
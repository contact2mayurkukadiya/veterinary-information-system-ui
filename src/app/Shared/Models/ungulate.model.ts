import {UngulateOwner} from './ungulate-owner.model';
import {UngulatePutpose} from './ungulate-purpose.model';
import {UngulateRace} from './ungulate-race.model';
import {UngulateHolder} from './ungulate-holder.model';
import {Country} from './location.model';

export interface Ungulate {
  id?: number | string;
  microchipId: string;
  name: string;
  chippingDate?: string;
  microchippingDate?: string;
  ueln: string;
  motherName: string;
  motherMicrochipId: string;
  fatherName: string;
  fatherMicrochipId: string;
  countryOfBirth: Country;
  countryOfOrigin: Country;
  dateOfBirth: string;
  hairColorAndLabel: string;
  gender?: string;
  sex?: string;
  feiNumber: string;
  feiName: string;
  ungulateRace: UngulateRace;
  ungulatePurpose: UngulatePutpose;
  ungulateOwner: UngulateOwner;
  ungulateHolder: UngulateHolder;
  foodChain: boolean;
  passport: string;
  passportCountry: Country;
  passportIssuedBy: string;
  passportDate: string;
  veterinarianId: string;
  ungulateImages: Array<any>;
  active: boolean;
}

export interface UngulateFilterOptions {
  microchipId?: string;
  chippingDate?: string;
  microchippingDate?: string;
  ueln?: string;
  name?: string;
  countryOfBirth?: Country;
  countryOfOrigin?: Country;
  ungulateRace?: UngulateRace;
  passport?: string;
}

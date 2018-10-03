import { EduNetInterface } from './EduNet.interface';
import { LicenseInterface } from './License.interface';
import { MethodInterface } from './Method.interface';
import { ProductContentInterface } from './ProductContent.interface';
import { ProductLicenseCarrierInterface } from './ProductLicenseCarrier.interface';
import { RoleInterface } from './Role.interface';
import { YearInterface } from './Year.interface';

export interface ProductInterface {
  name: string;
  priceInclusive?: number;
  vat?: number;
  stockNumber: string;
  id?: number;
  allowedRoles?: RoleInterface[];
  productContents?: ProductContentInterface[];
  licenseCarriers?: ProductLicenseCarrierInterface[];
  methods?: MethodInterface[];
  licenses?: LicenseInterface[];
  nets?: EduNetInterface[];
  years?: YearInterface[];
}

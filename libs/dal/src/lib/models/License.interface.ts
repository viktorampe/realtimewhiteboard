import { PersonInterface } from './Person.interface';
import { ProductInterface } from './Product.interface';
import { ProductLicenseCarrierInterface } from './ProductLicenseCarrier.interface';
import { PurchaseInterface } from './Purchase.interface';

export interface LicenseInterface {
  code: string;
  created: Date;
  activated?: Date;
  redeemed?: Date;
  expired?: Date;
  duration?: number;
  id?: number;
  personId?: number;
  productId?: number;
  carrierId?: number;
  purchaseId?: number;
  person?: PersonInterface;
  product?: ProductInterface;
  carrier?: ProductLicenseCarrierInterface;
  purchase?: PurchaseInterface;
}

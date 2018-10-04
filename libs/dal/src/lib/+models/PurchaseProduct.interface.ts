import { ProductInterface } from './Product.interface';
import { ProductLicenseCarrierInterface } from './ProductLicenseCarrier.interface';
import { PurchaseInterface } from './Purchase.interface';

export interface PurchaseProductInterface {
  activated?: Date;
  expired?: Date;
  duration?: number;
  amountOfLicenses?: number;
  id?: number;
  productId?: number;
  carrierId?: number;
  purchaseId?: number;
  product?: ProductInterface;
  carrier?: ProductLicenseCarrierInterface;
  purchase?: PurchaseInterface;
}

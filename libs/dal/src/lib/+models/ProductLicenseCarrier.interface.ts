import { LicenseInterface } from './License.interface';
import { ProductInterface } from './Product.interface';

export interface ProductLicenseCarrierInterface {
  articleNumber?: string;
  description: string;
  id?: number;
  productId?: number;
  product?: ProductInterface;
  licenses?: LicenseInterface[];
}

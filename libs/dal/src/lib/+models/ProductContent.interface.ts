import { EduContentInterface } from './EduContent.interface';
import { MethodInterface } from './Method.interface';
import { ProductInterface } from './Product.interface';

export interface ProductContentInterface {
  licenseType?: string;
  id?: number;
  productId?: number;
  methodId?: number;
  eduContentId?: number;
  product?: ProductInterface;
  method?: MethodInterface;
  eduContent?: EduContentInterface;
}

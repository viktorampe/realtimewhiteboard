import { ProductInterface } from './Product.interface';
import { RoleInterface } from './Role.interface';

export interface ProductRoleInterface {
  id?: number;
  productId?: number;
  roleId?: number;
  product?: ProductInterface;
  role?: RoleInterface;
}

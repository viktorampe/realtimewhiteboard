import { LicenseInterface } from './License.interface';
import { PersonInterface } from './Person.interface';
import { ProductInterface } from './Product.interface';
import { PurchaseAddressInterface } from './PurchaseAddress.interface';
import { PurchaseDiscountInterface } from './PurchaseDiscount.interface';
import { PurchaseProductInterface } from './PurchaseProduct.interface';
import { SchoolInterface } from './School.interface';

export interface PurchaseInterface {
  reference: string;
  amount: number;
  created: Date;
  updated?: Date;
  paymentClusterStatus?: string;
  paymentClusterKey?: string;
  paid: boolean;
  invoice: boolean;
  email?: string;
  mode: string;
  customerOrderReference?: string;
  comment?: string;
  atlasInvoiceReference?: string;
  atlasCustomerReference?: string;
  id?: number;
  personId?: number;
  discountId?: number;
  schoolId?: number;
  buyerAddressId?: number;
  invoiceAddressId?: number;
  licenses?: LicenseInterface[];
  person?: PersonInterface;
  products?: ProductInterface[];
  purchaseProducts?: PurchaseProductInterface[];
  discount?: PurchaseDiscountInterface;
  school?: SchoolInterface;
  buyerAddress?: PurchaseAddressInterface;
  invoiceAddress?: PurchaseAddressInterface;
}

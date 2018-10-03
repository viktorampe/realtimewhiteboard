import { BundleInterface } from './Bundle.interface';
import { PersonInterface } from './Person.interface';

export interface BundlePersonInterface {
  id?: number;
  bundleId?: number;
  personId?: number;
  bundle?: BundleInterface;
  person?: PersonInterface;
}

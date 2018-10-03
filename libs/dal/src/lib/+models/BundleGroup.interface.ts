import { BundleInterface } from './Bundle.interface';
import { GroupInterface } from './Group.interface';

export interface BundleGroupInterface {
  id?: number;
  bundleId?: number;
  groupId?: number;
  bundle?: BundleInterface;
  group?: GroupInterface;
}

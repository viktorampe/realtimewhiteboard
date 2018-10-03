import { BundleInterface } from './Bundle.interface';
import { BundleGroupInterface } from './BundleGroup.interface';
import { GroupPersonInterface } from './GroupPerson.interface';
import { PersonInterface } from './Person.interface';
import { SchoolAddressInterface } from './SchoolAddress.interface';
import { TaskInterface } from './Task.interface';
import { TaskGroupInterface } from './TaskGroup.interface';
import { UnlockedBoekeGroupInterface } from './UnlockedBoekeGroup.interface';
import { UnlockedContentInterface } from './UnlockedContent.interface';
import { UnlockedContentGroupInterface } from './UnlockedContentGroup.interface';

export interface GroupInterface {
  name: string;
  provider?: string;
  id?: number;
  teacherId?: number;
  schoolAddressId?: number;
  smartschoolGroupId?: string;
  smartschoolTeacherId?: string;
  synced?: boolean;
  teacher?: PersonInterface;
  schoolAddress?: SchoolAddressInterface;
  unlockedBoekeGroups?: UnlockedBoekeGroupInterface[];
  unlockedContents?: UnlockedContentInterface[];
  unlockedContentGroups?: UnlockedContentGroupInterface[];
  tasks?: TaskInterface[];
  taskGroups?: TaskGroupInterface[];
  people?: PersonInterface[];
  groupMembers?: GroupPersonInterface[];
  bundles?: BundleInterface[];
  bundleGroups?: BundleGroupInterface[];
}

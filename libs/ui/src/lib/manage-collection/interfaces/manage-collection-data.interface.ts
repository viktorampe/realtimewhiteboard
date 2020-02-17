import { ManageCollectionItemInterface } from './manage-collection-item.interface';

export interface ManageCollectionsDataInterface {
  title: string;
  subtitle?: string;
  item: ManageCollectionItemInterface;
  linkableItems: ManageCollectionItemInterface[];
  linkedItemIds: Set<number>;
  recentItemIds: Set<number>;
  useFilter?: boolean;
  asModalSideSheet?: boolean;
}

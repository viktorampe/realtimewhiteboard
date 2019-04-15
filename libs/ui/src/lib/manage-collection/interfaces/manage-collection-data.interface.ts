import { ManageCollectionItemInterface } from '../manage-collection.component';

export interface ManageCollectionsDataInterface {
  title: string;
  item: ManageCollectionItemInterface;
  linkableItems: ManageCollectionItemInterface[];
  linkedItemIds: Set<number>;
  recentItemIds: Set<number>;
}

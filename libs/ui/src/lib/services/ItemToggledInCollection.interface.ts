import { ManageCollectionItemInterface } from '../manage-collection/interfaces/ManageCollectionItem.interface';

export interface ItemToggledInCollectionInterface {
  relatedItem: ManageCollectionItemInterface;
  item: ManageCollectionItemInterface;
  selected: boolean;
}

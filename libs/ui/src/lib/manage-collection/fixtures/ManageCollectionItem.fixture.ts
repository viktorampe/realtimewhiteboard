import { ManageCollectionItemInterface } from '../interfaces/ManageCollectionItem.interface';

export class ManageCollectionItemFixture
  implements ManageCollectionItemInterface {
  icon? = 'foo-icon';
  label = 'bar';
  id = 1;
  className?: string;

  constructor(props: Partial<ManageCollectionItemInterface> = {}) {
    Object.assign(this, props);
  }
}

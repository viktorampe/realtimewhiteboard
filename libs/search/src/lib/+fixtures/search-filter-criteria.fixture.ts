import {
  SearchFilterCriteriaInterface,
  SearchFilterCriteriaValuesInterface
} from '../interfaces';

export class SearchFilterCriteriaFixture
  implements SearchFilterCriteriaInterface {
  // defaults
  name = 'foo';
  label = 'foo';
  keyProperty = 'id';
  displayProperty = 'name';
  values: SearchFilterCriteriaValuesInterface[];

  constructor(
    props: Partial<SearchFilterCriteriaInterface> = {},
    values: SearchFilterCriteriaValuesInterface[] = []
  ) {
    // overwrite defaults
    Object.assign(this, props);
    this.values = values;
  }
}

export class SearchFilterCriteriaValuesFixture
  implements SearchFilterCriteriaValuesInterface {
  // defaults
  data = {
    id: 1,
    name: 'bar'
  };
  selected = false;
  prediction = 5;
  visible = true;
  child = null;

  constructor(
    props: Partial<SearchFilterCriteriaValuesInterface> = {},
    child: SearchFilterCriteriaInterface = null
  ) {
    // overwrite defaults
    Object.assign(this, props);
    if (child) {
      Object.assign(this.child, child);
    }
  }
}

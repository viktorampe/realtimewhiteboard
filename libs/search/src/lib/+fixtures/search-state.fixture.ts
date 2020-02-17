import { SearchStateInterface } from '../interfaces';

export class SearchStateFixture implements SearchStateInterface {
  searchTerm = '';
  filterCriteriaSelections = new Map<string, (number | string)[]>();
  filterCriteriaOptions = new Map<string, number | string | boolean>();

  constructor(props?: Partial<SearchStateInterface>) {
    Object.assign(this, props);
  }
}

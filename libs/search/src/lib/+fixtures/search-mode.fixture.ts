import { SearchModeInterface } from '../interfaces';
import { FilterFactoryFixture } from './filter-factory.fixture';

export class SearchModeFixture implements SearchModeInterface {
  name = 'demo';
  label = 'demo';
  dynamicFilters = false;
  searchFilterFactory = FilterFactoryFixture;
  searchTerm = {
    // autocompleteEl: string; //reference to material autocomplete component
    domHost: 'hostSearchTerm'
  };
  results = {
    component: null,
    sortModes: [],
    pageSize: 3
  };

  constructor(props?: Partial<SearchModeInterface>) {
    Object.assign(this, props);
  }
}

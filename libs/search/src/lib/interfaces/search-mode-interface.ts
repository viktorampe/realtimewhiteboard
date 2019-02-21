export interface SearchModeInterface {
  name: string;
  label: string;
  dynamicFilters: boolean;
  searchFilterFactory: [];
  searchTerm?: {
    autocompleteEl?: string; //reference to material autocomplete component
    domHost: string;
  };
  results: {
    sortModes: SortModeInterface[];
    pageSize: number;
  };
}

export interface SortModeInterface {
  name: string;
  description: string;
  icon: string;
}

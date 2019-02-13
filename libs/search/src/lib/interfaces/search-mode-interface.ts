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
    sortModes: {
      name: string;
      description: string;
      icon: string;
    }[];
    pageSize: number;
  };
}

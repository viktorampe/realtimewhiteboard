import { Type } from '@angular/core';
import { SearchFilterComponentInterface } from '@campus/search';
import { MemoizedSelector, MemoizedSelectorWithProps } from '@ngrx/store';

//Small interface used just here to simplify making filters for the non-special properties
export interface FilterQueryInterface {
  query?:
    | MemoizedSelector<object, any[]>
    | MemoizedSelectorWithProps<object, any, any[]>;
  name: string;
  label: string;
  component?: Type<SearchFilterComponentInterface>;
  displayProperty?: string;
  domHost?: string;
  options?: any;

  // are the filter values dependent on a filterCriteriaSelection value?
  // this will add a prop to the store select -> use a selector that takes a prop
  // Important! At the moment, the filter can only be dependent on 1 thing
  // see buildFilter()
  learningAreaDependent?: boolean;
  methodDependent?: boolean;
}

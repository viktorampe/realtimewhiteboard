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
  learningAreaDependent?: boolean;
  domHost?: string;
  options?: any;
}

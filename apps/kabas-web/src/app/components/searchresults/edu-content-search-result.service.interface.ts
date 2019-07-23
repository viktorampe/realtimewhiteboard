import { InjectionToken } from '@angular/core';
import { EduContent } from '@campus/dal';
import {
  searchResultActionDictionary,
  SearchResultActionInterface
} from './edu-content-search-result.service';

export const EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN = new InjectionToken(
  'EduContentSearchResultItemService'
);

export const EDUCONTENT_SEARCH_RESULT_ACTION_DICTIONARY_TOKEN = new InjectionToken<{
  [key: string]: SearchResultActionInterface;
}>('SearchResultActionDictionary', {
  factory: () => searchResultActionDictionary
});

export interface EduContentSearchResultItemServiceInterface {
  getActionsForEduContent(
    eduContent: EduContent
  ): SearchResultActionInterface[];
}

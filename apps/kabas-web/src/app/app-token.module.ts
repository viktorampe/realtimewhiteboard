import { NgModule } from '@angular/core';
import {
  AuthService,
  AUTH_SERVICE_TOKEN,
  EduContentService,
  EDU_CONTENT_SERVICE_TOKEN
} from '@campus/dal';
import { EduContentSearchResultItemService } from './components/searchresults/edu-content-search-result.service';
import { EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN } from './components/searchresults/edu-content-search-result.service.interface';

@NgModule({
  providers: [
    //app level services
    {
      provide: EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN,
      useClass: EduContentSearchResultItemService
    },

    // dal services
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthService },
    { provide: EDU_CONTENT_SERVICE_TOKEN, useClass: EduContentService }
  ]
})
export class AppTokenModule {}

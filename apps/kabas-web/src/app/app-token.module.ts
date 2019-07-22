import { NgModule } from '@angular/core';
import {
  AuthService,
  AUTH_SERVICE_TOKEN,
  DiaboloPhaseService,
  DIABOLO_PHASE_SERVICE_TOKEN,
  EduContentProductTypeService,
  EduContentService,
  EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
  EDU_CONTENT_SERVICE_TOKEN,
  PersonService,
  PERSON_SERVICE_TOKEN,
  TocService,
  TOC_SERVICE_TOKEN
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
    { provide: TOC_SERVICE_TOKEN, useClass: TocService },
    { provide: PERSON_SERVICE_TOKEN, useClass: PersonService },
    { provide: DIABOLO_PHASE_SERVICE_TOKEN, useClass: DiaboloPhaseService },
    { provide: EDU_CONTENT_SERVICE_TOKEN, useClass: EduContentService },
    {
      provide: EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
      useClass: EduContentProductTypeService
    }
  ]
})
export class AppTokenModule {}

import { NgModule } from '@angular/core';
import {
  AlertService,
  ALERT_SERVICE_TOKEN,
  AuthService,
  AUTH_SERVICE_TOKEN,
  BundleService,
  BUNDLE_SERVICE_TOKEN,
  ContentRequestService,
  CONTENT_REQUEST_SERVICE_TOKEN,
  CredentialService,
  CREDENTIAL_SERVICE_TOKEN,
  DiaboloPhaseService,
  DIABOLO_PHASE_SERVICE_TOKEN,
  EduContentProductTypeService,
  EduContentService,
  EduNetService,
  EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
  EDU_CONTENT_SERVICE_TOKEN,
  EDU_NET_SERVICE_TOKEN,
  ExerciseService,
  EXERCISE_SERVICE_TOKEN,
  FavoriteService,
  FAVORITE_SERVICE_TOKEN,
  HistoryService,
  HISTORY_SERVICE_TOKEN,
  LearningAreaService,
  LEARNINGAREA_SERVICE_TOKEN,
  LearningDomainService,
  LearningPlanService,
  LEARNING_DOMAIN_SERVICE_TOKEN,
  LEARNING_PLAN_SERVICE_TOKEN,
  LinkedPersonService,
  LINKED_PERSON_SERVICE_TOKEN,
  MethodService,
  METHOD_SERVICE_TOKEN,
  PersonService,
  PERSON_SERVICE_TOKEN,
  ResultsService,
  RESULTS_SERVICE_TOKEN,
  SchoolTypeService,
  SCHOOL_TYPE_SERVICE_TOKEN,
  StudentContentStatusService,
  STUDENT_CONTENT_STATUS_SERVICE_TOKEN,
  TaskEduContentService,
  TaskInstanceService,
  TaskService,
  TASK_EDU_CONTENT_SERVICE_TOKEN,
  TASK_INSTANCE_SERVICE_TOKEN,
  TASK_SERVICE_TOKEN,
  TocService,
  TOC_SERVICE_TOKEN,
  UndoService,
  UNDO_SERVICE_TOKEN,
  UnlockedBoekeGroupService,
  UnlockedBoekeStudentService,
  UnlockedContentService,
  UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN,
  UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN,
  UNLOCKED_CONTENT_SERVICE_TOKEN,
  UserContentService,
  USER_CONTENT_SERVICE_TOKEN,
  YearService,
  YEAR_SERVICE_TOKEN
} from '@campus/dal';
import { ScormApiService, SCORM_API_SERVICE_TOKEN } from '@campus/scorm';
import {
  APP_NAVIGATION_TREE_TOKEN,
  NavigationItemService,
  NAVIGATION_ITEM_SERVICE_TOKEN
} from '@campus/shared';
import { polpoConfig } from './app.config';
import { EduContentSearchResultItemService } from './components/searchresults/edu-content-search-result.service';
import { EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN } from './components/searchresults/edu-content-search-result.service.interface';
import {
  SearchTermFilterFactory,
  SEARCH_TERM_FILTER_FACTORY_TOKEN
} from './factories/search-term-filter/search-term-filter.factory';
import { FavIconService, FAVICON_SERVICE_TOKEN } from './services/favicons';

@NgModule({
  providers: [
    //app level services
    {
      provide: FAVICON_SERVICE_TOKEN,
      useClass: FavIconService
    },
    {
      provide: SEARCH_TERM_FILTER_FACTORY_TOKEN,
      useClass: SearchTermFilterFactory
    },
    {
      provide: EDUCONTENT_SEARCH_RESULT_ITEM_SERVICE_TOKEN,
      useClass: EduContentSearchResultItemService
    },
    {
      provide: NAVIGATION_ITEM_SERVICE_TOKEN,
      useClass: NavigationItemService
    },
    { provide: APP_NAVIGATION_TREE_TOKEN, useValue: polpoConfig.appNavtree },
    { provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService },

    // dal services
    { provide: UNDO_SERVICE_TOKEN, useClass: UndoService },
    { provide: EXERCISE_SERVICE_TOKEN, useClass: ExerciseService },
    { provide: EDU_CONTENT_SERVICE_TOKEN, useClass: EduContentService },
    { provide: USER_CONTENT_SERVICE_TOKEN, useClass: UserContentService },
    {
      provide: UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN,
      useClass: UnlockedBoekeStudentService
    },
    {
      provide: UNLOCKED_CONTENT_SERVICE_TOKEN,
      useClass: UnlockedContentService
    },
    {
      provide: UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN,
      useClass: UnlockedBoekeGroupService
    },
    { provide: BUNDLE_SERVICE_TOKEN, useClass: BundleService },
    { provide: LEARNINGAREA_SERVICE_TOKEN, useClass: LearningAreaService },
    { provide: METHOD_SERVICE_TOKEN, useClass: MethodService },
    {
      provide: STUDENT_CONTENT_STATUS_SERVICE_TOKEN,
      useClass: StudentContentStatusService
    },
    {
      provide: ALERT_SERVICE_TOKEN,
      useClass: AlertService
    },
    { provide: PERSON_SERVICE_TOKEN, useClass: PersonService },
    { provide: LINKED_PERSON_SERVICE_TOKEN, useClass: LinkedPersonService },
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthService },
    { provide: TASK_SERVICE_TOKEN, useClass: TaskService },
    { provide: TASK_INSTANCE_SERVICE_TOKEN, useClass: TaskInstanceService },
    {
      provide: TASK_EDU_CONTENT_SERVICE_TOKEN,
      useClass: TaskEduContentService
    },
    { provide: CONTENT_REQUEST_SERVICE_TOKEN, useClass: ContentRequestService },
    { provide: RESULTS_SERVICE_TOKEN, useClass: ResultsService },
    { provide: CREDENTIAL_SERVICE_TOKEN, useClass: CredentialService },
    { provide: EDU_NET_SERVICE_TOKEN, useClass: EduNetService },
    {
      provide: EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
      useClass: EduContentProductTypeService
    },
    { provide: SCHOOL_TYPE_SERVICE_TOKEN, useClass: SchoolTypeService },
    { provide: YEAR_SERVICE_TOKEN, useClass: YearService },
    { provide: LEARNING_PLAN_SERVICE_TOKEN, useClass: LearningPlanService },
    { provide: FAVORITE_SERVICE_TOKEN, useClass: FavoriteService },
    { provide: TOC_SERVICE_TOKEN, useClass: TocService },
    { provide: LEARNING_DOMAIN_SERVICE_TOKEN, useClass: LearningDomainService },
    { provide: HISTORY_SERVICE_TOKEN, useClass: HistoryService },
    { provide: DIABOLO_PHASE_SERVICE_TOKEN, useClass: DiaboloPhaseService }
  ]
})
export class AppTokenModule {}

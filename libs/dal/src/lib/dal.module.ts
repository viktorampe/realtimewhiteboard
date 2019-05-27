import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Inject,
  InjectionToken,
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import {
  BrowserModule as CampusBrowserModule,
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageService
} from '@campus/browser';
import { ScormModule } from '@campus/scorm';
import {
  LoopBackConfig,
  SDKBrowserModule
} from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { v4 as uuid } from 'uuid';
import { AlertReducer, AlertsEffects } from './+state/alert';
import { BundleReducer, BundlesEffects } from './+state/bundle';
import { ContentStatusReducer } from './+state/content-status';
import { ContentStatusesEffects } from './+state/content-status/content-status.effects';
import { CredentialEffects, CredentialReducer } from './+state/credential';
import {
  CurrentExerciseEffects,
  CurrentExerciseReducer
} from './+state/current-exercise';
import { EduContentReducer, EduContentsEffects } from './+state/edu-content';
import {
  EduContentProductTypeEffects,
  EduContentProductTypeReducer
} from './+state/edu-content-product-type';
import { EduNetEffects, EduNetReducer } from './+state/edu-net';
import { EffectFeedbackReducer } from './+state/effect-feedback';
import { EffectFeedbackEffects } from './+state/effect-feedback/effect-feedback.effects';
import { FavoriteEffects, FavoriteReducer } from './+state/favorite';
import { HistoryEffects, HistoryReducer } from './+state/history';
import {
  LearningAreaReducer,
  LearningAreasEffects
} from './+state/learning-area';
import {
  LearningDomainEffects,
  LearningDomainReducer
} from './+state/learning-domain';
import {
  LinkedPersonEffects,
  LinkedPersonReducer
} from './+state/linked-person';
import { MethodEffects, MethodReducer } from './+state/method';
import { ResultEffects, ResultReducer } from './+state/result';
import { SchoolTypeEffects, SchoolTypeReducer } from './+state/school-type';
import {
  StudentContentStatusesEffects,
  StudentContentStatusReducer
} from './+state/student-content-status';
import { TaskEffects, TaskReducer } from './+state/task';
import {
  TaskEduContentEffects,
  TaskEduContentReducer
} from './+state/task-edu-content';
import {
  TaskInstanceEffects,
  TaskInstanceReducer
} from './+state/task-instance';
import {
  TeacherStudentEffects,
  TeacherStudentReducer
} from './+state/teacher-student';
import { UiEffects, UiReducer } from './+state/ui';
import {
  UnlockedBoekeGroupReducer,
  UnlockedBoekeGroupsEffects
} from './+state/unlocked-boeke-group';
import {
  UnlockedBoekeStudentReducer,
  UnlockedBoekeStudentsEffects
} from './+state/unlocked-boeke-student';
import {
  UnlockedContentReducer,
  UnlockedContentsEffects
} from './+state/unlocked-content';
import { UserEffects, UserReducer } from './+state/user';
import { UserContentReducer, UserContentsEffects } from './+state/user-content';
import { YearEffects, YearReducer } from './+state/year';
import { AlertService } from './alert/alert.service';
import { ALERT_SERVICE_TOKEN } from './alert/alert.service.interface';
import {
  UnlockedBoekeGroupService,
  UnlockedBoekeStudentService,
  UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN,
  UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN
} from './boeke';
import {
  BundleService,
  BUNDLE_SERVICE_TOKEN,
  UnlockedContentService,
  UNLOCKED_CONTENT_SERVICE_TOKEN,
  UserContentService,
  USER_CONTENT_SERVICE_TOKEN
} from './bundle';
import { ContentRequestService } from './content-request/content-request.service';
import { CONTENT_REQUEST_SERVICE_TOKEN } from './content-request/content-request.service.interface';
import { EduContentService } from './edu-content/edu-content.service';
import { EDU_CONTENT_SERVICE_TOKEN } from './edu-content/edu-content.service.interface';
import { ExerciseService } from './exercise/exercise.service';
import { EXERCISE_SERVICE_TOKEN } from './exercise/exercise.service.interface';
import { FavoriteService } from './favorite/favorite.service';
import { FAVORITE_SERVICE_TOKEN } from './favorite/favorite.service.interface';
import { HistoryService } from './history/history.service';
import { HISTORY_SERVICE_TOKEN } from './history/history.service.interface';
import { LearningAreaService } from './learning-area/learning-area.service';
import { LEARNINGAREA_SERVICE_TOKEN } from './learning-area/learning-area.service.interface';
import { LearningPlanService } from './learning-plan/learning-plan.service';
import { LEARNING_PLAN_SERVICE_TOKEN } from './learning-plan/learning-plan.service.interface';
import { EduContentProductTypeService } from './metadata/edu-content-product-type.service';
import { EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN } from './metadata/edu-content-product-type.service.interface';
import { EduNetService } from './metadata/edu-net.service';
import { EDU_NET_SERVICE_TOKEN } from './metadata/edu-net.service.interface';
import { LearningDomainService } from './metadata/learning-domain.service';
import { LEARNING_DOMAIN_SERVICE_TOKEN } from './metadata/learning-domain.service.interface';
import { MethodService } from './metadata/method.service';
import { METHOD_SERVICE_TOKEN } from './metadata/method.service.interface';
import { SchoolTypeService } from './metadata/school-type.service';
import { SCHOOL_TYPE_SERVICE_TOKEN } from './metadata/school-type.service.interface';
import { YearService } from './metadata/year.service';
import { YEAR_SERVICE_TOKEN } from './metadata/year.service.interface';
import { AuthService } from './persons/auth-service';
import { AUTH_SERVICE_TOKEN } from './persons/auth-service.interface';
import {
  CredentialService,
  CREDENTIAL_SERVICE_TOKEN
} from './persons/credential.service';
import {
  LinkedPersonService,
  LINKED_PERSON_SERVICE_TOKEN
} from './persons/linked-persons.service';
import { PersonService, PERSON_SERVICE_TOKEN } from './persons/persons.service';
import { ResultsService } from './results/results.service';
import { RESULTS_SERVICE_TOKEN } from './results/results.service.interface';
import { StudentContentStatusService } from './student-content-status/student-content-status.service';
import { STUDENT_CONTENT_STATUS_SERVICE_TOKEN } from './student-content-status/student-content-status.service.interface';
import { TaskEduContentService } from './tasks/task-edu-content.service';
import { TASK_EDU_CONTENT_SERVICE_TOKEN } from './tasks/task-edu-content.service.interface';
import { TaskInstanceService } from './tasks/task-instance.service';
import { TASK_INSTANCE_SERVICE_TOKEN } from './tasks/task-instance.service.interface';
import { TASK_SERVICE_TOKEN } from './tasks/task.service.interface';
import { TaskService } from './tasks/tasks.service';
import { TocService } from './toc/toc.service';
import { TOC_SERVICE_TOKEN } from './toc/toc.service.interface';
import { UndoService } from './undo/undo.service';
import { UNDO_SERVICE_TOKEN } from './undo/undo.service.interface';

interface DalOptions {
  apiBaseUrl: string;
}
export const DAL_OPTIONS = new InjectionToken('dal-options');

@NgModule({
  imports: [
    CampusBrowserModule,
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    ScormModule,
    MatSnackBarModule,
    StoreModule.forFeature(
      LearningAreaReducer.NAME,
      LearningAreaReducer.reducer,
      { initialState: LearningAreaReducer.initialState }
    ),
    StoreModule.forFeature(
      LearningDomainReducer.NAME,
      LearningDomainReducer.reducer,
      { initialState: LearningDomainReducer.initialState }
    ),
    StoreModule.forFeature(MethodReducer.NAME, MethodReducer.reducer, {
      initialState: MethodReducer.initialState
    }),
    StoreModule.forFeature(
      UserContentReducer.NAME,
      UserContentReducer.reducer,
      { initialState: UserContentReducer.initialState }
    ),
    StoreModule.forFeature(
      UnlockedContentReducer.NAME,
      UnlockedContentReducer.reducer,
      { initialState: UnlockedContentReducer.initialState }
    ),
    StoreModule.forFeature(
      StudentContentStatusReducer.NAME,
      StudentContentStatusReducer.reducer,
      { initialState: StudentContentStatusReducer.initialState }
    ),
    StoreModule.forFeature(EduContentReducer.NAME, EduContentReducer.reducer, {
      initialState: EduContentReducer.initialState
    }),
    StoreModule.forFeature(BundleReducer.NAME, BundleReducer.reducer, {
      initialState: BundleReducer.initialState
    }),
    StoreModule.forFeature(UiReducer.NAME, UiReducer.reducer, {
      initialState: UiReducer.initialState
    }),
    StoreModule.forFeature(
      UnlockedBoekeGroupReducer.NAME,
      UnlockedBoekeGroupReducer.reducer,
      { initialState: UnlockedBoekeGroupReducer.initialState }
    ),
    StoreModule.forFeature(
      UnlockedBoekeStudentReducer.NAME,
      UnlockedBoekeStudentReducer.reducer,
      { initialState: UnlockedBoekeStudentReducer.initialState }
    ),
    StoreModule.forFeature(
      ContentStatusReducer.NAME,
      ContentStatusReducer.reducer,
      { initialState: ContentStatusReducer.initialState }
    ),
    StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer, {
      initialState: UserReducer.initialState
    }),
    StoreModule.forFeature(TaskReducer.NAME, TaskReducer.reducer, {
      initialState: TaskReducer.initialState
    }),
    StoreModule.forFeature(AlertReducer.NAME, AlertReducer.reducer, {
      initialState: AlertReducer.initialState
    }),
    StoreModule.forFeature(
      TaskInstanceReducer.NAME,
      TaskInstanceReducer.reducer,
      { initialState: TaskInstanceReducer.initialState }
    ),
    StoreModule.forFeature(
      TaskEduContentReducer.NAME,
      TaskEduContentReducer.reducer,
      { initialState: TaskEduContentReducer.initialState }
    ),
    StoreModule.forFeature(ResultReducer.NAME, ResultReducer.reducer, {
      initialState: ResultReducer.initialState
    }),
    StoreModule.forFeature(
      CurrentExerciseReducer.NAME,
      CurrentExerciseReducer.reducer,
      { initialState: CurrentExerciseReducer.initialState }
    ),
    StoreModule.forFeature(
      TeacherStudentReducer.NAME,
      TeacherStudentReducer.reducer,
      { initialState: TeacherStudentReducer.initialState }
    ),
    StoreModule.forFeature(
      LinkedPersonReducer.NAME,
      LinkedPersonReducer.reducer,
      { initialState: LinkedPersonReducer.initialState }
    ),
    StoreModule.forFeature(CredentialReducer.NAME, CredentialReducer.reducer, {
      initialState: CredentialReducer.initialState
    }),
    StoreModule.forFeature(
      EffectFeedbackReducer.NAME,
      EffectFeedbackReducer.reducer,
      { initialState: EffectFeedbackReducer.initialState }
    ),
    StoreModule.forFeature(FavoriteReducer.NAME, FavoriteReducer.reducer, {
      initialState: FavoriteReducer.initialState
    }),
    StoreModule.forFeature(HistoryReducer.NAME, HistoryReducer.reducer, {
      initialState: HistoryReducer.initialState
    }),
    StoreModule.forFeature(
      EduContentProductTypeReducer.NAME,
      EduContentProductTypeReducer.reducer,
      { initialState: EduContentProductTypeReducer.initialState }
    ),
    StoreModule.forFeature(EduNetReducer.NAME, EduNetReducer.reducer, {
      initialState: EduNetReducer.initialState
    }),
    StoreModule.forFeature(SchoolTypeReducer.NAME, SchoolTypeReducer.reducer, {
      initialState: SchoolTypeReducer.initialState
    }),
    StoreModule.forFeature(YearReducer.NAME, YearReducer.reducer, {
      initialState: YearReducer.initialState
    }),
    EffectsModule.forFeature([
      EffectFeedbackEffects,
      BundlesEffects,
      UserEffects,
      EduContentsEffects,
      UiEffects,
      LearningAreasEffects,
      MethodEffects,
      UserContentsEffects,
      StudentContentStatusesEffects,
      UnlockedBoekeGroupsEffects,
      UnlockedContentsEffects,
      UnlockedBoekeStudentsEffects,
      ContentStatusesEffects,
      TaskEffects,
      TaskInstanceEffects,
      AlertsEffects,
      TaskEduContentEffects,
      ResultEffects,
      LearningDomainEffects,
      CurrentExerciseEffects,
      TeacherStudentEffects,
      LinkedPersonEffects,
      CredentialEffects,
      FavoriteEffects,
      HistoryEffects,
      EduContentProductTypeEffects,
      EduNetEffects,
      SchoolTypeEffects,
      YearEffects
    ])
  ],
  providers: [
    {
      provide: 'uuid',
      useValue: uuid
    },
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
    { provide: BROWSER_STORAGE_SERVICE_TOKEN, useClass: StorageService },
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
    { provide: HISTORY_SERVICE_TOKEN, useClass: HistoryService }
  ]
})
export class DalModule {
  constructor(@Inject(DAL_OPTIONS) options) {
    LoopBackConfig.setBaseURL(options.apiBaseUrl);
    LoopBackConfig.setRequestOptionsCredentials(true);
  }
  static forRoot(options: DalOptions): ModuleWithProviders {
    return {
      ngModule: DalModule,
      providers: [
        {
          provide: DAL_OPTIONS,
          useValue: options
        }
      ]
    };
  }
}

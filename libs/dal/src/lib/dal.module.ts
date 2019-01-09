import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { AlertReducer, AlertsEffects } from './+state/alert';
import { BundleReducer, BundlesEffects } from './+state/bundle';
import { ContentStatusReducer } from './+state/content-status';
import { ContentStatusesEffects } from './+state/content-status/content-status.effects';
import { CredentialReducer } from './+state/credential';
import { CredentialEffects } from './+state/credential/credential.effects';
import {
  CurrentExerciseEffects,
  CurrentExerciseReducer
} from './+state/current-exercise';
import { getStoreModuleForFeatures } from './+state/dal.state.feature.builder';
import { EduContentReducer, EduContentsEffects } from './+state/edu-content';
import {
  LearningAreaReducer,
  LearningAreasEffects
} from './+state/learning-area';
import {
  LinkedPersonEffects,
  LinkedPersonReducer
} from './+state/linked-person';
import { PersonEffects, PersonReducer } from './+state/person';
import { ResultReducer } from './+state/result';
import { ResultEffects } from './+state/result/result.effects';
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
import { EDUCONTENT_SERVICE_TOKEN } from './edu-content/edu-content.service.interface';
import { ExerciseService } from './exercise/exercise.service';
import { EXERCISE_SERVICE_TOKEN } from './exercise/exercise.service.interface';
import { LearningAreaService } from './learning-area/learning-area.service';
import { LEARNINGAREA_SERVICE_TOKEN } from './learning-area/learning-area.service.interface';
import { AuthService } from './persons/auth-service';
import { AUTH_SERVICE_TOKEN } from './persons/auth-service.interface';
import {
  CredentialService,
  CREDENTIAL_SERVICE_TOKEN
} from './persons/credentials.service';
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

interface DalOptions {
  apiBaseUrl: string;
}

@NgModule({
  imports: [
    CampusBrowserModule,
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    ScormModule,
    ...getStoreModuleForFeatures([
      LearningAreaReducer,
      UserContentReducer,
      UnlockedContentReducer,
      StudentContentStatusReducer,
      EduContentReducer,
      BundleReducer,
      UiReducer,
      UnlockedBoekeGroupReducer,
      UnlockedBoekeStudentReducer,
      ContentStatusReducer,
      UserReducer,
      TaskReducer,
      AlertReducer,
      TaskInstanceReducer,
      TaskEduContentReducer,
      ResultReducer,
      CurrentExerciseReducer,
      LinkedPersonReducer,
      PersonReducer,
      CredentialReducer
    ]),
    EffectsModule.forFeature([
      BundlesEffects,
      UserEffects,
      EduContentsEffects,
      UiEffects,
      LearningAreasEffects,
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
      CurrentExerciseEffects,
      LinkedPersonEffects,
      PersonEffects,
      CredentialEffects
    ])
  ],
  providers: [
    { provide: EXERCISE_SERVICE_TOKEN, useClass: ExerciseService },
    { provide: EDUCONTENT_SERVICE_TOKEN, useClass: EduContentService },
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
    { provide: CREDENTIAL_SERVICE_TOKEN, useClass: CredentialService }
  ]
})
export class DalModule {
  constructor() {}
  static forRoot(options: DalOptions): ModuleWithProviders {
    LoopBackConfig.setBaseURL(options.apiBaseUrl);
    LoopBackConfig.setRequestOptionsCredentials(true);
    return {
      ngModule: DalModule
    };
  }
}

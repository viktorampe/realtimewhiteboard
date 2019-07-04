import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Inject, InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';
import { MatSnackBarModule } from '@angular/material';
import { BrowserModule as CampusBrowserModule, BROWSER_STORAGE_SERVICE_TOKEN, StorageService } from '@campus/browser';
import { ScormModule } from '@campus/scorm';
import { LoopBackConfig, SDKBrowserModule } from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { v4 as uuid } from 'uuid';
import { AlertsEffects } from './+state/alert';
import { BundlesEffects } from './+state/bundle';
import { ContentStatusesEffects } from './+state/content-status/content-status.effects';
import { CredentialEffects } from './+state/credential';
import { CurrentExerciseEffects } from './+state/current-exercise';
import { EduContentsEffects } from './+state/edu-content';
import { EduContentProductTypeEffects } from './+state/edu-content-product-type';
import { EduNetEffects } from './+state/edu-net';
import { EffectFeedbackEffects } from './+state/effect-feedback/effect-feedback.effects';
import { FavoriteEffects } from './+state/favorite';
import { HistoryEffects } from './+state/history';
import { LearningAreasEffects } from './+state/learning-area';
import { LearningDomainEffects } from './+state/learning-domain';
import { LinkedPersonEffects } from './+state/linked-person';
import { MethodEffects } from './+state/method';
import { ResultEffects } from './+state/result';
import { SchoolTypeEffects } from './+state/school-type';
import { StudentContentStatusesEffects } from './+state/student-content-status';
import { TaskEffects } from './+state/task';
import { TaskEduContentEffects } from './+state/task-edu-content';
import { TaskInstanceEffects } from './+state/task-instance';
import { TeacherStudentEffects } from './+state/teacher-student';
import { UiEffects } from './+state/ui';
import { UnlockedBoekeGroupsEffects } from './+state/unlocked-boeke-group';
import { UnlockedBoekeStudentsEffects } from './+state/unlocked-boeke-student';
import { UnlockedContentsEffects } from './+state/unlocked-content';
import { UserEffects } from './+state/user';
import { UserContentsEffects } from './+state/user-content';
import { YearEffects } from './+state/year';
import { AlertService } from './alert/alert.service';
import { ALERT_SERVICE_TOKEN } from './alert/alert.service.interface';
import { UnlockedBoekeGroupService, UnlockedBoekeStudentService, UNLOCKED_BOEKE_GROUP_SERVICE_TOKEN, UNLOCKED_BOEKE_STUDENT_SERVICE_TOKEN } from './boeke';
import { BundleService, BUNDLE_SERVICE_TOKEN, UnlockedContentService, UNLOCKED_CONTENT_SERVICE_TOKEN, UserContentService, USER_CONTENT_SERVICE_TOKEN } from './bundle';
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
import { CredentialService, CREDENTIAL_SERVICE_TOKEN } from './persons/credential.service';
import { LinkedPersonService, LINKED_PERSON_SERVICE_TOKEN } from './persons/linked-persons.service';
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

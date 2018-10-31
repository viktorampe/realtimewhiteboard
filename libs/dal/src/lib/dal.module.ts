import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import {
  BrowserModule as CampusBrowserModule,
  BROWSER_STORAGE_SERVICE_TOKEN,
  StorageService
} from '@campus/browser';
import {
  LoopBackConfig,
  SDKBrowserModule
} from '@diekeure/polpo-api-angular-sdk';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { BundleReducer, BundlesEffects } from './+state/bundle';
import { ContentStatusReducer } from './+state/content-status';
import { ContentStatusesEffects } from './+state/content-status/content-status.effects';
import { EduContentReducer, EduContentsEffects } from './+state/edu-content';
import {
  LearningAreaReducer,
  LearningAreasEffects
} from './+state/learning-area';
import {
  StudentContentStatusesEffects,
  StudentContentStatusReducer
} from './+state/student-content-status';
import { UiEffects, uiReducer } from './+state/ui/';
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
import { UserContentReducer, UserContentsEffects } from './+state/user-content';
import { UserEffects } from './+state/user/user.effects';
import {
  initialUserstate as userInitialState,
  userReducer
} from './+state/user/user.reducer';
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
import { EduContentService } from './edu-content/edu-content.service';
import { EDUCONTENT_SERVICE_TOKEN } from './edu-content/edu-content.service.interface';
import { LearningAreaService } from './learning-area/learning-area.service';
import { LEARNINGAREA_SERVICE_TOKEN } from './learning-area/learning-area.service.interface';
import {
  AuthService,
  AUTH_SERVICE_TOKEN,
  LinkedPersonService,
  LINKEDPERSON_SERVICE_TOKEN,
  PersonService,
  PERSON_SERVICE_TOKEN
} from './person';
import { StudentContentStatusService } from './student-content-status/student-content-status.service';
import { STUDENT_CONTENT_STATUS_SERVICE_TOKEN } from './student-content-status/student-content-status.service.interface';

interface DalOptions {
  apiBaseUrl: string;
}

@NgModule({
  imports: [
    CampusBrowserModule,
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    StoreModule.forFeature('ui', uiReducer.reducer, {
      initialState: uiReducer.initialState
    }),
    StoreModule.forFeature('bundles', BundleReducer.reducer, {
      initialState: BundleReducer.initialState
    }),
    StoreModule.forFeature('learningAreas', LearningAreaReducer.reducer, {
      initialState: LearningAreaReducer.initialState
    }),
    StoreModule.forFeature('eduContents', EduContentReducer.reducer, {
      initialState: EduContentReducer.initialState
    }),
    StoreModule.forFeature('learningAreas', LearningAreaReducer.reducer, {
      initialState: LearningAreaReducer.initialState
    }),
    StoreModule.forFeature('unlockedContents', UnlockedContentReducer.reducer, {
      initialState: UnlockedContentReducer.initialState
    }),
    StoreModule.forFeature('userContents', UserContentReducer.reducer, {
      initialState: UserContentReducer.initialState
    }),
    StoreModule.forFeature(
      'studentContentStatuses',
      StudentContentStatusReducer.reducer,
      {
        initialState: StudentContentStatusReducer.initialState
      }
    ),
    StoreModule.forFeature(
      'unlockedBoekeGroups',
      UnlockedBoekeGroupReducer.reducer,
      {
        initialState: UnlockedBoekeGroupReducer.initialState
      }
    ),
    EffectsModule.forFeature([BundlesEffects, UserEffects]),
    StoreModule.forFeature('user', userReducer, {
      initialState: userInitialState
    }),
    StoreModule.forFeature(
      'unlockedBoekeStudents',
      UnlockedBoekeStudentReducer.reducer,
      {
        initialState: UnlockedBoekeStudentReducer.initialState
      }
    ),
    StoreModule.forFeature('contentStatuses', ContentStatusReducer.reducer, {
      initialState: ContentStatusReducer.initialState
    }),
    EffectsModule.forFeature([
      BundlesEffects,
      EduContentsEffects,
      UiEffects,
      LearningAreasEffects,
      UserContentsEffects,
      StudentContentStatusesEffects,
      UnlockedBoekeGroupsEffects,
      UnlockedContentsEffects,
      UserContentsEffects,
      UnlockedBoekeStudentsEffects,
      ContentStatusesEffects
    ])
  ],
  providers: [
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
    { provide: PERSON_SERVICE_TOKEN, useClass: PersonService },
    { provide: LINKEDPERSON_SERVICE_TOKEN, useClass: LinkedPersonService },
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthService }
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

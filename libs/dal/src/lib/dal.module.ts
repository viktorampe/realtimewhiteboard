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
import { Bundle } from './+state/bundle';
import { BundlesEffects } from './+state/bundle/bundle.effects';
import { EduContent } from './+state/edu-content';
import { EduContentsEffects } from './+state/edu-content/edu-content.effects';
import { LearningArea } from './+state/learning-area';
import { LearningAreasEffects } from './+state/learning-area/learning-area.effects';
import { UiEffects } from './+state/ui/ui.effects';
import {
  initialState as uiInitialState,
  uiReducer
} from './+state/ui/ui.reducer';
import { UnlockedBoekeStudent } from './+state/unlocked-boeke-student';
import { UnlockedBoekeStudentsEffects } from './+state/unlocked-boeke-student/unlocked-boeke-student.effects';
import { UserContent } from './+state/user-content';
import { UserContentsEffects } from './+state/user-content/user-content.effects';
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
import { AuthService, AuthServiceToken } from './persons/auth-service';

interface DalOptions {
  apiBaseUrl: string;
}

@NgModule({
  imports: [
    CampusBrowserModule,
    CommonModule,
    SDKBrowserModule.forRoot(),
    HttpClientModule,
    StoreModule.forFeature('ui', uiReducer, {
      initialState: uiInitialState
    }),
    StoreModule.forFeature('bundles', Bundle.reducer, {
      initialState: Bundle.initialState
    }),
    StoreModule.forFeature('learingAreas', LearningArea.reducer, {
      initialState: LearningArea.initialState
    }),
    StoreModule.forFeature('eduContents', EduContent.reducer, {
      initialState: EduContent.initialState
    }),
    StoreModule.forFeature('userContents', UserContent.reducer, {
      initialState: UserContent.initialState
    }),
    StoreModule.forFeature(
      'unlockedBoekeStudent',
      UnlockedBoekeStudent.reducer,
      {
        initialState: UnlockedBoekeStudent.initialState
      }
    ),
    EffectsModule.forFeature([
      BundlesEffects,
      EduContentsEffects,
      UiEffects,
      LearningAreasEffects,
      UserContentsEffects,
      UnlockedBoekeStudentsEffects
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
    { provide: AuthServiceToken, useClass: AuthService }
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

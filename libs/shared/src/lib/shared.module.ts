import { LayoutModule } from '@angular/cdk/layout';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Inject, ModuleWithProviders, NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatButtonModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatIconRegistry,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatSnackBarModule,
  MatTooltipModule
} from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import {
  FilterService,
  FILTER_SERVICE_TOKEN,
  MapObjectConversionService,
  UtilsModule
} from '@campus/utils';
import { HasPermissionDirective } from './auth/has-permission.directive';
import { PermissionService } from './auth/permission.service';
import { PERMISSION_SERVICE_TOKEN } from './auth/permission.service.interface';
import { EduContentCollectionManagerService } from './collection-manager/edu-content-collection-manager.service';
import { EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN } from './collection-manager/edu-content-collection-manager.service.interface';
import { LearningPlanGoalProgressManagementComponent } from './components/learning-plan-goal-progress-management/learning-plan-goal-progress-management.component';
import { MethodYearTileComponent } from './components/method-year-tile/method-year-tile.component';
import { PageBarContainerComponent } from './components/page-bar-container/page-bar-container.component';
import { QuickLinkComponent } from './components/quick-link/quick-link.component';
import { OPEN_STATIC_CONTENT_SERVICE_TOKEN } from './content/open-static-content.interface';
import { OpenStaticContentService } from './content/open-static-content.service';
import { CampusRouterlinkDirective } from './directives/campus-routerlink.directive';
import { DataCyDirective } from './directives/data-cy.directive';
import { FeedBackService, FEEDBACK_SERVICE_TOKEN } from './feedback';
import {
  SnackBarDefaultConfig,
  SNACKBAR_DEFAULT_CONFIG_TOKEN
} from './feedback/snackbar.config';
import { HeaderComponent } from './header/header.component';
import { CampusHttpInterceptor } from './interceptors/campus-http.interceptor';
import {
  EnvironmentAlertsFeatureInterface,
  EnvironmentApiInterface,
  EnvironmentErrorManagementFeatureInterface,
  EnvironmentIconMappingInterface,
  EnvironmentLoginInterface,
  EnvironmentLogoutInterface,
  EnvironmentMessagesFeatureInterface,
  EnvironmentSearchModesInterface,
  EnvironmentSsoInterface,
  EnvironmentTermPrivacyInterface,
  EnvironmentTestingInterface,
  EnvironmentWebsiteInterface,
  ENVIRONMENT_ALERTS_FEATURE_TOKEN,
  ENVIRONMENT_API_TOKEN,
  ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN,
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_LOGIN_TOKEN,
  ENVIRONMENT_LOGOUT_TOKEN,
  ENVIRONMENT_MESSAGES_FEATURE_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  ENVIRONMENT_SSO_TOKEN,
  ENVIRONMENT_TERM_PRIVACY_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  ENVIRONMENT_WEBSITE_TOKEN
} from './interfaces';
import { AlertToNotificationItemPipe } from './pipes/alert-to-notification/alert-to-notification-pipe';
import { MailToByCredentialPipe } from './pipes/mail-to/mail-to-credential-pipe';
import { PersonBadgeFromCredentialPipe } from './pipes/person-badge-from-credential/person-badge-from-credential-pipe';
import { ScormExerciseService } from './scorm/scorm-exercise.service';
import { SCORM_EXERCISE_SERVICE_TOKEN } from './scorm/scorm-exercise.service.interface';
import { ContentActionsService } from './services/content-actions/content-actions.service';
import { CONTENT_ACTIONS_SERVICE_TOKEN } from './services/content-actions/content-actions.service.interface';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    PortalModule,
    LayoutModule,
    MatIconModule,
    MatBadgeModule,
    RouterModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    MatListModule,
    MatTooltipModule,
    UtilsModule,
    MatMenuModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    HttpClientModule,
    MatInputModule,
    ReactiveFormsModule
  ],
  declarations: [
    HeaderComponent,
    PageBarContainerComponent,
    HasPermissionDirective,
    PersonBadgeFromCredentialPipe,
    MailToByCredentialPipe,
    CampusRouterlinkDirective,
    DataCyDirective,
    AlertToNotificationItemPipe,
    QuickLinkComponent,
    LearningPlanGoalProgressManagementComponent,
    MethodYearTileComponent
  ],
  exports: [
    HeaderComponent,
    PortalModule,
    LayoutModule,
    PageBarContainerComponent,
    HasPermissionDirective,
    PersonBadgeFromCredentialPipe,
    MailToByCredentialPipe,
    CampusRouterlinkDirective,
    DataCyDirective,
    AlertToNotificationItemPipe,
    QuickLinkComponent,
    MethodYearTileComponent
  ],
  providers: [
    MapObjectConversionService,
    { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
    { provide: SCORM_EXERCISE_SERVICE_TOKEN, useClass: ScormExerciseService },
    { provide: PERMISSION_SERVICE_TOKEN, useClass: PermissionService },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CampusHttpInterceptor,
      multi: true
    },
    {
      provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
      useClass: OpenStaticContentService
    },
    { provide: FEEDBACK_SERVICE_TOKEN, useClass: FeedBackService },
    {
      provide: SNACKBAR_DEFAULT_CONFIG_TOKEN,
      useClass: SnackBarDefaultConfig
    },
    {
      provide: EDU_CONTENT_COLLECTION_MANAGER_SERVICE_TOKEN,
      useClass: EduContentCollectionManagerService
    },
    { provide: CONTENT_ACTIONS_SERVICE_TOKEN, useClass: ContentActionsService },
    AlertToNotificationItemPipe
  ],
  entryComponents: [
    QuickLinkComponent,
    LearningPlanGoalProgressManagementComponent
  ]
})
export class SharedModule {
  constructor(
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
    @Inject(ENVIRONMENT_ICON_MAPPING_TOKEN)
    private iconMapping: { [icon: string]: string }
  ) {
    this.setupIconRegistry();
  }
  static forRoot(
    environmentAlertsFeature: EnvironmentAlertsFeatureInterface,
    environmentMessagesFeature: EnvironmentMessagesFeatureInterface,
    environmentErrorManagementFeature: EnvironmentErrorManagementFeatureInterface,
    environmentIconMapping: EnvironmentIconMappingInterface,
    environmentWebsite: EnvironmentWebsiteInterface,
    environmentLogout: EnvironmentLogoutInterface,
    environmentLogin: EnvironmentLoginInterface,
    environmentTermPrivacy: EnvironmentTermPrivacyInterface,
    environmentApi: EnvironmentApiInterface,
    environmentSsoSettings: EnvironmentSsoInterface,
    environmentSearchModes: EnvironmentSearchModesInterface,
    environmentTesting: EnvironmentTestingInterface
  ): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        {
          provide: ENVIRONMENT_ALERTS_FEATURE_TOKEN,
          useValue: environmentAlertsFeature
        },
        {
          provide: ENVIRONMENT_MESSAGES_FEATURE_TOKEN,
          useValue: environmentMessagesFeature
        },
        {
          provide: ENVIRONMENT_ERROR_MANAGEMENT_FEATURE_TOKEN,
          useValue: environmentErrorManagementFeature
        },
        {
          provide: ENVIRONMENT_WEBSITE_TOKEN,
          useValue: environmentWebsite
        },
        {
          provide: ENVIRONMENT_LOGOUT_TOKEN,
          useValue: environmentLogout
        },
        {
          provide: ENVIRONMENT_LOGIN_TOKEN,
          useValue: environmentLogin
        },
        {
          provide: ENVIRONMENT_TERM_PRIVACY_TOKEN,
          useValue: environmentTermPrivacy
        },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: environmentIconMapping
        },
        {
          provide: ENVIRONMENT_API_TOKEN,
          useValue: environmentApi
        },
        {
          provide: ENVIRONMENT_SSO_TOKEN,
          useValue: environmentSsoSettings
        },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: environmentSearchModes
        },
        {
          provide: ENVIRONMENT_TESTING_TOKEN,
          useValue: environmentTesting
        }
      ]
    };
  }

  setupIconRegistry() {
    for (const key in this.iconMapping) {
      if (key.indexOf(':') > 0) {
        this.iconRegistry.addSvgIconInNamespace(
          key.split(':')[0],
          key.split(':')[1],
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      } else {
        this.iconRegistry.addSvgIcon(
          key,
          this.sanitizer.bypassSecurityTrustResourceUrl(this.iconMapping[key])
        );
      }
    }
  }
}

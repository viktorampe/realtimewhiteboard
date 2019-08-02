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
  ExerciseService,
  EXERCISE_SERVICE_TOKEN,
  LearningDomainService,
  LEARNING_DOMAIN_SERVICE_TOKEN,
  MethodService,
  METHOD_SERVICE_TOKEN,
  PersonService,
  PERSON_SERVICE_TOKEN,
  TocService,
  TOC_SERVICE_TOKEN,
  YearService,
  YEAR_SERVICE_TOKEN
} from '@campus/dal';
import {
  OpenStaticContentService,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseService,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';

@NgModule({
  providers: [
    //app level services

    // dal services
    { provide: AUTH_SERVICE_TOKEN, useClass: AuthService },
    { provide: TOC_SERVICE_TOKEN, useClass: TocService },
    { provide: PERSON_SERVICE_TOKEN, useClass: PersonService },
    { provide: DIABOLO_PHASE_SERVICE_TOKEN, useClass: DiaboloPhaseService },
    { provide: EDU_CONTENT_SERVICE_TOKEN, useClass: EduContentService },
    {
      provide: EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
      useClass: EduContentProductTypeService
    },
    { provide: METHOD_SERVICE_TOKEN, useClass: MethodService },
    { provide: YEAR_SERVICE_TOKEN, useClass: YearService },
    { provide: SCORM_EXERCISE_SERVICE_TOKEN, useClass: ScormExerciseService },
    { provide: EXERCISE_SERVICE_TOKEN, useClass: ExerciseService },
    {
      provide: OPEN_STATIC_CONTENT_SERVICE_TOKEN,
      useClass: OpenStaticContentService
    },
    { provide: LEARNING_DOMAIN_SERVICE_TOKEN, useClass: LearningDomainService }
  ]
})
export class AppTokenModule {}

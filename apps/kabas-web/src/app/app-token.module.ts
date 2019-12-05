import { NgModule } from '@angular/core';
import {
  AlertService,
  ALERT_SERVICE_TOKEN,
  AuthService,
  AUTH_SERVICE_TOKEN,
  ClassGroupService,
  CLASS_GROUP_SERVICE_TOKEN,
  DiaboloPhaseService,
  DIABOLO_PHASE_SERVICE_TOKEN,
  EduContentProductTypeService,
  EduContentService,
  EDU_CONTENT_PRODUCT_TYPE_SERVICE_TOKEN,
  EDU_CONTENT_SERVICE_TOKEN,
  ExerciseService,
  EXERCISE_SERVICE_TOKEN,
  FavoriteService,
  FAVORITE_SERVICE_TOKEN,
  HistoryService,
  HISTORY_SERVICE_TOKEN,
  LearningAreaService,
  LEARNINGAREA_SERVICE_TOKEN,
  LearningDomainService,
  LearningPlanGoalProgressService,
  LearningPlanGoalService,
  LEARNING_DOMAIN_SERVICE_TOKEN,
  LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN,
  LEARNING_PLAN_GOAL_SERVICE_TOKEN,
  MethodLevelService,
  MethodService,
  METHOD_LEVEL_SERVICE_TOKEN,
  METHOD_SERVICE_TOKEN,
  PersonService,
  PERSON_SERVICE_TOKEN,
  ResultsService,
  RESULTS_SERVICE_TOKEN,
  TaskGroupService,
  TaskStudentService,
  TASK_GROUP_SERVICE_TOKEN,
  TASK_STUDENT_SERVICE_TOKEN,
  TocService,
  TOC_SERVICE_TOKEN,
  UndoService,
  UNDO_SERVICE_TOKEN,
  UnlockedFreePracticeService,
  UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN,
  UserLessonService,
  USER_LESSON_SERVICE_TOKEN,
  YearService,
  YEAR_SERVICE_TOKEN
} from '@campus/dal';
import { ScormApiService, SCORM_API_SERVICE_TOKEN } from '@campus/scorm';
import {
  APP_NAVIGATION_TREE_TOKEN,
  NavigationItemService,
  NAVIGATION_ITEM_SERVICE_TOKEN,
  OpenStaticContentService,
  OPEN_STATIC_CONTENT_SERVICE_TOKEN,
  ScormExerciseService,
  SCORM_EXERCISE_SERVICE_TOKEN
} from '@campus/shared';
import { kabasConfig } from './app.config';

@NgModule({
  providers: [
    //app level services
    { provide: NAVIGATION_ITEM_SERVICE_TOKEN, useClass: NavigationItemService },
    { provide: APP_NAVIGATION_TREE_TOKEN, useValue: kabasConfig.appNavtree },

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
    { provide: USER_LESSON_SERVICE_TOKEN, useClass: UserLessonService },
    { provide: LEARNING_DOMAIN_SERVICE_TOKEN, useClass: LearningDomainService },
    { provide: CLASS_GROUP_SERVICE_TOKEN, useClass: ClassGroupService },
    {
      provide: LEARNING_PLAN_GOAL_SERVICE_TOKEN,
      useClass: LearningPlanGoalService
    },
    {
      provide: LEARNINGAREA_SERVICE_TOKEN,
      useClass: LearningAreaService
    },
    { provide: FAVORITE_SERVICE_TOKEN, useClass: FavoriteService },
    { provide: HISTORY_SERVICE_TOKEN, useClass: HistoryService },
    { provide: RESULTS_SERVICE_TOKEN, useClass: ResultsService },
    {
      provide: ALERT_SERVICE_TOKEN,
      useClass: AlertService
    },
    {
      provide: LEARNING_PLAN_GOAL_PROGRESS_SERVICE_TOKEN,
      useClass: LearningPlanGoalProgressService
    },
    { provide: UNDO_SERVICE_TOKEN, useClass: UndoService },
    {
      provide: UNLOCKED_FREE_PRACTICE_SERVICE_TOKEN,
      useClass: UnlockedFreePracticeService
    },
    { provide: SCORM_API_SERVICE_TOKEN, useClass: ScormApiService },
    { provide: METHOD_LEVEL_SERVICE_TOKEN, useClass: MethodLevelService },
    { provide: TASK_GROUP_SERVICE_TOKEN, useClass: TaskGroupService },
    { provide: TASK_STUDENT_SERVICE_TOKEN, useClass: TaskStudentService }
  ]
})
export class AppTokenModule {}

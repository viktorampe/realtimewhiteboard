import { NgModule } from '@angular/core';
import {
  AlertReducer,
  ClassGroupReducer,
  CurrentExerciseReducer,
  CustomSerializer,
  DiaboloPhaseReducer,
  EduContentBookReducer,
  EduContentProductTypeReducer,
  EduContentReducer,
  EduContentTocEduContentReducer,
  EduContentTocReducer,
  EffectFeedbackReducer,
  FavoriteReducer,
  GroupReducer,
  HistoryReducer,
  LearningAreaReducer,
  LearningDomainReducer,
  LearningPlanGoalProgressReducer,
  LearningPlanGoalReducer,
  LinkedPersonReducer,
  MethodLevelReducer,
  MethodReducer,
  ResultReducer,
  TaskClassGroupReducer,
  TaskEduContentReducer,
  TaskGroupReducer,
  TaskReducer,
  TaskStudentReducer,
  UiReducer,
  UnlockedFreePracticeReducer,
  UserLessonReducer,
  UserReducer,
  YearReducer
} from '@campus/dal';
import {
  NavigationActionTiming,
  routerReducer,
  StoreRouterConnectingModule
} from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { handleUndo } from 'ngrx-undo';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    StoreModule.forRoot(
      { app: undefined, router: routerReducer },
      {
        metaReducers: !environment.production
          ? [handleUndo]
          : [handleUndo], runtimeChecks: { strictStateImmutability: true, strictActionImmutability: true }
      }
    ),
    StoreRouterConnectingModule.forRoot({
      navigationActionTiming: NavigationActionTiming.PostActivation,
      serializer: CustomSerializer
    }),
    StoreModule.forFeature(UiReducer.NAME, UiReducer.reducer, {
      initialState: UiReducer.initialState
    }),
    StoreModule.forFeature(UserReducer.NAME, UserReducer.reducer, {
      initialState: UserReducer.initialState
    }),
    StoreModule.forFeature(
      EduContentBookReducer.NAME,
      EduContentBookReducer.reducer,
      {
        initialState: EduContentBookReducer.initialState
      }
    ),
    StoreModule.forFeature(
      DiaboloPhaseReducer.NAME,
      DiaboloPhaseReducer.reducer,
      {
        initialState: DiaboloPhaseReducer.initialState
      }
    ),
    StoreModule.forFeature(
      EduContentProductTypeReducer.NAME,
      EduContentProductTypeReducer.reducer,
      {
        initialState: EduContentProductTypeReducer.initialState
      }
    ),
    StoreModule.forFeature(
      EduContentTocReducer.NAME,
      EduContentTocReducer.reducer,
      {
        initialState: EduContentTocReducer.initialState
      }
    ),
    StoreModule.forFeature(MethodReducer.NAME, MethodReducer.reducer, {
      initialState: MethodReducer.initialState
    }),
    StoreModule.forFeature(YearReducer.NAME, YearReducer.reducer, {
      initialState: YearReducer.initialState
    }),
    StoreModule.forFeature(EduContentReducer.NAME, EduContentReducer.reducer, {
      initialState: EduContentReducer.initialState
    }),
    StoreModule.forFeature(
      CurrentExerciseReducer.NAME,
      CurrentExerciseReducer.reducer,
      { initialState: CurrentExerciseReducer.initialState }
    ),
    StoreModule.forFeature(UserLessonReducer.NAME, UserLessonReducer.reducer, {
      initialState: UserLessonReducer.initialState
    }),
    StoreModule.forFeature(
      LearningDomainReducer.NAME,
      LearningDomainReducer.reducer,
      {
        initialState: LearningDomainReducer.initialState
      }
    ),
    StoreModule.forFeature(
      LearningPlanGoalProgressReducer.NAME,
      LearningPlanGoalProgressReducer.reducer,
      {
        initialState: LearningPlanGoalProgressReducer.initialState
      }
    ),
    StoreModule.forFeature(
      LearningPlanGoalReducer.NAME,
      LearningPlanGoalReducer.reducer,
      {
        initialState: LearningPlanGoalReducer.initialState
      }
    ),
    StoreModule.forFeature(ResultReducer.NAME, ResultReducer.reducer, {
      initialState: ResultReducer.initialState
    }),
    StoreModule.forFeature(TaskReducer.NAME, TaskReducer.reducer, {
      initialState: TaskReducer.initialState
    }),
    StoreModule.forFeature(
      LearningAreaReducer.NAME,
      LearningAreaReducer.reducer,
      {
        initialState: LearningAreaReducer.initialState
      }
    ),
    StoreModule.forFeature(ClassGroupReducer.NAME, ClassGroupReducer.reducer, {
      initialState: ClassGroupReducer.initialState
    }),
    StoreModule.forFeature(
      EffectFeedbackReducer.NAME,
      EffectFeedbackReducer.reducer,
      {
        initialState: EffectFeedbackReducer.initialState
      }
    ),
    StoreModule.forFeature(AlertReducer.NAME, AlertReducer.reducer, {
      initialState: AlertReducer.initialState
    }),
    StoreModule.forFeature(FavoriteReducer.NAME, FavoriteReducer.reducer, {
      initialState: FavoriteReducer.initialState
    }),
    StoreModule.forFeature(HistoryReducer.NAME, HistoryReducer.reducer, {
      initialState: HistoryReducer.initialState
    }),
    StoreModule.forFeature(
      EduContentTocEduContentReducer.NAME,
      EduContentTocEduContentReducer.reducer,
      {
        initialState: EduContentTocEduContentReducer.initialState
      }
    ),
    StoreModule.forFeature(
      UnlockedFreePracticeReducer.NAME,
      UnlockedFreePracticeReducer.reducer,
      {
        initialState: UnlockedFreePracticeReducer.initialState
      }
    ),
    StoreModule.forFeature(
      MethodLevelReducer.NAME,
      MethodLevelReducer.reducer,
      {
        initialState: MethodLevelReducer.initialState
      }
    ),
    StoreModule.forFeature(TaskGroupReducer.NAME, TaskGroupReducer.reducer, {
      initialState: TaskGroupReducer.initialState
    }),

    StoreModule.forFeature(GroupReducer.NAME, GroupReducer.reducer, {
      initialState: GroupReducer.initialState
    }),

    StoreModule.forFeature(
      LinkedPersonReducer.NAME,
      LinkedPersonReducer.reducer,
      {
        initialState: LinkedPersonReducer.initialState
      }
    ),
    StoreModule.forFeature(
      TaskClassGroupReducer.NAME,
      TaskClassGroupReducer.reducer,
      {
        initialState: TaskClassGroupReducer.initialState
      }
    ),
    StoreModule.forFeature(
      TaskStudentReducer.NAME,
      TaskStudentReducer.reducer,
      {
        initialState: TaskStudentReducer.initialState
      }
    ),
    StoreModule.forFeature(
      TaskEduContentReducer.NAME,
      TaskEduContentReducer.reducer,
      {
        initialState: TaskEduContentReducer.initialState
      }
    ),
    !environment.production ? StoreDevtoolsModule.instrument() : []
  ]
})
export class AppStoreModule {}

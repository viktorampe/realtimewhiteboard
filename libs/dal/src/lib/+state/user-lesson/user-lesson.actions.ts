import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';
import {
  LearningPlanGoalProgressInterface,
  UserLessonInterface
} from '../../+models';
import {
  CustomFeedbackHandlersInterface,
  FeedbackTriggeringAction
} from '../effect-feedback';

export enum UserLessonsActionTypes {
  UserLessonsLoaded = '[UserLessons] UserLessons Loaded',
  UserLessonsLoadError = '[UserLessons] Load Error',
  LoadUserLessons = '[UserLessons] Load UserLessons',
  AddUserLesson = '[UserLessons] Add UserLesson',
  UpsertUserLesson = '[UserLessons] Upsert UserLesson',
  AddUserLessons = '[UserLessons] Add UserLessons',
  UpsertUserLessons = '[UserLessons] Upsert UserLessons',
  UpdateUserLesson = '[UserLessons] Update UserLesson',
  UpdateUserLessons = '[UserLessons] Update UserLessons',
  DeleteUserLesson = '[UserLessons] Delete UserLesson',
  DeleteUserLessons = '[UserLessons] Delete UserLessons',
  ClearUserLessons = '[UserLessons] Clear UserLessons',
  CreateUserLesson = '[UserLessons] Create UserLesson',
  CreateUserLessonWithLearningPlanGoalProgresses = '[UserLessons] Create UserLesson with LearningPlanGoalProgresses'
}

export class LoadUserLessons implements Action {
  readonly type = UserLessonsActionTypes.LoadUserLessons;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class UserLessonsLoaded implements Action {
  readonly type = UserLessonsActionTypes.UserLessonsLoaded;

  constructor(public payload: { userLessons: UserLessonInterface[] }) {}
}

export class UserLessonsLoadError implements Action {
  readonly type = UserLessonsActionTypes.UserLessonsLoadError;
  constructor(public payload: any) {}
}

export class AddUserLesson implements Action {
  readonly type = UserLessonsActionTypes.AddUserLesson;

  constructor(public payload: { userLesson: UserLessonInterface }) {}
}

export class UpsertUserLesson implements Action {
  readonly type = UserLessonsActionTypes.UpsertUserLesson;

  constructor(public payload: { userLesson: UserLessonInterface }) {}
}

export class AddUserLessons implements Action {
  readonly type = UserLessonsActionTypes.AddUserLessons;

  constructor(public payload: { userLessons: UserLessonInterface[] }) {}
}

export class UpsertUserLessons implements Action {
  readonly type = UserLessonsActionTypes.UpsertUserLessons;

  constructor(public payload: { userLessons: UserLessonInterface[] }) {}
}

export class UpdateUserLesson implements Action {
  readonly type = UserLessonsActionTypes.UpdateUserLesson;

  constructor(public payload: { userLesson: Update<UserLessonInterface> }) {}
}

export class UpdateUserLessons implements Action {
  readonly type = UserLessonsActionTypes.UpdateUserLessons;

  constructor(public payload: { userLessons: Update<UserLessonInterface>[] }) {}
}

export class DeleteUserLesson implements Action {
  readonly type = UserLessonsActionTypes.DeleteUserLesson;

  constructor(public payload: { id: number }) {}
}

export class DeleteUserLessons implements Action {
  readonly type = UserLessonsActionTypes.DeleteUserLessons;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearUserLessons implements Action {
  readonly type = UserLessonsActionTypes.ClearUserLessons;
}

export class CreateUserLesson implements FeedbackTriggeringAction {
  readonly type = UserLessonsActionTypes.CreateUserLesson;

  constructor(
    public payload: {
      userId: number;
      userLesson: UserLessonInterface;
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export class CreateUserLessonWithLearningPlanGoalProgresses
  implements FeedbackTriggeringAction {
  readonly type =
    UserLessonsActionTypes.CreateUserLessonWithLearningPlanGoalProgresses;

  constructor(
    public payload: {
      userId: number;
      userLesson: UserLessonInterface;
      learningPlanGoalProgresses: LearningPlanGoalProgressInterface[];
      customFeedbackHandlers?: CustomFeedbackHandlersInterface;
    }
  ) {}
}

export type UserLessonsActions =
  | LoadUserLessons
  | UserLessonsLoaded
  | UserLessonsLoadError
  | AddUserLesson
  | UpsertUserLesson
  | AddUserLessons
  | UpsertUserLessons
  | UpdateUserLesson
  | UpdateUserLessons
  | DeleteUserLesson
  | DeleteUserLessons
  | ClearUserLessons
  | CreateUserLesson
  | CreateUserLessonWithLearningPlanGoalProgresses;

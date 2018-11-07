import { ExerciseInterface } from '@campus/dal';
import { Update } from '@ngrx/entity';
import { Action } from '@ngrx/store';

export enum ExercisesActionTypes {
  // Current Exercise Actions
  StartExercise = '[Exercises] Start Exercise',
  ExerciseUrlLoaded = '[Exercises] Exercise Url Loaded',
  ExerciseResultLoaded = '[Exercises] Exercise Result Loaded',
  ExerciseError = '[Exercises] Exercise Error',
  SaveExercise = '[Exercises] Save Exercise',
  // also: UpdateExercise

  ExercisesLoaded = '[Exercises] Exercises Loaded',
  ExercisesLoadError = '[Exercises] Load Error',
  LoadExercises = '[Exercises] Load Exercises',
  AddExercise = '[Exercises] Add Exercise',
  UpsertExercise = '[Exercises] Upsert Exercise',
  AddExercises = '[Exercises] Add Exercises',
  UpsertExercises = '[Exercises] Upsert Exercises',
  UpdateExercise = '[Exercises] Update Exercise',
  UpdateExercises = '[Exercises] Update Exercises',
  DeleteExercise = '[Exercises] Delete Exercise',
  DeleteExercises = '[Exercises] Delete Exercises',
  ClearExercises = '[Exercises] Clear Exercises'
}

export class StartExercise implements Action {
  readonly type = ExercisesActionTypes.StartExercise;

  constructor(public payload: any) {}
}
export class ExerciseUrlLoaded implements Action {
  readonly type = ExercisesActionTypes.ExerciseUrlLoaded;

  constructor(public payload: any) {}
}
export class ExerciseResultLoaded implements Action {
  readonly type = ExercisesActionTypes.ExerciseResultLoaded;

  constructor(public payload: any) {}
}
export class ExerciseError implements Action {
  readonly type = ExercisesActionTypes.ExerciseError;

  constructor(public payload: any) {}
}
export class SaveExercise implements Action {
  readonly type = ExercisesActionTypes.SaveExercise;

  constructor(public payload: any) {}
}

export class LoadExercises implements Action {
  readonly type = ExercisesActionTypes.LoadExercises;

  constructor(
    public payload: { force?: boolean; userId: number } = { userId: null }
  ) {}
}

export class ExercisesLoaded implements Action {
  readonly type = ExercisesActionTypes.ExercisesLoaded;

  constructor(public payload: { exercises: ExerciseInterface[] }) {}
}

export class ExercisesLoadError implements Action {
  readonly type = ExercisesActionTypes.ExercisesLoadError;
  constructor(public payload: any) {}
}

export class AddExercise implements Action {
  readonly type = ExercisesActionTypes.AddExercise;

  constructor(public payload: { exercise: ExerciseInterface }) {}
}

export class UpsertExercise implements Action {
  readonly type = ExercisesActionTypes.UpsertExercise;

  constructor(public payload: { exercise: ExerciseInterface }) {}
}

export class AddExercises implements Action {
  readonly type = ExercisesActionTypes.AddExercises;

  constructor(public payload: { exercises: ExerciseInterface[] }) {}
}

export class UpsertExercises implements Action {
  readonly type = ExercisesActionTypes.UpsertExercises;

  constructor(public payload: { exercises: ExerciseInterface[] }) {}
}

export class UpdateExercise implements Action {
  readonly type = ExercisesActionTypes.UpdateExercise;

  constructor(public payload: { exercise: Update<ExerciseInterface> }) {}
}

export class UpdateExercises implements Action {
  readonly type = ExercisesActionTypes.UpdateExercises;

  constructor(public payload: { exercises: Update<ExerciseInterface>[] }) {}
}

export class DeleteExercise implements Action {
  readonly type = ExercisesActionTypes.DeleteExercise;

  constructor(public payload: { id: number }) {}
}

export class DeleteExercises implements Action {
  readonly type = ExercisesActionTypes.DeleteExercises;

  constructor(public payload: { ids: number[] }) {}
}

export class ClearExercises implements Action {
  readonly type = ExercisesActionTypes.ClearExercises;
}

export type ExercisesActions =
  | LoadExercises
  | ExercisesLoaded
  | ExercisesLoadError
  | AddExercise
  | UpsertExercise
  | AddExercises
  | UpsertExercises
  | UpdateExercise
  | UpdateExercises
  | DeleteExercise
  | DeleteExercises
  | ClearExercises
  | StartExercise
  | ExerciseUrlLoaded
  | ExerciseResultLoaded
  | ExerciseError
  | SaveExercise;

import {
  AlertReducer,
  BundleReducer,
  ContentStatusReducer,
  CurrentExerciseReducer,
  EduContentReducer,
  LearningAreaReducer,
  StudentContentStatusReducer,
  TaskEduContentReducer,
  TaskInstanceReducer,
  TaskReducer,
  UiReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UserContentReducer,
  UserReducer
} from '../..';

export interface DalState {
  ui: UiReducer.UiState;
  learningAreas: LearningAreaReducer.State;
  bundles: BundleReducer.State;
  eduContents: EduContentReducer.State;
  userContents: UserContentReducer.State;
  unlockedContents: UnlockedContentReducer.State;
  unlockedBoekeGroups: UnlockedBoekeGroupReducer.State;
  unlockedBoekeStudents: UnlockedBoekeStudentReducer.State;
  alerts: AlertReducer.State;
  contentStatuses: ContentStatusReducer.State;
  user: UserReducer.State;
  studentContentStatuses: StudentContentStatusReducer.State;
  tasks: TaskReducer.State;
  currentExercise: CurrentExerciseReducer.State;
  taskInstances: TaskInstanceReducer.State;
  taskEduContents: TaskEduContentReducer.State;
}

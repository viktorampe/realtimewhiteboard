import {
  AlertReducer,
  BundleReducer,
  ContentStatusReducer,
  CredentialReducer,
  CurrentExerciseReducer,
  EduContentProductTypeReducer,
  EduContentReducer,
  EduNetReducer,
  FavoriteReducer,
  HistoryReducer,
  LearningAreaReducer,
  LearningDomainReducer,
  LinkedPersonReducer,
  MethodReducer,
  ResultReducer,
  SchoolTypeReducer,
  StudentContentStatusReducer,
  TaskEduContentReducer,
  TaskInstanceReducer,
  TaskReducer,
  TeacherStudentReducer,
  UiReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UserContentReducer,
  UserReducer,
  YearReducer
} from '../..';

export interface DalState {
  ui: UiReducer.UiState;
  learningAreas: LearningAreaReducer.State;
  learningDomains: LearningDomainReducer.State;
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
  results: ResultReducer.State;
  linkedPersons: LinkedPersonReducer.State;
  teacherStudents: TeacherStudentReducer.State;
  credentials: CredentialReducer.State;
  methods: MethodReducer.State;
  favorites: FavoriteReducer.State;
  eduContentProductTypes: EduContentProductTypeReducer.State;
  eduNets: EduNetReducer.State;
  schoolTypes: SchoolTypeReducer.State;
  years: YearReducer.State;
  history: HistoryReducer.State;
}

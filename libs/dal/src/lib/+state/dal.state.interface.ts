import {
  AlertReducer,
  BundleReducer,
  ClassGroupReducer,
  ContentStatusReducer,
  CredentialReducer,
  CurrentExerciseReducer,
  DiaboloPhaseReducer,
  EduContentBookReducer,
  EduContentProductTypeReducer,
  EduContentReducer,
  EduContentTocReducer,
  EduNetReducer,
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
  SchoolTypeReducer,
  StudentContentStatusReducer,
  TaskClassGroupReducer,
  TaskEduContentReducer,
  TaskGroupReducer,
  TaskInstanceReducer,
  TaskReducer,
  TaskStudentReducer,
  TeacherStudentReducer,
  UiReducer,
  UnlockedBoekeGroupReducer,
  UnlockedBoekeStudentReducer,
  UnlockedContentReducer,
  UnlockedFreePracticeReducer,
  UserContentReducer,
  UserLessonReducer,
  UserReducer,
  YearReducer
} from '../..';

export interface DalState {
  ui: UiReducer.UiState;
  learningAreas: LearningAreaReducer.State;
  learningDomains: LearningDomainReducer.State;
  bundles: BundleReducer.State;
  eduContentBooks: EduContentBookReducer.State;
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
  taskGroups: TaskGroupReducer.State;
  taskStudents: TaskStudentReducer.State;
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
  eduContentTocs: EduContentTocReducer.State;
  diaboloPhases: DiaboloPhaseReducer.State;
  userLessons: UserLessonReducer.State;
  learningPlanGoalProgresses: LearningPlanGoalProgressReducer.State;
  learningPlanGoals: LearningPlanGoalReducer.State;
  classGroups: ClassGroupReducer.State;
  unlockedFreePractices: UnlockedFreePracticeReducer.State;
  methodLevels: MethodLevelReducer.State;
  groups: GroupReducer.State;
  taskClassGroups: TaskClassGroupReducer.State;
}

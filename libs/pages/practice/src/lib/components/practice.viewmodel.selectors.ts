export interface ChapterWithStatus {
  title: string;
  exercises: {
    available: number;
    completed: number;
  };
  kwetonsRemaining: number;
}

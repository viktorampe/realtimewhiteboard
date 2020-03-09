import { Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';

export class StudentTasksViewModel {
  public studentTasks$: Observable<StudentTaskInterface>;
  public activeTasks$: Observable<StudentTaskInterface>;
  public finishedTasks$: Observable<StudentTaskInterface>;

  constructor() {
    this.setupStreams();
  }

  public setupStreams() {
    this.finishedTasks$ = this.studentTasks$.pipe(filter(st => st.isFinished));
    this.activeTasks$ = this.studentTasks$.pipe(filter(st => !st.isFinished));
  }
}

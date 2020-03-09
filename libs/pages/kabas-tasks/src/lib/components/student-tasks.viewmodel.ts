import { Observable } from 'rxjs';
import { StudentTaskInterface } from '../interfaces/StudentTask.interface';

export class StudentTasksViewModel {
  public studentTasks$: Observable<StudentTaskInterface>;
}

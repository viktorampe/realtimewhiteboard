import { Observable } from 'rxjs';
import { UserContentInterface } from '../+models';

export interface UserContentServiceInterface {
  getAllForUser(userId: number): Observable<UserContentInterface[]>;
}

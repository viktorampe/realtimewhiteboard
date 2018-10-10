import { Observable } from 'rxjs';
import { UnlockedContentInterface } from '../+models';

export interface UnlockedContentsServiceInterface {
  getAllForUser(userId: number): Observable<UnlockedContentInterface[]>;
}

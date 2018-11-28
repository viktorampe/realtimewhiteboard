import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NestedPartial } from '../types/nestedpartial';

export function groupStreamByKey<T>(
  stream$: Observable<T[]>,
  key: NestedPartial<T>
): Observable<Dictionary<T[]>> {
  return stream$.pipe(
    map(
      (arr: T[]): Dictionary<T[]> => {
        return groupArrayByKey(arr, key);
      }
    ),
    shareReplay(1)
  );
}

export function groupArrayByKey<T>(
  arr: T[],
  key: NestedPartial<T>
): Dictionary<T[]> {
  const byKey = {};
  arr.forEach(item => {
    const prop = getPropertyByKey(item, key);
    if (!byKey[prop]) {
      byKey[prop] = [];
    }
    byKey[prop].push(item);
  });
  return byKey;
}

function getPropertyByKey<T>(item: T, keys: NestedPartial<T>): number | string {
  if (typeof item === 'string' || typeof item === 'number') {
    return item;
  }
  const key = Object.keys(keys)[0];
  return this.getPropertyByKey(item[key], keys[key]);
}

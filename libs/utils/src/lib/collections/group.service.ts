import { Dictionary } from '@ngrx/entity';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

export function groupStreamByKey<T, K extends PrimitivePropertiesKeys<T>>(
  stream$: Observable<T[]>,
  key: K
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

export function groupArrayByKey<T, K extends PrimitivePropertiesKeys<T>>(
  arr: T[],
  key: K
): Dictionary<T[]> {
  const byKey = {} as any;
  arr.forEach(item => {
    const prop = item[key];
    if (!byKey[prop]) {
      byKey[prop] = [];
    }
    byKey[prop].push(item);
  });
  return byKey;
}

type PrimitivePropertiesKeys<T> = {
  [K in keyof T]: T[K] extends string | number ? K : never
}[keyof T];

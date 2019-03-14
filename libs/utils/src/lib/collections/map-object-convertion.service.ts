import { Injectable } from '@angular/core';

@Injectable()
export class MapObjectConvertionService {
  public mapToObject<T extends string | number>(
    map: Map<T, any>
  ): T extends string ? { [key: string]: any } : { [key: number]: any } {
    return Array.from(map).reduce(
      (
        obj: T extends string ? { [key: string]: any } : { [key: number]: any },
        [key, value]: [string | number, any]
      ) => {
        obj[key] = value instanceof Map ? this.mapToObject(value) : value;
        return obj;
      },
      {}
    ) as T extends string ? { [key: string]: any } : { [key: number]: any };
  }

  public objectToMap<T extends string | number, U, I extends boolean>(
    obj: T extends string ? { [key: string]: U } : { [key: number]: U },
    force?: I
  ): Map<I extends true ? number : string, U> {
    const map = new Map<I extends true ? number : string, U>();
    Object.keys(obj).forEach(key => {
      map.set(this.stringNumberConverter<typeof force>(key, force), obj[key]);
    });
    return map;
  }

  private stringNumberConverter<T>(
    value: string,
    toNumber: T
  ): T extends true ? number : string {
    return (toNumber ? parseInt(value, 10) : value) as T extends true
      ? number
      : string;
  }
}

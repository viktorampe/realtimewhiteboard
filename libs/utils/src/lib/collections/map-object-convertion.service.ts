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

  public objectToMap<
    T extends string | number,
    U extends boolean,
    I extends boolean,
    O extends boolean
  >(
    obj: T extends string ? { [key: string]: any } : { [key: number]: any },
    force?: U,
    convertSecondLevel?: I,
    forceSecondLevel?: O
  ): Map<
    U extends true ? number : string,
    I extends true
      ? O extends true
        ? Map<number, any>
        : Map<string, any>
      : any
  > {
    const map = new Map<
      U extends true ? number : string,
      I extends true
        ? O extends true
          ? Map<number, any>
          : Map<string, any>
        : any
    >();
    Object.keys(obj).forEach(key => {
      map.set(
        this.stringNumberConverter<typeof force>(key, force),
        convertSecondLevel
          ? this.objectToMap(obj[key], forceSecondLevel)
          : obj[key]
      );
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

import { InjectionToken } from '@angular/core';
export const FILTER_SERVICE_TOKEN = new InjectionToken('FilterService');
export type NestedPartial<T> = { [P in keyof T]?: NestedPartial<T[P]> };
export interface FilterServiceInterface {
  filter<T>(list: T[], filters: NestedPartial<T>, ignoreCase?: boolean): T[];
}

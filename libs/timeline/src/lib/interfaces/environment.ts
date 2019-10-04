import { InjectionToken } from '@angular/core';

export const ENVIRONMENT_API_TOKEN = new InjectionToken<
  EnvironmentApiInterface
>('EnvironmentAPI');

export interface EnvironmentApiInterface {
  APIBase: string;
}

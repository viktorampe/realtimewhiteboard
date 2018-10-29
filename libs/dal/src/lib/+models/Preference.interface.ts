export enum ALTERNATIVE_PLATFORM_USAGE {
  HOMESCHOOLING = 'homeschooling'
}

export interface PreferenceInterface {
  ALTERNATIVE_PLATFORM_USAGE?: ALTERNATIVE_PLATFORM_USAGE;
  REMEMBER_LOGIN?: boolean;
  RECEIVE_MESSAGES?: boolean;
}

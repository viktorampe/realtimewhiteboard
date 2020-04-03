import { InjectionToken } from '@angular/core';

export const WHITEBOARD_ELEMENT_ICON_MAPPING_TOKEN = new InjectionToken<{
  [icon: string]: string;
}>('WhiteboardEnvironmentIconMapping');

import { InjectionToken } from '@angular/core';

export interface EnvironmentUIInterface {
  useNavItemStyle?: boolean;
  useInfoPanelStyle?: boolean;
  useModalSideSheetStyle?: boolean;
}

export const ENVIRONMENT_UI_TOKEN = new InjectionToken('environmentUi');

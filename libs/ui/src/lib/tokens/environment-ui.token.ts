import { InjectionToken } from '@angular/core';

export interface EnvironmentUIInterface {
  useNavItemStyle?: boolean;
  useInfoPanelStyle?: boolean;
  footerHeight?: number;
  backdrop?: {
    safeMargin?: number;
  };
  useModalSideSheetStyle?: boolean;
}

export const ENVIRONMENT_UI_TOKEN = new InjectionToken('environmentUi');

import { InjectionToken } from '@angular/core';
import { UiOptionsInterface } from '../ui-options';

export interface EnvironmentUIInterface extends UiOptionsInterface {
  useNavItemStyle?: boolean;
  useInfoPanelStyle?: boolean;
  useModalSideSheetStyle?: boolean;
}

export const ENVIRONMENT_UI_TOKEN = new InjectionToken('environmentUi');

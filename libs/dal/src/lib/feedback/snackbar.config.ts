import { InjectionToken } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material';

export const SNACKBAR_DEFAULT_CONFIG_TOKEN = new InjectionToken(
  'SnackBarDefaultConfig'
);
export class SnackBarDefaultConfig extends MatSnackBarConfig {
  private setDefaults() {
    this.duration = 3000;
  }

  constructor() {
    super();
    this.setDefaults();
  }
}

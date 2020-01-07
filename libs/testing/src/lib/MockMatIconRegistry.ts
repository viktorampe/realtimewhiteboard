import { hot } from '@nrwl/angular/testing';

export class MockMatIconRegistry {
  public addSvgIcon() {}
  public addSvgIconInNamespace() {}
  public getDefaultFontSetClass() {}
  public getNamedSvgIcon(name?: string, namespace?: string) {
    const logRequestedIcons = false;
    if (logRequestedIcons) {
      console.log('icon requested:', name);
    }
    return hot('|');
  }
}

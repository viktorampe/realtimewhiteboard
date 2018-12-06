import { hot } from 'jasmine-marbles';

export class MockMatIconRegistry {
  public addSvgIcon() {}
  public addSvgIconInNamespace() {}
  public getNamedSvgIcon(name?: string, namespace?: string) {
    const logRequestedIcons = false;
    if (logRequestedIcons) {
      console.log('icon requested:', name);
    }
    return hot('|');
  }
}

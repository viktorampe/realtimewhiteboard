import { MethodLevelInterface } from '../+models/MethodLevel.interface';

export class MethodLevelFixture implements MethodLevelInterface {
  // defaults
  id = 1;
  label = 'Knikker';
  levelId = 1;
  methodId = 34;
  icon = 'katapult-knikker.svg';

  constructor(props: Partial<MethodLevelInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

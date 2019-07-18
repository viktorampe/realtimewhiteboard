import { DiaboloPhaseInterface } from '../+models';

export class DiaboloPhaseFixture implements DiaboloPhaseInterface {
  // defaults
  id = 1;
  name: 'phase_one';
  color: '#fff';
  icon: 'phaseIcon';
  phase: 1;

  constructor(props: Partial<DiaboloPhaseInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

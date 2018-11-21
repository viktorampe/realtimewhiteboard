import { ScormCMIMode } from '../results/enums/cmi-mode.enum';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';

export class CurrentExerciseFixture implements CurrentExerciseInterface {
  // defaults
  cmiMode = ScormCMIMode.CMI_MODE_NORMAL;
  saveToApi = true;
  url = 'tempurl';

  constructor(props: Partial<CurrentExerciseInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

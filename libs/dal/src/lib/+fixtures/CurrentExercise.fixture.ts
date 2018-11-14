import { ScormCMIMode } from '../exercise/exercise.service';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';

export class CurrentExerciseFixture implements CurrentExerciseInterface {
  // defaults
  eduContent = undefined;
  cmiMode = ScormCMIMode.CMI_MODE_NORMAL;
  result = undefined;
  saveToApi = true;
  url = 'tempurl';

  constructor(props: Partial<CurrentExerciseInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

import { ScormCmiMode } from '../+external-interfaces/scorm-api.interface';
import { CurrentExerciseInterface } from './../+state/current-exercise/current-exercise.reducer';

export class CurrentExerciseFixture implements CurrentExerciseInterface {
  // defaults
  cmiMode = ScormCmiMode.CMI_MODE_NORMAL;
  saveToApi = true;
  url = 'tempurl';

  constructor(props: Partial<CurrentExerciseInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

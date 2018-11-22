import { ScormCmiInterface, ScormCmiMode, ScormStatus } from '@campus/scorm';

export class ScormCmiFixture implements ScormCmiInterface {
  mode = ScormCmiMode.CMI_MODE_NORMAL;
  core = {
    score: {
      raw: 0,
      min: undefined,
      max: undefined
    },
    lesson_location: '',
    lesson_status: ScormStatus.STATUS_NOT_ATTEMPTED,
    total_time: '0000:00:00',
    session_time: '0000:00:00'
  };

  objectives: any;
  suspend_data: any;

  constructor(props: Partial<ScormCmiInterface> = {}) {
    Object.assign(this, props);
  }
}

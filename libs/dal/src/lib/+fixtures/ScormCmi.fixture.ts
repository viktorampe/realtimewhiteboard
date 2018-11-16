import { ScormCmiInterface, ScormCMIMode, ScormStatus } from '@campus/scorm';

export class ScormCmiFixture implements ScormCmiInterface {
  mode = ScormCMIMode.CMI_MODE_NORMAL;
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
  objectives = [
    {
      score: {
        raw: 0,
        min: undefined,
        max: undefined,
        scale: undefined
      },
      status: ScormStatus.STATUS_NOT_ATTEMPTED,
      id: 'points'
    }
  ];
  suspend_data = [];

  constructor(props: Partial<ScormCmiInterface> = {}) {
    Object.assign(this, props);
  }
}

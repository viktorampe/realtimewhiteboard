import { TeacherStudentInterface } from '../+models';

export class LinkedPersonFixture implements TeacherStudentInterface {
  // defaults
  created = new Date();

  constructor(props: Partial<TeacherStudentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

import { TeacherStudentInterface } from '../+models';

export class TeacherStudentFixture implements TeacherStudentInterface {
  // defaults
  created = new Date();

  constructor(props: Partial<TeacherStudentInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

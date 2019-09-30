import { LearningAreaInterface, MethodInterface } from '../+models';

export class MethodFixture implements MethodInterface {
  name: string;
  icon?: string;
  logoUrl?: string;
  experimental?: boolean;
  code?: string;
  id?: number;
  learningAreaId?: number;
  learningArea?: LearningAreaInterface;

  constructor(props: Partial<MethodFixture> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

import { MethodYearsInterface } from './method.interfaces';

export class MethodYearsFixture implements MethodYearsInterface {
  id = 1;
  logoUrl = 'katapult.svg';
  name = 'Katapult';
  learningAreaId = 19;
  years = [
    {
      id: 1,
      name: 'L1',
      bookId: 34
    },
    {
      id: 2,
      name: 'L2',
      bookId: 35
    }
  ];

  constructor(props: Partial<MethodYearsInterface> = {}) {
    // overwrite defaults
    Object.assign(this, props);
  }
}

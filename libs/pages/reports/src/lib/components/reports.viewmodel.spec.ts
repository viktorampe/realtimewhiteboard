import { ReportsViewModel } from './reports.viewmodel';
import { MockReportsViewModel } from './reports.viewmodel.mock';

let reportsViewModel: ReportsViewModel;

beforeEach(() => {
  reportsViewModel = new ReportsViewModel(new MockReportsViewModel());
});

test('it should return', () => {
  return;
});

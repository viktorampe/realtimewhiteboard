import { BundleDetailViewModel } from './bundle-detail.viewmodel';
import { DataConverterService } from './services/data-converter.service';

let bundleDetailViewModel: BundleDetailViewModel;
const dataconverterService = new DataConverterService();

beforeEach(() => {
  bundleDetailViewModel = new BundleDetailViewModel(dataconverterService);
});

test('it should return', () => {
  return;
});

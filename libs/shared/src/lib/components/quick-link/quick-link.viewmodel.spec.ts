import { TestBed } from '@angular/core/testing';
import { QuickLinkViewModel } from './quick-link.viewmodel';

describe('QuickLinkViewModel', () => {
  let quickLinkViewModel: QuickLinkViewModel;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [QuickLinkViewModel]
    });
    quickLinkViewModel = TestBed.get(QuickLinkViewModel);
  });

  describe('creation', () => {
    it('should be defined', () => {
      expect(quickLinkViewModel).toBeDefined();
    });
  });
});

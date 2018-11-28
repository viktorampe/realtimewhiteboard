import { inject, TestBed } from '@angular/core/testing';
import { NavItemService } from './nav-item-service';

describe('NavItemServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NavItemService]
    });
  });

  it('should be created', inject(
    [NavItemService],
    (service: NavItemService) => {
      expect(service).toBeTruthy();
    }
  ));
});

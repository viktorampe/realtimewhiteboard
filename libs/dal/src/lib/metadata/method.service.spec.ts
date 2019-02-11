import { inject, TestBed } from '@angular/core/testing';
import { MethodService } from './method.service';

describe('MethodService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MethodService]
    });
  });

  it('should be created', inject([MethodService], (service: MethodService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed } from '@angular/core/testing';
import { EduNetService } from './edu-net.service';

describe('EduNetService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EduNetService = TestBed.get(EduNetService);
    expect(service).toBeTruthy();
  });
});

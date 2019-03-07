import { TestBed } from '@angular/core/testing';

import { SchoolTypesService } from './school-types.service';

describe('SchoolTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchoolTypesService = TestBed.get(SchoolTypesService);
    expect(service).toBeTruthy();
  });
});

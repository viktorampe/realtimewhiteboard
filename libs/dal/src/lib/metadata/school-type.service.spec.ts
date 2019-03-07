import { TestBed } from '@angular/core/testing';
import { SchoolTypeService } from './school-type.service';

describe('SchoolTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SchoolTypeService = TestBed.get(SchoolTypeService);
    expect(service).toBeTruthy();
  });
});

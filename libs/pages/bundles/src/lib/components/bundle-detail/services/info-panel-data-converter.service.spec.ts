import { TestBed, inject } from '@angular/core/testing';

import { InfoPanelDataConverterService } from './info-panel-data-converter.service';

describe('InfoPanelDataConverterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InfoPanelDataConverterService]
    });
  });

  it('should be created', inject([InfoPanelDataConverterService], (service: InfoPanelDataConverterService) => {
    expect(service).toBeTruthy();
  }));
});

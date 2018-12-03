import { TestBed } from '@angular/core/testing';
import { WINDOW } from '@campus/browser';
import { ENVIRONMENT_API_BASE } from '../interfaces';
import { OpenStaticContentService } from './open-static-content.service';

describe('OpenStaticContentServiceService', () => {
  let service: OpenStaticContentService;
  let mockWindow = { open: jest.fn() };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: WINDOW, useValue: mockWindow },
        { provide: ENVIRONMENT_API_BASE, useValue: 'http://foo.bar:5000' }
      ]
    });

    service = TestBed.get(OpenStaticContentService);
    mockWindow = TestBed.get(WINDOW);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a window for the provided content', () => {
    service.open(1);
    expect(mockWindow.open).toHaveBeenCalledTimes(1);
    expect(mockWindow.open).toHaveBeenCalledWith(
      'http://foo.bar:5000/api/eduContents/1/redirectURL'
    );
  });
});

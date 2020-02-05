import { TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material';
import { WINDOW } from '@campus/browser';
import { EduContentFixture, UserContentFixture } from '@campus/dal';
import { configureTestSuite } from 'ng-bullet';
import { ContentPreviewDialogComponent } from '../../components';
import { ENVIRONMENT_API_TOKEN } from '../../interfaces';
import { OpenStaticContentService } from './open-static-content.service';

describe('OpenStaticContentServiceService', () => {
  let service: OpenStaticContentService;
  let mockWindow = { open: jest.fn() };
  let matDialog: MatDialog;
  const apiBase = 'http://foo.bar:5000';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: WINDOW, useValue: mockWindow },
        {
          provide: ENVIRONMENT_API_TOKEN,
          useValue: { APIBase: apiBase }
        },
        { provide: MatDialog, useValue: { open: () => {} } }
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(OpenStaticContentService);
    matDialog = TestBed.get(MatDialog);
    mockWindow = TestBed.get(WINDOW);
    mockWindow.open.mockReset();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should open a window for the provided content', () => {
    service.open(new EduContentFixture({ id: 1 }));
    expect(mockWindow.open).toHaveBeenCalledTimes(1);
    expect(mockWindow.open).toHaveBeenCalledWith(
      'http://foo.bar:5000/api/eduContents/1/redirectURL'
    );
  });

  it('should open a window with the correct link', () => {
    service.open(
      new UserContentFixture({ id: 2, link: 'http://www.frankdeboosere.be' })
    );
    expect(mockWindow.open).toHaveBeenCalledTimes(1);
    expect(mockWindow.open).toHaveBeenCalledWith(
      'http://www.frankdeboosere.be'
    );
  });

  it('should open a window for the provided content with the stream param', () => {
    service.open(new EduContentFixture({ id: 1 }), true);
    expect(mockWindow.open).toHaveBeenCalledTimes(1);
    expect(mockWindow.open).toHaveBeenCalledWith(
      'http://foo.bar:5000/api/eduContents/1/redirectURL?stream=true'
    );
  });

  it('should open a dialog instead of a window if openDialog is set', () => {
    jest.spyOn(matDialog, 'open');

    service.open(new EduContentFixture({ id: 1 }), false, true);

    expect(mockWindow.open).not.toHaveBeenCalled();
    expect(matDialog.open).toHaveBeenCalledWith(ContentPreviewDialogComponent, {
      data: { url: `${apiBase}/api/eduContents/${1}/redirectURL` }
    });
  });
});

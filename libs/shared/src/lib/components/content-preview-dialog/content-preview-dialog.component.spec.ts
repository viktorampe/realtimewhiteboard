import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { ContentPreviewDialogComponent } from '.';

describe('ContentPreviewDialogComponent', () => {
  let component: ContentPreviewDialogComponent;
  let fixture: ComponentFixture<ContentPreviewDialogComponent>;
  let matDialogRef: MatDialogRef<ContentPreviewDialogComponent>;

  const mockUrl = 'http://images.com/images/kippeboute.png';

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, MatDialogModule],
      declarations: [ContentPreviewDialogComponent],
      providers: [
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            url: mockUrl
          }
        },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    matDialogRef = TestBed.get(MatDialogRef);
    fixture = TestBed.createComponent(ContentPreviewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    it('should display the image url passed in the dialog data', () => {
      const img = fixture.debugElement.query(By.css('img'));

      expect(img.nativeElement.src).toBe(mockUrl);
    });

    it('should call close() when clicking close', () => {
      jest.spyOn(component, 'close');

      const closeButton = fixture.debugElement.query(
        By.css('.content-preview__dialog__actions__button__close')
      );
      closeButton.nativeElement.click();

      expect(component.close).toHaveBeenCalled();
    });
  });

  describe('methods', () => {
    describe('close()', () => {
      it('should close the matDialog', () => {
        jest.spyOn(matDialogRef, 'close');

        component.close();

        expect(matDialogRef.close).toHaveBeenCalled();
      });
    });
  });
});

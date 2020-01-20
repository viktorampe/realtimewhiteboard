import { ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import {
  MatDialogModule,
  MatDialogRef,
  MatProgressSpinnerModule,
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
      imports: [UiModule, MatDialogModule, MatProgressSpinnerModule],
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

    it('should show the spinner while the image is loading', fakeAsync(() => {
      component.loading = true;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('mat-spinner'));

      expect(spinner).toBeTruthy();
    }));

    it('should hide the spinner when the image finishes loading', fakeAsync(() => {
      component.loading = false;
      fixture.detectChanges();

      const spinner = fixture.debugElement.query(By.css('mat-spinner'));

      expect(spinner).toBeFalsy();
    }));

    it('should hide the image while it is loading', fakeAsync(() => {
      component.loading = true;
      fixture.detectChanges();

      const image = fixture.debugElement.query(By.css('img'));

      expect(image.nativeElement.attributes['hidden']).toBeTruthy();
    }));

    it('should hide the image when it errored', fakeAsync(() => {
      component.errored = true;
      fixture.detectChanges();

      const image = fixture.debugElement.query(By.css('img'));

      expect(image.nativeElement.attributes['hidden']).toBeTruthy();
    }));

    it('should show the image when it loaded', fakeAsync(() => {
      component.loading = false;
      component.errored = false;
      fixture.detectChanges();

      const image = fixture.debugElement.query(By.css('img'));

      expect(image.attributes['hidden']).toBeFalsy();
    }));

    it('should show an error message when the image loading errors', fakeAsync(() => {
      let errorMessage = fixture.debugElement.query(
        By.css('.content-preview__info-panel__load-error')
      );

      expect(errorMessage).toBeFalsy();

      component.errored = true;
      fixture.detectChanges();

      errorMessage = fixture.debugElement.query(
        By.css('.content-preview__info-panel__load-error')
      );

      expect(errorMessage).toBeTruthy();
    }));
  });

  describe('methods', () => {
    describe('close()', () => {
      it('should close the matDialog', () => {
        jest.spyOn(matDialogRef, 'close');

        component.close();

        expect(matDialogRef.close).toHaveBeenCalled();
      });
    });

    describe('imageErrored()', () => {
      it('should set errored to true and loading to false', () => {
        component.imageErrored();

        expect(component.errored).toBeTruthy();
        expect(component.loading).toBeFalsy();
      });
    });

    describe('imageLoaded()', () => {
      it('should set loading to false', () => {
        component.loading = true;
        component.imageLoaded();

        expect(component.loading).toBeFalsy();
      });
    });
  });
});

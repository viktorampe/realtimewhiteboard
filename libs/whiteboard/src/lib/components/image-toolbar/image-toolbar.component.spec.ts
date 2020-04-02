import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { ImageToolbarComponent } from './image-toolbar.component';

describe('ImageToolbarComponent', () => {
  let component: ImageToolbarComponent;
  let fixture: ComponentFixture<ImageToolbarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ],
      declarations: [ImageToolbarComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('event handlers', () => {
    it('clickRemove() should trigger remove event', () => {
      spyOn(component.remove, 'emit');
      component.clickRemove();
      expect(component.remove.emit).toHaveBeenCalled();
    });

    it('clickChoose() should trigger openFilePicker event', () => {
      spyOn(component.openFilePicker, 'emit');
      component.clickChoose();
      expect(component.openFilePicker.emit).toHaveBeenCalled();
    });
  });

  describe('toolbar options', () => {
    function getDeleteOption() {
      return fixture.debugElement.query(By.css('[data-cy="delete-image"]'));
    }

    it('should show a remove option when there is an image', () => {
      component.hasImage = true;
      fixture.detectChanges();

      expect(getDeleteOption).toBeTruthy();
    });

    it('should show not show a remove option when there is no image', () => {
      component.hasImage = false;
      fixture.detectChanges();

      expect(getDeleteOption()).toBeFalsy();
    });
  });
});

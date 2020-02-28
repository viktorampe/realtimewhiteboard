import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { ModeEnum } from '../../enums/mode.enum';
import { ImageToolbarComponent } from '../image-toolbar/image-toolbar.component';
import { CardImageComponent } from './card-image.component';

describe('CardImageComponent', () => {
  let component: CardImageComponent;
  let fixture: ComponentFixture<CardImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }],
      declarations: [CardImageComponent, ImageToolbarComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CardImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('image', () => {
    function getImage() {
      return fixture.debugElement.query(By.css('.card-image__image'));
    }

    it('should show an image', () => {
      component.imageUrl = 'foo.jpg';
      fixture.detectChanges();

      expect(getImage()).toBeTruthy();
    });

    it('should show not show an image', () => {
      component.imageUrl = null;
      fixture.detectChanges();

      expect(getImage()).toBeFalsy();
    });
  });

  describe('Image toolbar', () => {
    function getImageToolbar() {
      return fixture.debugElement.query(By.directive(ImageToolbarComponent));
    }

    it('should show image toolbar if mode is EditMode', () => {
      component.mode = ModeEnum.EDIT;
      fixture.detectChanges();

      expect(getImageToolbar()).toBeTruthy();
    });

    it('should not show image toolbar if mode is SelectedMode', () => {
      component.mode = ModeEnum.SELECTED;
      fixture.detectChanges();

      expect(getImageToolbar()).toBeFalsy();
    });
  });

  describe('event handlers', () => {
    it('removeImage() should trigger remove event', () => {
      spyOn(component.remove, 'emit');
      component.removeImage();
      expect(component.remove.emit).toHaveBeenCalled();
    });

    it('chooseImage() should trigger openFilePicker event', () => {
      spyOn(component.openFilePicker, 'emit');
      component.chooseImage();
      expect(component.openFilePicker.emit).toHaveBeenCalled();
    });
  });
});

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AUTH_SERVICE_TOKEN } from '@campus/dal';
import { ProfileViewModel } from '../profile.viewmodel';
import { MockProfileViewModel } from '../profile.viewmodel.mock';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProfileViewModel, useClass: MockProfileViewModel },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: { userId: 1 }
        }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ui', () => {
    it('should show file select form, but no cropper element', () => {
      const uploadFormEl = fixture.debugElement.query(By.css('.file-upload'));
      const cropperEl = fixture.debugElement.query(By.css('image-cropper'));

      expect(uploadFormEl).toBeTruthy();
      expect(cropperEl).toBeFalsy();
    });

    it('should show the cropper element, but not select form', async(() => {
      component.imgData.image = 'some_base64_encoded_image';

      fixture.detectChanges();
      fixture.whenStable().then(() => {
        const uploadFormEl = fixture.debugElement.query(By.css('.file-upload'));
        const cropperEl = fixture.debugElement.query(By.css('image-cropper'));
        expect(uploadFormEl).toBeFalsy();
        expect(cropperEl).toBeTruthy();
      });
    }));
  });
});

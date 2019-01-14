import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FilereaderService,
  FilereaderServiceInterface,
  FILEREADER_SERVICE_TOKEN
} from '@campus/browser';
import { AUTH_SERVICE_TOKEN } from '@campus/dal';
import { hot } from 'jasmine-marbles';
import { ProfileViewModel } from '../profile.viewmodel';
import { MockProfileViewModel } from '../profile.viewmodel.mock';
import { AvatarComponent } from './avatar.component';

xdescribe('AvatarComponent', () => {
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let spy: jest.SpyInstance;
  let filereaderService: FilereaderServiceInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProfileViewModel, useClass: MockProfileViewModel },
        {
          provide: AUTH_SERVICE_TOKEN,
          useValue: { userId: 1 }
        },
        { provide: FILEREADER_SERVICE_TOKEN, useClass: FilereaderService }
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

  describe('selectFileListener', () => {
    const mockFile: File = new File([''], 'filename.png', {
      type: 'image/png'
    });

    beforeAll(() => {
      filereaderService = TestBed.get(FILEREADER_SERVICE_TOKEN);
    });

    it('should load the image', async(() => {
      component.loadImage(mockFile);

      expect(filereaderService.loaded$).toBeObservable(
        hot('a', {
          a: ''
        })
      );
    }));

    it('should update imgData.error for invalid file type', () => {});

    it('should update imgData.error when read fails', () => {});
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

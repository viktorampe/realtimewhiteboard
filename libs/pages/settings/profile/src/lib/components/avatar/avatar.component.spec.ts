import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FilereaderService,
  FilereaderServiceInterface,
  FILEREADER_SERVICE_TOKEN,
  FILE_READER
} from '@campus/browser';
import { AUTH_SERVICE_TOKEN } from '@campus/dal';
import { hot } from '@nrwl/nx/testing';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BehaviorSubject } from 'rxjs';
import { ProfileViewModel } from '../profile.viewmodel';
import { MockProfileViewModel } from '../profile.viewmodel.mock';
import { AvatarComponent } from './avatar.component';

describe('AvatarComponent', () => {
  const mockFile = new File([''], 'filename.png', { type: 'image/png' });
  let component: AvatarComponent;
  let fixture: ComponentFixture<AvatarComponent>;
  let profileVM: ProfileViewModel;
  let filereaderService: FilereaderServiceInterface;
  let filereader: FileReader;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AvatarComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ProfileViewModel, useClass: MockProfileViewModel },
        { provide: AUTH_SERVICE_TOKEN, useValue: { userId: 1 } },
        { provide: FILEREADER_SERVICE_TOKEN, useClass: FilereaderService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvatarComponent);
    component = fixture.componentInstance;
    profileVM = TestBed.get(ProfileViewModel);
    filereaderService = TestBed.get(FILEREADER_SERVICE_TOKEN);
    filereader = TestBed.get(FILE_READER);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should map streams from viewmodel', () => {
    expect(component.currentUser$).toBe(profileVM.currentUser$);
  });

  it('should map streams from filereaderService', () => {
    expect(component.selectedImg$).toBe(filereaderService.loaded$);
    expect(component.loadError$).toBe(filereaderService.error$);
  });

  describe('loadImage', () => {
    afterEach(() => {
      jest.restoreAllMocks();
    });

    it('should load the image', () => {
      const mockProgressEvent = {
        target: { result: 'base64encoded-image' }
      } as unknown;
      filereader.onload(mockProgressEvent as ProgressEvent);

      expect(filereaderService.loaded$).toBeObservable(
        hot('a', {
          a: 'base64encoded-image'
        })
      );
    });

    it('should not try to load image when filetype is invalid', () => {
      const spyService = jest.spyOn(filereaderService, 'readAsDataURL');
      jest.spyOn(filereaderService, 'isFileTypeAllowed').mockReturnValue(false);
      component.loadImage(mockFile);

      expect(spyService).not.toHaveBeenCalled();
    });

    it('should try to load image when filetype is valid', () => {
      const spyRead = jest.spyOn(filereaderService, 'readAsDataURL');
      jest.spyOn(filereaderService, 'isFileTypeAllowed').mockReturnValue(true);
      component.loadImage(mockFile);

      expect(spyRead).toHaveBeenCalledWith(mockFile);
    });

    it('should call reset when selecting new image', () => {
      const spyReset = jest.spyOn(filereaderService, 'reset');
      component.loadImage(mockFile);

      expect(spyReset).toHaveBeenCalled();
    });
  });

  describe('fileListeners', () => {
    it('selectFileListener should call loadImage and reset inputfield', () => {
      const ev = {
        target: {
          files: [mockFile],
          value: 'filename.png'
        }
      } as unknown;
      const spyLoad = jest.spyOn(component, 'loadImage');
      component.selectFileListener(ev as Event);

      expect(spyLoad).toHaveBeenCalledWith(mockFile);
      expect(((ev as Event).target as HTMLInputElement).value).toBe('');
    });

    it('dropFileListener should call loadImage', () => {
      const ev = {
        dataTransfer: {
          files: [mockFile]
        },
        stopPropagation: jest.fn(),
        preventDefault: jest.fn()
      } as unknown;
      const spyLoad = jest.spyOn(component, 'loadImage');
      component.dropFileListener(ev as DragEvent);

      expect(spyLoad).toHaveBeenCalledWith(mockFile);
    });

    it('dragover should update uploadHoverState', () => {
      const ev = {
        stopPropagation: jest.fn(),
        preventDefault: jest.fn()
      } as unknown;

      component.dragOver(ev as DragEvent);
      expect(component.uploadHoverState).toBe(true);

      component.dragOver(ev as DragEvent, false);
      expect(component.uploadHoverState).toBe(false);
    });
  });

  describe('previewAvatar', () => {
    it('should update croppedImg$', () => {
      const mockCroppedEvent = {
        base64: 'base64encoded-image'
      } as ImageCroppedEvent;
      component.previewAvatar(mockCroppedEvent);

      expect(component.croppedImg$).toBeObservable(
        hot('a', {
          a: 'base64encoded-image'
        })
      );
    });
  });

  describe('saveAvatar', () => {
    it('should call profileViewModel.updateProfile', () => {
      const spyUpdate = jest.spyOn(profileVM, 'updateProfile');
      component.croppedImg$ = new BehaviorSubject('base64encoded-image');
      component.saveAvatar();

      expect(spyUpdate).toHaveBeenCalledWith({ avatar: 'base64encoded-image' });

      spyUpdate.mockReset();
      component.croppedImg$.next('other-base64encoded-image');
      component.saveAvatar();

      expect(spyUpdate).toHaveBeenCalledWith({
        avatar: 'other-base64encoded-image'
      });
    });
  });

  describe('resetAvatar', () => {
    it('should call filereaderService.reset', () => {
      const spyReset = jest.spyOn(filereaderService, 'reset');
      component.resetAvatar();

      expect(spyReset).toHaveBeenCalled();
    });
  });

  describe('ui', () => {
    it('should show file select form, but no cropper element', () => {
      const uploadFormEl = fixture.debugElement.query(By.css('.file-upload'));
      const cropperEl = fixture.debugElement.query(By.css('image-cropper'));

      expect(uploadFormEl).toBeTruthy();
      expect(cropperEl).toBeFalsy();
    });

    it('should show the cropper element, but not select form', async(() => {
      component.selectedImg$ = new BehaviorSubject('base64encoded-image');

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

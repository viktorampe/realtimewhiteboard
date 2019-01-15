import { fakeAsync, TestBed } from '@angular/core/testing';
import { hot } from '@nrwl/nx/testing';
import { FilereaderService, FILE_READER } from './filereader.service';

describe('FilereaderService', () => {
  const mockFile = new File([''], 'filename.png', { type: 'image/png' });
  let service: FilereaderService;
  let fileReader: FileReader;

  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [FilereaderService]
    })
  );

  beforeEach(() => {
    service = TestBed.get(FilereaderService);
    fileReader = TestBed.get(FILE_READER);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('isFileTypeAllowed', () => {
    it('should check filetype for file filename.png', () => {
      expect(service.isFileTypeAllowed(null)).toBe(false);
      expect(service.isFileTypeAllowed(mockFile)).toBe(true);
      expect(service.isFileTypeAllowed(mockFile, /\.(png)$/i)).toBe(true);
      expect(service.isFileTypeAllowed(mockFile, /\.(jpg)$/i)).toBe(false);
    });

    it('should push error message when filetype is blocked', () => {
      service.isFileTypeAllowed(mockFile);
      expect(service.error$).toBeObservable(hot('a', { a: null }));

      service.isFileTypeAllowed(null);
      expect(service.error$).toBeObservable(
        hot('a', {
          a:
            'Dit bestandstype wordt niet ondersteund. Selecteer een andere afbeelding.'
        })
      );
    });
  });

  describe('reset', () => {
    it('should call filereader.abort and empty streams', () => {
      jest.spyOn(fileReader, 'abort');
      service.reset();

      expect(service.loaded$).toBeObservable(hot('a', { a: null }));
      expect(service.error$).toBeObservable(hot('a', { a: null }));
    });
  });

  describe('filereader methods', () => {
    const blob = new Blob();
    let spyFilereader: jest.SpyInstance;

    it('should call fileReader.abort', () => {
      spyFilereader = jest.spyOn(fileReader, 'abort');
      service.abort();
      expect(spyFilereader).toHaveBeenCalled();
    });

    it('should call fileReader.readAsArrayBuffer', () => {
      spyFilereader = jest.spyOn(fileReader, 'readAsArrayBuffer');
      service.readAsArrayBuffer(blob);
      expect(spyFilereader).toHaveBeenCalledWith(blob);
    });

    it('should call fileReader.readAsBinaryString', () => {
      spyFilereader = jest.spyOn(fileReader, 'readAsBinaryString');
      service.readAsBinaryString(blob);
      expect(spyFilereader).toHaveBeenCalledWith(blob);
    });

    it('should call fileReader.readAsDataURL', () => {
      spyFilereader = jest.spyOn(fileReader, 'readAsDataURL');
      service.readAsDataURL(blob);
      expect(spyFilereader).toHaveBeenCalledWith(blob);
    });

    it('should call fileReader.readAsText', () => {
      spyFilereader = jest.spyOn(fileReader, 'readAsText');
      service.readAsText(blob);
      expect(spyFilereader).toHaveBeenCalledWith(blob, undefined);

      spyFilereader.mockReset();
      service.readAsText(blob, 'UTF-8');
      expect(spyFilereader).toHaveBeenCalledWith(blob, 'UTF-8');
    });
  });

  describe('event handlers', () => {
    it('onabort should set error$', () => {
      fileReader.onabort({} as ProgressEvent);
      expect(service.error$).toBeObservable(
        hot('a', {
          a:
            'Er was een probleem bij het lezen van het bestand. ' +
            'Probeer het opnieuw of selecteer een andere afbeelding.'
        })
      );
    });

    it('onerror should call abort', () => {
      jest.spyOn(fileReader, 'abort');
      fileReader.onerror({} as ProgressEvent);
      expect(fileReader.abort).toHaveBeenCalled();
    });

    it('onload should set loaded$ with image', () => {
      const mockProgressEvent = {
        target: { result: 'base64encoded-image' }
      } as unknown;
      fileReader.onload(mockProgressEvent as ProgressEvent);
      expect(service.loaded$).toBeObservable(
        hot('a', { a: 'base64encoded-image' })
      );
    });

    it('onloadstart should reset loaded$', fakeAsync(() => {
      fileReader.onloadstart({} as ProgressEvent);
      expect(service.loaded$).toBeObservable(hot('a', { a: null }));
    }));
  });
});

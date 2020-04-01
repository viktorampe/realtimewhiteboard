import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FileReaderServiceInterface } from './filereader.service.interface';

export function _fileReader() {
  return new FileReader();
}

export const FILE_READER = new InjectionToken<FileReader>('FileReaderToken', {
  providedIn: 'root',
  factory: _fileReader
});

export enum FileReaderError {
  INVALID_FILETYPE = 'invalid filetype',
  READ_ERROR = 'invalid file'
}

@Injectable({
  providedIn: 'root'
})
export class FileReaderService implements FileReaderServiceInterface {
  loaded$ = new BehaviorSubject<string | ArrayBuffer>(null);
  error$ = new BehaviorSubject<FileReaderError>(null);
  progress$ = new BehaviorSubject<number>(null);

  constructor(@Inject(FILE_READER) private fileReader) {
    this.setEventHandlers();
  }

  // service methods
  isFileTypeAllowed(
    file: File,
    regex: RegExp = /\.(jpe?g|png|gif)$/i
  ): boolean {
    if (!file || !regex.test(file.name)) {
      this.error$.next(FileReaderError.INVALID_FILETYPE);
      return false;
    }
    return true;
  }

  reset(): void {
    this.fileReader.abort();
    this.loaded$.next(null);
    this.error$.next(null);
  }

  // filereader method implementations
  abort() {
    this.fileReader.abort();
  }
  readAsArrayBuffer(blob: Blob): void {
    this.fileReader.readAsArrayBuffer(blob);
  }
  readAsBinaryString(blob: Blob): void {
    this.fileReader.readAsBinaryString(blob);
  }
  readAsDataURL(blob: Blob): void {
    this.fileReader.readAsDataURL(blob);
  }
  readAsText(blob: Blob, encoding?: string): void {
    this.fileReader.readAsText(blob, encoding);
  }

  private setEventHandlers() {
    this.fileReader.onload = this.onload; // fired when a read has completed successfully
    this.fileReader.onabort = this.onabort; // fired when a read has been aborted, for example because the program called FileReader.abort()
    this.fileReader.onerror = this.onerror; // fired when the read failed due to an error
    this.fileReader.onloadstart = this.onloadstart; // fired when a read has started
    this.fileReader.onprogress = this.onprogress; // fired periodically as data is read
  }

  // event handlers
  // use arrow functions to maintain 'this' scope, because FileReader applies his own scope
  private onabort = (ev: ProgressEvent): void => {
    this.error$.next(FileReaderError.READ_ERROR);
  };
  private onerror = (ev: ProgressEvent): void => {
    this.fileReader.abort();
  };
  private onload = (ev: ProgressEvent): void => {
    this.loaded$.next((ev.target as FileReader).result);
  };
  private onloadstart = (ev: ProgressEvent): void => {
    this.loaded$.next(null);
  };

  private onprogress = (ev: ProgressEvent): void => {
    if (ev.lengthComputable) {
      const progress = (ev.loaded / ev.total) * 100;
      this.progress$.next(progress);
    }
  };
}

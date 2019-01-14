import { Inject, Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FilereaderServiceInterface } from './filereader.service.interface';

const FILE_READER = new InjectionToken<FileReader>('FileReaderToken', {
  providedIn: 'root',
  factory: () => new FileReader()
});

@Injectable({
  providedIn: 'root'
})
export class FilereaderService implements FilereaderServiceInterface {
  loaded$: BehaviorSubject<string> = new BehaviorSubject<string>(null);
  error$: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  constructor(@Inject(FILE_READER) private fileReader: FileReader) {
    this.setEventHandlers();
  }

  // service methods
  isFileTypeAllowed(
    file: File,
    regex: RegExp = /\.(jpe?g|png|gif)$/i
  ): boolean {
    if (!file || !regex.test(file.name)) {
      this.error$.next(
        'Dit bestandstype wordt niet ondersteund. Selecteer een andere afbeelding.'
      );
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
    this.fileReader.onload = this.onload;
    this.fileReader.onabort = this.onabort;
    this.fileReader.onerror = this.onerror;
    this.fileReader.onloadstart = this.onloadstart;
  }

  // event handlers
  // use arrow functions to maintain 'this' scope, because FileReader applies his own scope
  private onabort = (ev: ProgressEvent): void => {
    this.error$.next(
      'Er was een probleem bij het lezen van het bestand. ' +
        'Probeer het opnieuw of selecteer een andere afbeelding.'
    );
  };
  private onerror = (ev: ProgressEvent): void => {
    this.fileReader.abort();
  };
  private onload = (ev: ProgressEvent): void => {
    // this.loaded$.next((ev.target as FileReader).result as string);
    // console.log(this.fileReader);
    // console.log(ev.target);
    this.loaded$.next(this.fileReader.result as string);
  };
  private onloadstart = (ev: ProgressEvent): void => {
    this.loaded$.next(null);
  };
}

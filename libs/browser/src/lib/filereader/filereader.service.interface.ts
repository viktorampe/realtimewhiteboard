import { InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';

export type FilereaderHandler =
  | ((this: FileReader, ev: ProgressEvent) => any)
  | null;

export const FILEREADER_SERVICE_TOKEN = new InjectionToken(
  'browser filereader service'
);

export interface FilereaderServiceInterface {
  loaded$: Observable<string>;
  error$: Observable<string>;

  // service methods
  isFileTypeAllowed(file: File, regex?: RegExp): boolean;
  reset(): void;

  // filereader method implementations
  abort(): void;
  readAsArrayBuffer(blob: Blob): void;
  readAsBinaryString(blob: Blob): void;
  readAsDataURL(blob: Blob): void;
  readAsText(blob: Blob, encoding?: string): void;
}

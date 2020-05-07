import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FullscreenService {
  isFullscreen$ = new BehaviorSubject<boolean>(false);

  constructor() {}

  setFullscreen(isFS: boolean) {
    this.isFullscreen$.next(isFS);
  }
}

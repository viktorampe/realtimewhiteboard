import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { ProfileViewModel } from './profile.viewmodel';

@Injectable()
export class ProfileResolver implements Resolve<boolean> {
  constructor(private profileViewModel: ProfileViewModel) {}

  resolve(): Observable<boolean> {
    return this.profileViewModel.initialize().pipe(take(1));
  }
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { MockProfileViewModel } from './profile.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  public currentUserProfile$: Observable<UserProfileInterface>;

  constructor(private mockProfileViewModel: MockProfileViewModel) {
    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    this.currentUserProfile$ = this.mockProfileViewModel.currentUserProfile$;
  }
}

// TODO: move to Dal? State?
export interface UserProfileInterface {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password?: string;
  avatar?: string; //base64 encode image
}

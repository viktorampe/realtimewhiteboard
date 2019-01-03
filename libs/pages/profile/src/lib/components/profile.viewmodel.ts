import { Injectable } from '@angular/core';
import { PersonInterface } from '@campus/dal';
import { Observable } from 'rxjs';
import { MockProfileViewModel } from './profile.viewmodel.mock';

@Injectable({
  providedIn: 'root'
})
export class ProfileViewModel {
  public currentUser$: Observable<Partial<PersonInterface>>;

  constructor(private mockProfileViewModel: MockProfileViewModel) {
    this.setPresentationStreams();
  }

  private setPresentationStreams(): void {
    this.currentUser$ = this.mockProfileViewModel.currentUser$;
  }
}

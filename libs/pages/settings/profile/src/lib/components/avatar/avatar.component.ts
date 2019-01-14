import { Component, Inject, OnInit } from '@angular/core';
import {
  FilereaderServiceInterface,
  FILEREADER_SERVICE_TOKEN
} from '@campus/browser';
import { PersonInterface } from '@campus/dal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { BehaviorSubject, Observable } from 'rxjs';
import { take, tap } from 'rxjs/operators';
import { ProfileViewModel } from '../profile.viewmodel';

@Component({
  selector: 'campus-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  currentUser$: Observable<PersonInterface>;

  selectedImg$: Observable<string>;
  croppedImg$: BehaviorSubject<string>;
  loadError$: Observable<string>;
  uploadHoverState: boolean;

  constructor(
    private profileViewModel: ProfileViewModel,
    @Inject(FILEREADER_SERVICE_TOKEN)
    private filereaderService: FilereaderServiceInterface
  ) {}

  ngOnInit() {
    this.loadOutputStreams();
  }

  selectFileListener(event: Event) {
    const el = event.target as HTMLInputElement;
    const file: File = el.files[0];
    this.loadImage(file);

    el.value = ''; // clear selected file from input
  }

  dropFileListener(event: DragEvent) {
    this.dragOver(event, false);

    const file: File = event.dataTransfer.files[0];
    this.loadImage(file);
  }

  dragOver(event: DragEvent, hover: boolean = true) {
    event.stopPropagation();
    event.preventDefault();
    this.uploadHoverState = hover;
  }

  previewAvatar(event: ImageCroppedEvent): void {
    this.croppedImg$.next(event.base64);
  }

  saveAvatar(): void {
    this.croppedImg$
      .pipe(
        tap(() => console.log('subscribed')),
        take(1)
      )
      .subscribe(avatar => {
        this.profileViewModel.updateProfile({ avatar });
      });
  }

  resetAvatar(): void {
    this.filereaderService.reset();
  }

  private loadOutputStreams(): void {
    this.currentUser$ = this.profileViewModel.currentUser$;
    this.selectedImg$ = this.filereaderService.loaded$;
    this.loadError$ = this.filereaderService.error$;
    this.croppedImg$ = new BehaviorSubject(null);
  }

  loadImage(file: File) {
    this.filereaderService.reset();

    if (!this.filereaderService.isFileTypeAllowed(file)) {
      return;
    }

    this.filereaderService.readAsDataURL(file);
  }
}

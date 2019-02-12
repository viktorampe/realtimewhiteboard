import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, Inject, OnInit } from '@angular/core';
import {
  FileReaderError,
  FileReaderServiceInterface,
  FILEREADER_SERVICE_TOKEN
} from '@campus/browser';
import { PersonInterface } from '@campus/dal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ProfileViewModel } from '../profile.viewmodel';

@Component({
  selector: 'campus-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  currentUser$: Observable<PersonInterface>;
  isSmallScreen$: Observable<boolean>;

  selectedImg$: Observable<string | ArrayBuffer>;
  loadError$: Observable<string>;
  croppedImg: string;
  uploadHoverState: boolean;

  constructor(
    private breakPointObserver: BreakpointObserver,
    private profileViewModel: ProfileViewModel,
    @Inject(FILEREADER_SERVICE_TOKEN)
    private fileReaderService: FileReaderServiceInterface
  ) {}

  ngOnInit() {
    this.loadOutputStreams();
  }

  selectFileListener(event: Event): void {
    const el = event.target as HTMLInputElement;
    const file: File = el.files[0];
    if (!file) {
      return;
    }
    this.loadImage(file);

    el.value = ''; // clear selected file from input
  }

  dropFileListener(event: DragEvent): void {
    this.dragOver(event, false);

    const file: File = event.dataTransfer.files[0];
    this.loadImage(file);
  }

  dragOver(event: DragEvent, hover: boolean = true): void {
    event.stopPropagation();
    event.preventDefault();
    this.uploadHoverState = hover;
  }

  loadImage(file: File): void {
    this.fileReaderService.reset();
    if (!this.fileReaderService.isFileTypeAllowed(file)) {
      return;
    }

    this.fileReaderService.readAsDataURL(file);
  }

  previewAvatar(event: ImageCroppedEvent): void {
    this.croppedImg = event.base64;
  }

  saveAvatar(): void {
    this.profileViewModel.updateProfile({ avatar: this.croppedImg });
    this.resetAvatar();
  }

  resetAvatar(): void {
    this.fileReaderService.reset();
  }

  private loadOutputStreams(): void {
    this.currentUser$ = this.profileViewModel.currentUser$;
    this.isSmallScreen$ = this.breakPointObserver
      .observe([Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(map(result => !result.matches));
    this.selectedImg$ = this.fileReaderService.loaded$;
    this.loadError$ = this.fileReaderService.error$.pipe(
      map(this.setErrorMessage)
    );
  }

  private setErrorMessage(err: FileReaderError): string {
    switch (err) {
      case FileReaderError.INVALID_FILETYPE:
        return 'Dit bestandstype wordt niet ondersteund. Selecteer een andere afbeelding.';
      case FileReaderError.READ_ERROR:
        return 'Er was een probleem bij het lezen van het bestand. Probeer het opnieuw of selecteer een andere afbeelding.';
    }
    return err;
  }
}

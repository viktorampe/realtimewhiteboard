import { Component, OnInit } from '@angular/core';
import { PersonInterface } from '@campus/dal';
import { ImageCroppedEvent } from 'ngx-image-cropper';
import { Observable } from 'rxjs';
import { ProfileViewModel } from '../profile.viewmodel';

@Component({
  selector: 'campus-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  currentUser$: Observable<PersonInterface>;

  imgData: { image?: string; cropped?: string; error?: string } = {};
  uploadHoverState: boolean;
  private allowedImgRegex = /\.(jpe?g|png|gif)$/i;

  constructor(private profileViewModel: ProfileViewModel) {}

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
    this.imgData.cropped = event.base64;
  }

  saveAvatar(): void {
    this.profileViewModel.updateProfile({ avatar: this.imgData.cropped });
  }

  resetAvatar(): void {
    this.imgData = {};
  }

  private loadOutputStreams(): void {
    this.currentUser$ = this.profileViewModel.currentUser$;
  }

  private loadImage(file: File) {
    this.imgData.error = null;

    if (!file) return;
    if (!this.allowedImgRegex.test(file.name)) {
      this.imgData.error =
        'Dit bestandstype wordt niet ondersteund. Selecteer een andere afbeelding.';
      return;
    }

    const myReader: FileReader = new FileReader();
    console.log(myReader);
    myReader.onloadend = (loadEvent: ProgressEvent) => {
      this.imgData.image = (loadEvent.target as FileReader).result as string;
    };
    myReader.onerror = () => {
      myReader.abort();
    };
    myReader.onabort = () => {
      this.imgData.error =
        'Er was een probleem bij het lezen van het bestand. Probeer het opnieuw of selecteer een andere afbeelding.';
    };
    myReader.readAsDataURL(file);
  }
}

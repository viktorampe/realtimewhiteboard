import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonInterface } from '@campus/dal';
import {
  CropperDrawSettings,
  CropperSettings,
  ImageCropperComponent
} from 'ngx-img-cropper';
import { Observable } from 'rxjs';
import { ProfileViewModel } from '../profile.viewmodel';

@Component({
  selector: 'campus-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  currentUser$: Observable<PersonInterface>;
  cropperSettings: CropperSettings;
  imgData: any;
  uploadHoverState: boolean;
  @ViewChild('cropper') cropper: ImageCropperComponent;

  constructor(private profileViewModel: ProfileViewModel) {}

  ngOnInit() {
    this.loadOutputStreams();
    this.initCropper();
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

  saveAvatar(): void {
    this.profileViewModel.updateProfile({ avatar: this.imgData.image });
  }

  resetAvatar(): void {
    delete this.imgData.image;
  }

  private loadOutputStreams(): void {
    this.currentUser$ = this.profileViewModel.currentUser$;
  }

  private initCropper() {
    this.imgData = {};
    this.cropperSettings = new CropperSettings({
      canvasWidth: 300,
      canvasHeight: 200,
      width: 200,
      height: 200,
      croppedWidth: 200,
      croppedHeight: 200,
      touchRadius: 15,
      centerTouchRadius: 20,
      noFileInput: true,
      cropperDrawSettings: <CropperDrawSettings>{
        strokeWidth: 1
      },
      // allowedFilesRegex: /\.(jpe?g|png|gif)$/i,
      fileType: 'image/jpeg',
      compressRatio: 0.7,
      markerSizeMultiplier: 0.4,
      rounded: true
    });
  }

  private loadImage(file: File) {
    if (!file) return;
    if (!this.cropperSettings.allowedFilesRegex.test(file.name)) return;

    const image: HTMLImageElement = new Image();
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: ProgressEvent) => {
      image.src = (loadEvent.target as FileReader).result as string;
      this.cropper.setImage(image);
    };
    myReader.readAsDataURL(file);
  }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import {
  CropperDrawSettings,
  CropperSettings,
  ImageCropperComponent
} from 'ngx-img-cropper';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'campus-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  cropperSettings: CropperSettings;
  imgData: any;

  @ViewChild('cropper') cropper: ImageCropperComponent;

  avatar: string = '';
  currentUser$: Observable<PersonInterface> = new BehaviorSubject(
    new PersonFixture({ avatar: this.avatar })
  );

  constructor() {}

  ngOnInit() {
    this.cropperSettings = new CropperSettings({
      canvasWidth: 200,
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
      // allowedFilesRegex: /.(jpe?g|png|gif)$/i,
      fileType: 'image/jpeg',
      compressRatio: 0.7,
      markerSizeMultiplier: 0.4,
      rounded: true
    });
    this.imgData = {};
  }

  fileChangeListener(event: Event) {
    const file: File = (event.target as HTMLInputElement).files[0];
    this.loadImage(file);
  }

  fileDropListener(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();

    const file: File = event.dataTransfer.files[0];
    this.loadImage(file);
  }

  dragOver(event: DragEvent) {
    event.stopPropagation();
    event.preventDefault();
  }

  private loadImage(file: File) {
    if (!file) return;

    if (!this.cropperSettings.allowedFilesRegex.test(file.name)) {
      return console.log('not an image');
    }

    const image: HTMLImageElement = new Image();
    const myReader: FileReader = new FileReader();
    myReader.onloadend = (loadEvent: any) => {
      image.src = loadEvent.target.result;
      this.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }
}

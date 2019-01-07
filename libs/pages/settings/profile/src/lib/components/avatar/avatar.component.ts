import { Component, OnInit, ViewChild } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { CropperSettings, ImageCropperComponent } from 'ngx-img-cropper';
import { BehaviorSubject, Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'campus-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss']
})
export class AvatarComponent implements OnInit {
  cropperSettings: CropperSettings;
  imgData: any;

  @ViewChild('cropper') cropper: ImageCropperComponent;

  currentUser$: Observable<PersonInterface> = new BehaviorSubject(
    new PersonFixture()
  );

  constructor() {}

  ngOnInit() {
    this.cropperSettings = new CropperSettings({
      width: 200,
      height: 200,
      croppedWidth: 170,
      croppedHeight: 170,
      canvasWidth: 200,
      canvasHeight: 200,
      rounded: true,
      noFileInput: true
    });
    this.imgData = {};

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user.avatar) {
        this.imgData.image = user.avatar;
      }
    });
  }

  fileChangeListener($event) {
    var image: any = new Image();
    var file: File = $event.target.files[0];
    var myReader: FileReader = new FileReader();
    var that = this;
    myReader.onloadend = function(loadEvent: any) {
      image.src = loadEvent.target.result;
      that.cropper.setImage(image);
    };

    myReader.readAsDataURL(file);
  }
}

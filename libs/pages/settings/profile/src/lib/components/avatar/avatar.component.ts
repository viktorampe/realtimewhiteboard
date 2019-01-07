import { Component, OnInit } from '@angular/core';
import { PersonFixture, PersonInterface } from '@campus/dal';
import { CropperSettings } from 'ngx-img-cropper';
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
      rounded: true
    });
    this.imgData = {};

    this.currentUser$.pipe(take(1)).subscribe(user => {
      if (user.avatar) {
        this.imgData.image = user.avatar;
      }
    });
  }
}

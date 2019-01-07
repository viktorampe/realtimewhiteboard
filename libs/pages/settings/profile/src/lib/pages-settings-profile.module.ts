import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,

    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
      {
        path: 'avatar',
        children: [{ path: '', pathMatch: 'full', component: AvatarComponent }]
      }
    ])
  ],
  declarations: [AvatarComponent, ImageCropperComponent]
})
export class PagesSettingsProfileModule {}

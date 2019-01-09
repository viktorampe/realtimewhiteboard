import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { ImageCropperComponent } from 'ngx-img-cropper';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,

    RouterModule.forChild([
      /* {path: '', pathMatch: 'full', component: InsertYourComponentHere} */
      {
        path: 'avatar',
        children: [{ path: '', pathMatch: 'full', component: AvatarComponent }],
        data: {
          breadcrumbText: 'avatar'
        }
      }
    ])
  ],
  declarations: [AvatarComponent, ImageCropperComponent]
})
export class PagesSettingsProfileModule {}

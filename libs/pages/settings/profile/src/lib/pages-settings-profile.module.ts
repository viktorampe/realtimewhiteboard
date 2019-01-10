import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarComponent } from './components/avatar/avatar.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ImageCropperModule,
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
  declarations: [AvatarComponent]
})
export class PagesSettingsProfileModule {}

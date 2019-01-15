import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FileReaderService, FILEREADER_SERVICE_TOKEN } from '@campus/browser';
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
  providers: [
    { provide: FILEREADER_SERVICE_TOKEN, useClass: FileReaderService }
  ],
  declarations: [AvatarComponent]
})
export class PagesSettingsProfileModule {}

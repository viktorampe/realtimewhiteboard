import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { FileReaderService, FILEREADER_SERVICE_TOKEN } from '@campus/browser';
import { UiModule } from '@campus/ui';
import { ImageCropperModule } from 'ngx-image-cropper';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';
import { ProfileComponent } from './components/profile/profile.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    ImageCropperModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProfileComponent },
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
  declarations: [AvatarComponent, ProfileFormComponent, ProfileComponent]
})
export class PagesSettingsProfileModule {}

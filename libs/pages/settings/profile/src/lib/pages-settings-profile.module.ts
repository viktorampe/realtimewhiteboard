import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { ProfileFormComponent } from './components/profile-form/profile-form.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: ProfileFormComponent }
    ]),
    MatFormFieldModule,
    MatInputModule
  ],
  declarations: [ProfileFormComponent]
})
export class PagesSettingsProfileModule {}

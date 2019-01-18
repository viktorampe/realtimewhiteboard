import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { CoupledTeachersComponent } from './lib/coupled-teachers/components/coupled-teachers.component';
import { CoupledTeachersResolver } from './coupled-teachers.resolver';
import { PagesSettingsCoupledTeachersRoutingModule } from './lib/coupled-teachers/pages-settings-coupled-teachers-routing.module';

@NgModule({
  declarations: [CoupledTeachersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    MatFormFieldModule,
    MatInputModule,
    PagesSettingsCoupledTeachersRoutingModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: null,
        resolve: { isResolved: CoupledTeachersResolver }
      }
    ])
  ]
})
export class PagesSettingsCoupledTeachersModule {}

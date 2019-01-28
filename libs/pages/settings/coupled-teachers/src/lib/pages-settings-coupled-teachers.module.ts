import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { CoupledTeachersResolver } from './components/coupled-teachers.resolver';
import { CoupledTeachersComponent } from './components/coupled-teachers/coupled-teachers.component';

@NgModule({
  declarations: [CoupledTeachersComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UiModule,
    MatFormFieldModule,
    MatInputModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: CoupledTeachersComponent,
        resolve: { isResolved: CoupledTeachersResolver },
        runGuardsAndResolvers: 'always'
      }
    ])
  ]
})
export class PagesSettingsCoupledTeachersModule {}

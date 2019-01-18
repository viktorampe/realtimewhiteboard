import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoupledTeachersResolver } from './coupled-teachers.resolver';

@NgModule({
  imports: [
    CommonModule,

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

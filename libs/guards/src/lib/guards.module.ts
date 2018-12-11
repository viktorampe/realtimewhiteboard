import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from './can-load/authentication.guard';
import { CoupledTeacherGuard } from './can-load/coupled-teacher.guard';

@NgModule({
  imports: [CommonModule],
  providers: [CoupledTeacherGuard, AuthenticationGuard]
})
export class GuardsModule {}

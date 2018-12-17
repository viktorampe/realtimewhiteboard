import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from './can-activate/authentication.guard';
import { CoupledTeacherGuard } from './can-activate/coupled-teacher.guard';

@NgModule({
  imports: [CommonModule],
  providers: [CoupledTeacherGuard, AuthenticationGuard]
})
export class GuardsModule {}

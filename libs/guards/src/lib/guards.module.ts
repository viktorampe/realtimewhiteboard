import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CoupledTeacherGuard } from './can-load/coupled-teacher.guard';

@NgModule({
  imports: [CommonModule],
  providers: [CoupledTeacherGuard]
})
export class GuardsModule {}

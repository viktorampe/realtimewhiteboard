import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from './can-activate/authentication.guard';
import { CoupledTeacherGuard } from './can-activate/coupled-teacher.guard';
import { PermissionGuard } from './can-activate/permission.guard';
import { RedirectionGuard } from './can-activate/redirection-guard';

@NgModule({
  imports: [CommonModule],
  providers: [
    CoupledTeacherGuard,
    AuthenticationGuard,
    PermissionGuard,
    RedirectionGuard
  ]
})
export class GuardsModule {}

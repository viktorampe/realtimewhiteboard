import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AllowedMethodGuard } from './can-activate/allowed-method.guard';
import { AuthenticationGuard } from './can-activate/authentication.guard';
import { CoupledTeacherGuard } from './can-activate/coupled-teacher.guard';
import { PermissionGuard } from './can-activate/permission.guard';
import { TermPrivacyGuard } from './can-activate/term-privacy.guard';

@NgModule({
  imports: [CommonModule],
  providers: [
    CoupledTeacherGuard,
    AuthenticationGuard,
    PermissionGuard,
    TermPrivacyGuard,
    AllowedMethodGuard
  ]
})
export class GuardsModule {}

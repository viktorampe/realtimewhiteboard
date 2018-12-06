import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@campus/shared';
import { ErrorComponent } from './error/error.component';
import { PagesErrorRoutingModule } from './error/pages-error-routing.module';

@NgModule({
  imports: [CommonModule, PagesErrorRoutingModule, SharedModule],
  declarations: [ErrorComponent]
})
export class PagesErrorModule {}

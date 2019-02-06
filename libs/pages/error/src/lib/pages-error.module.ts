import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { ErrorComponent } from './error/error.component';
import { PagesErrorRoutingModule } from './error/pages-error-routing.module';

@NgModule({
  imports: [CommonModule, PagesErrorRoutingModule, SharedModule, UiModule],
  declarations: [ErrorComponent]
})
export class PagesErrorModule {}

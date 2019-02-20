import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UiModule } from '@campus/ui';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';

@NgModule({
  imports: [CommonModule, UiModule],
  declarations: [BreadcrumbFilterComponent],
  exports: [BreadcrumbFilterComponent]
})
export class SearchModule {}

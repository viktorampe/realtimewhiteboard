import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';

@NgModule({
  imports: [CommonModule],
  declarations: [BreadcrumbFilterComponent],
  exports: [BreadcrumbFilterComponent]
})
export class SearchModule {}

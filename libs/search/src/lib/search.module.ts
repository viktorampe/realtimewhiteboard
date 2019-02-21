import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatSelectModule } from '@angular/material';
import { UiModule } from '@campus/ui';
import { BreadcrumbFilterComponent } from './components/breadcrumb-filter/breadcrumb-filter.component';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatBadgeModule
  ],
  declarations: [BreadcrumbFilterComponent, SelectFilterComponent],
  exports: [BreadcrumbFilterComponent, SelectFilterComponent]
})
export class SearchModule {}

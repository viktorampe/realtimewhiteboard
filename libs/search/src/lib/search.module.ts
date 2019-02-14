import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatSelectModule } from '@angular/material';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [CommonModule, MatSelectModule],
  declarations: [SelectFilterComponent],
  exports: [SelectFilterComponent]
})
export class SearchModule {}

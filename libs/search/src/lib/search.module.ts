import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectFilterComponent } from './components/select-filter-component/select-filter.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SelectFilterComponent],
  exports: [SelectFilterComponent]
})
export class SearchModule {}

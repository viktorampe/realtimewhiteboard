import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CheckboxLineFilterComponent } from './checkbox-line-filter-component/checkbox-line-filter-component';

@NgModule({
  imports: [CommonModule],
  declarations: [CheckboxLineFilterComponent],
  exports: [CheckboxLineFilterComponent]
})
export class SearchModule {}

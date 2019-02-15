import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material';
import { CheckboxLineFilterComponent } from './checkbox-line-filter-component/checkbox-line-filter-component';

@NgModule({
  imports: [CommonModule, MatCheckboxModule],
  declarations: [CheckboxLineFilterComponent],
  exports: [CheckboxLineFilterComponent]
})
export class SearchModule {}

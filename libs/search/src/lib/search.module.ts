import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material';
import { CheckboxLineFilterComponent } from './components/checkbox-line-filter/checkbox-line-filter-component';

@NgModule({
  imports: [CommonModule, MatCheckboxModule],
  declarations: [CheckboxLineFilterComponent],
  exports: [CheckboxLineFilterComponent]
})
export class SearchModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatCheckboxModule } from '@angular/material';
import { CheckboxListFilterComponentComponent } from './components/checkbox-list-filter-component/checkbox-list-filter-component.component';

@NgModule({
  imports: [CommonModule, MatCheckboxModule],
  declarations: [CheckboxListFilterComponentComponent],
  exports: [CheckboxListFilterComponentComponent]
})
export class SearchModule {}

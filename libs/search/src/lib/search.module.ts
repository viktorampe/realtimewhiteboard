import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SelectFilterComponentComponent } from './components/select-filter-component/select-filter-component.component';

@NgModule({
  imports: [CommonModule],
  declarations: [SelectFilterComponentComponent],
  exports: [SelectFilterComponentComponent]
})
export class SearchModule {}

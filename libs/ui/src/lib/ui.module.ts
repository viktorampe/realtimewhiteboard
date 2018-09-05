import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { FilterTextInputComponent } from './filter/input/filter-text-input/filter-text-input.component';

@NgModule({
  imports: [CommonModule, ReactiveFormsModule],
  declarations: [FilterTextInputComponent],
  exports: [FilterTextInputComponent]
})
export class UiModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SearchTestModule } from './search-test-module';

@NgModule({
  imports: [CommonModule],
  exports: [SearchTestModule]
})
export class TestingModule {}

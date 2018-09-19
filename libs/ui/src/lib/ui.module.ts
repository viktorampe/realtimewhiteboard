import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view/list-view.component';
import { ListItemDirective } from './list-view/list-item/list-item.directive';

@NgModule({
  imports: [CommonModule],
  declarations: [ListViewComponent, ListItemDirective],
  exports: [ListViewComponent, ListItemDirective]
})
export class UiModule {}

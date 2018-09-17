import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListViewComponent } from './list-view/list-view.component';

import { MatListModule, MatGridListModule } from '@angular/material';
import { ListItemComponent } from './list-view/list-item/list-item.component';

@NgModule({
  imports: [CommonModule, MatListModule, MatGridListModule],
  declarations: [ListViewComponent, ListItemComponent],
  exports: [
    ListViewComponent,
    MatListModule,
    MatGridListModule,
    ListItemComponent
  ]
})
export class UiModule {}

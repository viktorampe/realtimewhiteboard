import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { FolderComponent } from './folder/folder.component';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';

@NgModule({
  imports: [CommonModule, RoundProgressModule],
  declarations: [FolderComponent, FolderDetailsDirective],
  exports: [FolderComponent, FolderDetailsDirective]
})
export class UiModule {}

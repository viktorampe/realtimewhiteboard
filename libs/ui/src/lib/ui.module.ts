import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RoundProgressModule } from 'angular-svg-round-progressbar';
import { FolderProgressIndicatorComponent } from './folder/components/folder-progress-indicator/folder-progress-indicator.component';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';
import { FolderComponent } from './folder/folder.component';

@NgModule({
  imports: [CommonModule, RoundProgressModule],
  declarations: [
    FolderComponent,
    FolderDetailsDirective,
    FolderProgressIndicatorComponent
  ],
  exports: [
    FolderComponent,
    FolderDetailsDirective,
    FolderProgressIndicatorComponent
  ]
})
export class UiModule {}

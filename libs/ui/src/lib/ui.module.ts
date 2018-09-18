import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FolderProgressIndicatorComponent } from './folder/components/folder-progress-indicator/folder-progress-indicator.component';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';
import { FolderComponent } from './folder/folder.component';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule],
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

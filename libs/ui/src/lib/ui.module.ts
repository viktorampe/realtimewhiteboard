import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FolderGridComponent } from './folder/components/folder-grid/folder-grid.component';
import { FolderLineComponent } from './folder/components/folder-line/folder-line.component';
import { FolderProgressIndicatorComponent } from './folder/components/folder-progress-indicator/folder-progress-indicator.component';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';
import { FolderComponent } from './folder/folder.component';

@NgModule({
  imports: [CommonModule, MatProgressSpinnerModule, PortalModule],
  declarations: [
    FolderComponent,
    FolderDetailsDirective,
    FolderProgressIndicatorComponent,
    FolderLineComponent,
    FolderGridComponent
  ],
  exports: [
    FolderComponent,
    FolderDetailsDirective,
    FolderProgressIndicatorComponent
  ],
  entryComponents: [
    FolderGridComponent,
    FolderLineComponent,
    FolderProgressIndicatorComponent
  ]
})
export class UiModule {}

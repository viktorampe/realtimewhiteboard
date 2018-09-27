import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FolderDetailsDirective } from './folder/directives/folder-details.directive';
import { FolderComponent } from './folder/folder.component';
import { AdjustColorBrightnessPipe } from './utils/pipes/adjust-color-brightness.pipe';

@NgModule({
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatIconModule,
    PortalModule
  ],
  declarations: [
    FolderDetailsDirective,
    FolderComponent,
    AdjustColorBrightnessPipe
  ],
  exports: [FolderDetailsDirective, FolderComponent, AdjustColorBrightnessPipe],
  entryComponents: []
})
export class UiModule {}

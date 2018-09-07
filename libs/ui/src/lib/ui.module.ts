import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { SideSheetComponent } from './side-sheet/side-sheet.component';
import { ContentComponent } from './content/content.component';
@NgModule({
  imports: [CommonModule, MatSidenavModule, LayoutModule],
  declarations: [SideSheetComponent, ContentComponent],
  exports: [SideSheetComponent, MatSidenavModule, ContentComponent]
})
export class UiModule {}

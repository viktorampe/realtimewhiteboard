import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material';
import { LayoutModule } from '@angular/cdk/layout';
import { SideSheetComponent } from './side-sheet/side-sheet.component';
import { ContentComponent } from './content/content.component';
import { SideSheetHeaderDirective } from './side-sheet/directives/side-sheet-header.directive';
import { SideSheetBodyDirective } from './side-sheet/directives/side-sheet-body.directive';
import { SideSheetPageDirective } from './side-sheet/directives/side-sheet-page.directive';
@NgModule({
  imports: [CommonModule, MatSidenavModule, LayoutModule],
  declarations: [SideSheetComponent, ContentComponent, SideSheetHeaderDirective, SideSheetBodyDirective, SideSheetPageDirective],
  exports: [SideSheetComponent, MatSidenavModule, ContentComponent, SideSheetHeaderDirective, SideSheetBodyDirective, SideSheetPageDirective]
})
export class UiModule {}

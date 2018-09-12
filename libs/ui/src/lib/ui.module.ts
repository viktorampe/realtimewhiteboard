import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TreeNavComponent } from './tree-nav/tree-nav.component';
import { CdkTreeModule } from '@angular/cdk/tree';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [CommonModule, RouterModule, CdkTreeModule, MatIconModule],
  declarations: [TreeNavComponent],
  exports: [TreeNavComponent]
})
export class UiModule {}

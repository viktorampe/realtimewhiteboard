import { LayoutModule } from '@angular/cdk/layout';
import { OverlayModule } from '@angular/cdk/overlay';
import { CdkTreeModule } from '@angular/cdk/tree';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DateAdapter,
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatSelectModule,
  MatSidenavModule,
  MatTooltipModule
} from '@angular/material';
import { MatTabsModule } from '@angular/material/tabs';
import { RouterModule } from '@angular/router';
import { BeDateAdapter, UtilsModule } from '@campus/utils';
import { ButtonComponent } from './button/button.component';
import { EmptyStateComponent } from './empty-state/empty-state.component';

@NgModule({
  imports: [
    OverlayModule,
    MatButtonModule,
    CommonModule,
    MatSidenavModule,
    MatInputModule,
    LayoutModule,
    RouterModule,
    CdkTreeModule,
    ReactiveFormsModule,
    FormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatRadioModule,
    MatDatepickerModule,
    UtilsModule,
    MatDialogModule,
    MatListModule,
    MatTabsModule,
    MatCheckboxModule
  ],
  declarations: [ButtonComponent, EmptyStateComponent, ButtonComponent],
  exports: [EmptyStateComponent],
  providers: [{ provide: DateAdapter, useClass: BeDateAdapter }]
})
export class UiModule {}

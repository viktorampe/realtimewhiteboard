import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { CredentialsComponent } from './components/credentials.component';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: CredentialsComponent }
    ])
  ],
  declarations: [CredentialsComponent],
  exports: [CredentialsComponent]
})
export class PagesSettingsCredentialsModule {}

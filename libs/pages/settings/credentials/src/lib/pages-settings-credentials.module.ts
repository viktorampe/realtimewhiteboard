import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatIconModule } from '@angular/material';
import { RouterModule } from '@angular/router';
import { UiModule } from '@campus/ui';
import { CredentialsComponent } from './components/credentials.component';
import { CredentialsResolver } from './components/credentials.resolver';

@NgModule({
  imports: [
    CommonModule,
    UiModule,
    MatIconModule,

    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: null, //TODO CredentialsComponent
        resolve: { isResolved: CredentialsResolver }
      }
    ])
  ],
  declarations: [CredentialsComponent],
  exports: [CredentialsComponent]
})
export class PagesSettingsCredentialsModule {}

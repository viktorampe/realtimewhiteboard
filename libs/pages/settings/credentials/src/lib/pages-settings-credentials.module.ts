import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CredentialsResolver } from './components/credentials.resolver';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: '',
        pathMatch: 'full',
        component: null, //CredentialsComponent
        resolve: { isResolved: CredentialsResolver }
      }
    ])
  ]
})
export class PagesSettingsCredentialsModule {}

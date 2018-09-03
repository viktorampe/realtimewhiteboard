import { LogoutViewModel } from './components/logout.viewmodel';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesLogoutRoutingModule } from './pages-logout-routing.module';
import { LogoutComponent } from './components/logout.component';

@NgModule({
  imports: [CommonModule, PagesLogoutRoutingModule],
  declarations: [LogoutComponent],

  providers: [LogoutViewModel]
})
export class PagesLogoutModule {}

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { LogoutComponent } from './components/logout.component';
import { LogoutViewModel } from './components/logout.viewmodel';
import { LogoutRoutingModule } from './logout-routing.module';

@NgModule({
  declarations: [LogoutComponent],
  imports: [CommonModule, LogoutRoutingModule],
  exports: [],
  providers: [LogoutViewModel]
})
export class LogoutModule {}

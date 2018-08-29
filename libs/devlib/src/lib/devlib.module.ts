import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LoginpageComponent } from './loginpage/loginpage.component';
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', pathMatch: 'full', component: LoginpageComponent }
    ])
  ],
  declarations: [LoginpageComponent]
})
export class DevlibModule {}

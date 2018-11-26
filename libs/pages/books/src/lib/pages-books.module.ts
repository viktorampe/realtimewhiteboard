import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { UiModule } from '@campus/ui';
import { BooksComponent } from './components/books.component';
import { BooksViewModel } from './components/books.viewmodel';
import { PagesBooksRoutingModule } from './pages-books-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesBooksRoutingModule,
    UiModule,
    PagesSharedModule
  ],
  declarations: [
    BooksComponent,
  ],
  providers: [BooksViewModel]
})
export class PagesBooksModule {}

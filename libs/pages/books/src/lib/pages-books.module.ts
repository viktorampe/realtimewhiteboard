import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PagesSharedModule } from '@campus/pages/shared';
import { SharedModule } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { BooksViewModel } from './components/books.viewmodel';
import { BooksComponent } from './components/books/books.component';
import { PagesBooksRoutingModule } from './pages-books-routing.module';

@NgModule({
  imports: [
    CommonModule,
    PagesBooksRoutingModule,
    UiModule,
    PagesSharedModule,
    SharedModule
  ],
  declarations: [BooksComponent],
  providers: [BooksViewModel],
  exports: [BooksComponent]
})
export class PagesBooksModule {}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BooksResolver } from './components/books.resolver';
import { BooksComponent } from './components/books/books.component';

const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    resolve: { isResolved: BooksResolver }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBooksRoutingModule {}

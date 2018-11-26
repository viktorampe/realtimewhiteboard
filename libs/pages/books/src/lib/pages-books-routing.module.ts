import { BooksViewModel } from './components/books.viewmodel';
import { BooksComponent } from './components/books.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    component: BooksComponent,
    resolve: { isResolved: BooksViewModel }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesBooksRoutingModule {}

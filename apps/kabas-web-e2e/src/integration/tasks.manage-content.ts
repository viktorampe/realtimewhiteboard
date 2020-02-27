import { dataCy } from '../support';

export function filteryByBook() {
  return dataCy('method-books-link')
    .contains(1)
    .click();
}

export function filteryByChapter() {
  filteryByBook();
  return dataCy('lesson-link')
    .contains('Target 1')
    .click();
}
export function filteryByLesson() {
  filteryByBook();
  filteryByChapter();
  dataCy('toggle-collabsible-sheet').click(); // open side sheet otherwise the lesson-link won't be clickable
  return dataCy('lesson-link')
    .contains('Les 3 - rekenhandelingen tot 5')
    .click();
}

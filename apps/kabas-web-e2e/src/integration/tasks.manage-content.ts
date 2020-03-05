import { dataCy } from '../support';

export function filterByBook() {
  return dataCy('method-books-link')
    .contains(1)
    .click();
}

export function filterByChapter() {
  filterByBook();
  return dataCy('lesson-link')
    .contains('Target 1')
    .click();
}
export function filterByLesson() {
  filterByBook();
  filterByChapter();
  dataCy('toggle-collabsible-sheet').click(); // open side sheet otherwise the lesson-link won't be clickable
  return dataCy('lesson-link')
    .contains('Les 3 - rekenhandelingen tot 5')
    .click();
}

// This does not work
// It starts dragging, but then stops working
// probably something to do with the ghostElement
export function dragDrop(
  draggable: Cypress.Chainable<JQuery<HTMLElement>>,
  dropzone: Cypress.Chainable<JQuery<HTMLElement>>
) {
  draggable
    .trigger('mousedown', { button: 0 })
    .wait(500)
    .trigger('mousemove', { clientX: 10, clientY: 0, force: true })
    .wait(500)
    .trigger('mousemove', {
      clientX: 1000,
      clientY: 1000,
      screenX: 1000,
      screenY: 1000,
      pageX: 1000,
      pageY: 1000,
      force: true
    })
    .wait(500)
    .trigger('mouseup', { force: true });
}

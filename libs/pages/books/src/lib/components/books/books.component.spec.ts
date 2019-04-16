import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EduContent, EduContentFixture } from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { ListFormat, ListViewItemDirective, UiModule } from '@campus/ui';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { BehaviorSubject } from 'rxjs';
import { BooksViewModel } from '../books.viewmodel';
import { MockBooksViewModel } from '../books.viewmodel.mock';
import { BooksComponent } from './books.component';

describe('BooksComponent', () => {
  let component: BooksComponent;
  let fixture: ComponentFixture<BooksComponent>;
  let bookViewModel: BooksViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      declarations: [BooksComponent],
      providers: [
        { provide: BooksViewModel, useClass: MockBooksViewModel },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    bookViewModel = TestBed.get(BooksViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BooksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get the listFormat$ from the vm', () => {
    expect(component.listFormat$).toBe(bookViewModel.listFormat$);
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(bookViewModel, 'changeListFormat');
    component.setListFormat(ListFormat.GRID);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });

  it('should show an errormessage when no books are available', () => {
    (bookViewModel.sharedBooks$ as BehaviorSubject<EduContent[]>).next([]);
    fixture.detectChanges();

    const errorMessage = 'Er zijn momenteel geen boeken met jou gedeeld.';

    const componentEl = fixture.nativeElement;
    expect(componentEl.textContent).toContain(errorMessage);
  });

  it('should apply the filter case insensitive on the list of educontent', async(() => {
    const listDE = fixture.debugElement.query(By.css('campus-list-view'));
    const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
    expect(listItems.length).toBe(8);

    component.filterTextInput.setValue('foo');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const filteredListItems = listDE.queryAll(
        By.directive(ListViewItemDirective)
      );
      expect(filteredListItems.length).toBe(7);
    });
  }));

  it('should show an errormessage filtering has no results', () => {
    component.filterTextInput.setValue('thishasnoresults');
    fixture.detectChanges();

    const errorMessage = 'Er zijn geen beschikbare items.';

    const componentEl = fixture.nativeElement;
    expect(componentEl.textContent).toContain(errorMessage);
  });

  it('should ask the viewmodel to open a book', () => {
    bookViewModel.openBook = jest.fn();

    const mockBook = new EduContentFixture();

    component.openBook(mockBook);

    expect(bookViewModel.openBook).toHaveBeenCalled();
    expect(bookViewModel.openBook).toHaveBeenCalledWith(mockBook);
  });
});

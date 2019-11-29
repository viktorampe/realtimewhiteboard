import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  MethodBookTileComponent,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { UnlockedBookInterface } from '../practice.viewmodel.selectors';
import { PracticeOverviewComponent } from './practice-overview.component';

describe('PracticeOverviewComponent', () => {
  let component: PracticeOverviewComponent;
  let fixture: ComponentFixture<PracticeOverviewComponent>;
  let viewmodel: PracticeViewModel;
  let unlockedBooks$: BehaviorSubject<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, SharedModule, RouterTestingModule],
      declarations: [PracticeOverviewComponent],
      providers: [
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        },
        { provide: PracticeViewModel, useClass: MockPracticeViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeOverviewComponent);
    component = fixture.componentInstance;

    viewmodel = TestBed.get(PracticeViewModel);
    unlockedBooks$ = viewmodel.unlockedBooks$ as BehaviorSubject<
      UnlockedBookInterface[]
    >;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    it('should show a placeholder text when there are no unlocked books', () => {
      unlockedBooks$.next([]);
      fixture.detectChanges();

      const booksOnPage = fixture.debugElement.queryAll(
        By.css('campus-method-book-tile')
      );
      expect(booksOnPage.length).toBe(0);

      const textOnPage = fixture.debugElement.query(
        By.css('.pages-practice__no-books')
      ).nativeElement.textContent;

      expect(textOnPage).toBe(
        'Er zijn momenteel geen boeken voor jou vrijgegeven.'
      );
    });

    it('should show the unlockedBooks', () => {
      const booksOnPage = fixture.debugElement.queryAll(
        By.css('campus-method-book-tile')
      );

      const booksOnPageNames = booksOnPage.map(
        bookDE => (bookDE.componentInstance as MethodBookTileComponent).name
      );

      const unlockedBooks = unlockedBooks$.value;

      const unlockedBooksNames = unlockedBooks.map(book => book.name);

      expect(booksOnPage.length).toBe(unlockedBooks.length);
      expect(booksOnPageNames).toEqual(unlockedBooksNames);
    });
  });
});

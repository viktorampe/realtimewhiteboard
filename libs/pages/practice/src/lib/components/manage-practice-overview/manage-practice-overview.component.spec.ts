import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { MethodYearsInterface } from '@campus/dal';
import {
  ENVIRONMENT_ICON_MAPPING_TOKEN,
  ENVIRONMENT_SEARCHMODES_TOKEN,
  ENVIRONMENT_TESTING_TOKEN,
  MethodBooksTileComponent,
  SharedModule
} from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { ManagePracticeOverviewComponent } from './manage-practice-overview.component';

describe('ManagePracticeOverviewComponent', () => {
  let component: ManagePracticeOverviewComponent;
  let fixture: ComponentFixture<ManagePracticeOverviewComponent>;
  let viewmodel: PracticeViewModel;
  let allowedBooks$: BehaviorSubject<any>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, SharedModule, RouterTestingModule],
      declarations: [ManagePracticeOverviewComponent],
      providers: [
        { provide: PracticeViewModel, useClass: MockPracticeViewModel },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: ENVIRONMENT_TESTING_TOKEN, useValue: {} },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: {}
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagePracticeOverviewComponent);
    component = fixture.componentInstance;

    viewmodel = TestBed.get(PracticeViewModel);
    allowedBooks$ = viewmodel.methodYears$ as BehaviorSubject<
      MethodYearsInterface[]
    >;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('content', () => {
    it('should show a placeholder text when there are no allowed books', () => {
      allowedBooks$.next([]);
      fixture.detectChanges();

      const booksOnPage = fixture.debugElement.queryAll(
        By.css('campus-method-year-tile')
      );
      expect(booksOnPage.length).toBe(0);

      const textOnPage = fixture.debugElement.query(
        By.css('.pages-practice__no-books')
      ).nativeElement.textContent;

      expect(textOnPage).toBe(
        'Er zijn momenteel geen methodes aan jou toegekend.'
      );
    });

    it('should show the allowedBooks', () => {
      const booksOnPage = fixture.debugElement.queryAll(
        By.directive(MethodBooksTileComponent)
      );

      const booksOnPageNames = booksOnPage.map(
        bookDE => (bookDE.componentInstance as MethodBooksTileComponent).name
      );

      const allowedBooks = allowedBooks$.value;

      const allowedBooksNames = allowedBooks.map(book => book.name);

      expect(booksOnPage.length).toBe(allowedBooks.length);
      expect(booksOnPageNames).toEqual(allowedBooksNames);
    });
  });
});

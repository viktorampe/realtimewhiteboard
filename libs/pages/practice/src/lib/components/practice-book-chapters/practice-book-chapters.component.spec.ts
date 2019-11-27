import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatListItem } from '@angular/material';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { BehaviorSubject } from 'rxjs';
import { PracticeViewModel } from '../practice.viewmodel';
import { MockPracticeViewModel } from '../practice.viewmodel.mock';
import { ChapterWithStatusInterface } from '../practice.viewmodel.selectors';
import { PracticeBookChaptersComponent } from './practice-book-chapters.component';

describe('PracticeBookChaptersComponent', () => {
  let component: PracticeBookChaptersComponent;
  let fixture: ComponentFixture<PracticeBookChaptersComponent>;
  let practiceViewmodel: PracticeViewModel;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [PracticeBookChaptersComponent],
      providers: [
        { provide: PracticeViewModel, useClass: MockPracticeViewModel }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PracticeBookChaptersComponent);
    component = fixture.componentInstance;
    practiceViewmodel = TestBed.get(PracticeViewModel);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    let chapterStream: BehaviorSubject<ChapterWithStatusInterface[]>;

    beforeEach(() => {
      chapterStream = practiceViewmodel.bookChaptersWithStatus$ as BehaviorSubject<
        ChapterWithStatusInterface[]
      >;
    });

    it('should show the chapters', () => {
      const chapters = chapterStream.value;
      const listItems = fixture.debugElement.queryAll(
        By.directive(MatListItem)
      );

      expect(chapters.length).toEqual(listItems.length);
      chapters.forEach((chapter, index) => {
        const listItemDOM = listItems[index].nativeElement;

        expect(listItemDOM.textContent).toContain(chapter.title);
        expect(listItemDOM.textContent).toContain(
          chapter.kwetonsRemaining + ' kwetons te behalen'
        );
        expect(listItemDOM.textContent).toContain(
          chapter.exercises.available + ' oefeningen'
        );
        expect(listItemDOM.textContent).toContain(
          chapter.exercises.completed + ' gemaakt'
        );
        expect(listItemDOM.getAttribute('href')).toEqual('/' + chapter.tocId);
      });
    });
  });
});

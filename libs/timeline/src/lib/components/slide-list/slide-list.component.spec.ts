import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatIcon,
  MatIconModule,
  MatListItem,
  MatListModule
} from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { TIMELINE_SLIDE_TYPES } from '../../interfaces/timeline';
import { MockEditorViewModel } from '../editor.viewmodel.mock';
import { SlideListComponent } from './slide-list.component';

describe('SlideListComponent', () => {
  let component: SlideListComponent;
  let fixture: ComponentFixture<SlideListComponent>;

  const mockViewModel = new MockEditorViewModel();
  const viewSlides = mockViewModel.slideList$.value;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatListModule, MatIconModule, NoopAnimationsModule],
      declarations: [SlideListComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SlideListComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('template', () => {
    beforeEach(() => {
      component.viewSlides = viewSlides;
      component.activeViewSlide = viewSlides[0];
      fixture.detectChanges();
    });

    it('should show the viewSlides', () => {
      const viewSlideDEArray = fixture.debugElement.queryAll(
        By.directive(MatListItem)
      );

      expect(viewSlideDEArray.length).toBe(viewSlides.length);

      viewSlides.forEach((viewSlide, index) => {
        const viewSlideDE = viewSlideDEArray[index];

        expect(viewSlideDE.nativeElement.textContent).toContain(
          viewSlide.label
        );

        const matIconDE = viewSlideDE.query(By.directive(MatIcon));
        if (viewSlide.type === TIMELINE_SLIDE_TYPES.SLIDE) {
          expect(viewSlideDE.nativeElement.classList).toContain('slide');
          expect(matIconDE.nativeElement.textContent).toBe('video_label');
        } else {
          expect(viewSlideDE.nativeElement.classList).not.toContain('slide');
          expect(matIconDE.nativeElement.textContent).toBe('dynamic_feed');
        }
      });
    });

    it('should show the active slide', () => {
      const viewSlideDEArray = fixture.debugElement.queryAll(
        By.directive(MatListItem)
      );

      const [
        activeViewSlideDE, // viewSlide[0] was set as activeViewSlide
        ...nonActiveViewSlideDEArray
      ] = viewSlideDEArray;

      expect(activeViewSlideDE.nativeElement.classList).toContain('active');

      nonActiveViewSlideDEArray.forEach(viewSlide =>
        expect(viewSlide.nativeElement.classList).not.toContain('active')
      );
    });

    it('should handle list item click events', () => {
      const listItemDE = fixture.debugElement.queryAll(
        By.directive(MatListItem)
      )[1];

      component.setViewSlide = jest.fn();
      listItemDE.triggerEventHandler('click', null);

      expect(component.setViewSlide).toHaveBeenCalledWith(viewSlides[1]);
    });
  });

  describe('output', () => {
    it('should emit setViewSlide', () => {
      component.clickSetSlide.emit = jest.fn();
      component.setViewSlide(viewSlides[1]);

      expect(component.clickSetSlide.emit).toHaveBeenCalledWith(viewSlides[1]);
    });
  });
});

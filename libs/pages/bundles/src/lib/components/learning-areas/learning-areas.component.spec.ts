import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  FilterService,
  FilterServiceInterface,
  FILTER_SERVICE_TOKEN
} from '@campus/shared';
import { ListFormat, ListViewItemDirective, UiModule } from '@campus/ui';
import { BundlesViewModel } from '../bundles.viewmodel';
import { MockViewModel } from '../bundles.viewmodel.mocks';
import { LearningAreasComponent } from './learning-areas.component';

describe('LearningAreasComponent', () => {
  let bundlesViewModel: BundlesViewModel;
  let component: LearningAreasComponent;
  let fixture: ComponentFixture<LearningAreasComponent>;
  let filterService: FilterServiceInterface;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule],
      declarations: [LearningAreasComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BundlesViewModel, useClass: MockViewModel },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService }
      ]
    }).compileComponents();
    bundlesViewModel = TestBed.get(BundlesViewModel);
    filterService = TestBed.get(FILTER_SERVICE_TOKEN);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call the viewModel changeListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(bundlesViewModel, 'changeListFormat');
    component.clickChangeListFormat(ListFormat.GRID);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });

  it('should get the listFormat$ and sharedInfo$ from the vm', () => {
    expect(component.listFormat$).toBe(bundlesViewModel.listFormat$);
    expect(component.sharedInfo$).toBe(bundlesViewModel.sharedLearningAreas$);
  });

  it('should call vm.filterFn when filterTextInput.filterFn is called', () => {
    const filterSource = { learningAreas: [] };
    const filterText = '';
    const spy = jest.spyOn(filterService, 'filter');
    component.filterTextInput.filterFn(filterSource, filterText);
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(filterSource.learningAreas, {
      learningArea: { name: filterText }
    });
  });

  it('should apply the filter case insensitive on the list of learning areas', async(() => {
    const listDE = fixture.debugElement.query(By.css('campus-list-view'));
    const listItems = listDE.queryAll(By.directive(ListViewItemDirective));
    expect(listItems.length).toBe(4);

    component.filterTextInput.setValue('foo');
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      const filteredListItems = listDE.queryAll(
        By.directive(ListViewItemDirective)
      );
      expect(filteredListItems.length).toBe(3);
    });
  }));
});

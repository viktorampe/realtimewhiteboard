import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FilterServiceInterface, FILTER_SERVICE_TOKEN } from '@campus/shared';
import { ListFormat, UiModule } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
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
      imports: [StoreModule.forRoot({}), RouterTestingModule, UiModule],
      declarations: [LearningAreasComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BundlesViewModel, useClass: MockViewModel },
        {
          provide: FILTER_SERVICE_TOKEN,
          useValue: {
            filter: () => []
          }
        },
        Store
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
});

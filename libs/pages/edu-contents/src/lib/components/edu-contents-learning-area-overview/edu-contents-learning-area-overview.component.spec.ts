import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { Component, Input, NgModule } from '@angular/core';
import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import {
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DalState,
  FavoriteReducer,
  getStoreModuleForFeatures,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer
} from '@campus/dal';
import { SearchModule } from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Store, StoreModule } from '@ngrx/store';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import { EduContentsViewModelMock } from '../edu-contents.viewmodel.mock';
import { FavoriteAreasComponent } from '../favorite-areas/favorite-areas.component';
import { EduContentLearningAreaOverviewComponent } from './edu-contents-learning-area-overview.component';

export class MockRouter {
  navigate = jest.fn();
}

@Component({
  selector: 'campus-areas-list',
  template: '<div></div>'
})
export class MockAreasListComponent {
  @Input() learningAreas: LearningAreaInterface[];
  @Input() favoriteLearningAreas: LearningAreaInterface[];
  @Input() connectedDropList: string;
}

@NgModule({
  declarations: [MockAreasListComponent],
  exports: [MockAreasListComponent]
})
export class TestModule {}

describe('EduContentLearningAreaOverviewComponent', () => {
  let component: EduContentLearningAreaOverviewComponent;
  let fixture: ComponentFixture<EduContentLearningAreaOverviewComponent>;
  let store: Store<DalState>;
  let router: Router;
  let route: ActivatedRoute;
  let eduContentsViewModel: EduContentsViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule,
        UiModule,
        RouterTestingModule,
        MatIconModule,
        MatInputModule,
        DragDropModule,
        SharedModule,
        SearchModule,
        NoopAnimationsModule,
        SearchModule,
        SharedModule,
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([LearningAreaReducer, FavoriteReducer])
      ],
      declarations: [
        EduContentLearningAreaOverviewComponent,
        FavoriteAreasComponent
      ],
      providers: [
        Store,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService },
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: {} },
        { provide: EduContentsViewModel, useClass: EduContentsViewModelMock },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService }
      ]
    });

    store = TestBed.get(Store);
    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    eduContentsViewModel = TestBed.get(EduContentsViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentLearningAreaOverviewComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should call the viewmodel toggleFavoriteArea() when a learning area is dropped on the favorites', () => {
    const toggleFavoriteSpy = jest.spyOn(component, 'toggleFavorite');
    const setHoverStateSpy = jest.spyOn(component, 'setHoverState');
    const event = {
      item: { data: new LearningAreaFixture() }
    };
    component.onFavoritesDropped(event as CdkDragDrop<LearningAreaInterface>);
    expect(toggleFavoriteSpy).toHaveBeenCalledWith(new LearningAreaFixture());
    expect(setHoverStateSpy).toHaveBeenCalledWith(false);
  });

  it('should call toggleFavorite when a favorite is removed', fakeAsync(() => {
    const toggleFavoriteSpy = jest.spyOn(component, 'toggleFavorite');
    const eventResult = new LearningAreaFixture();
    component.onFavoriteRemoved(eventResult);
    expect(toggleFavoriteSpy).toHaveBeenCalledWith(eventResult);
  }));

  it('should send searchText to viewmodel subject', fakeAsync(() => {
    jest.spyOn(eduContentsViewModel, 'requestAutoComplete');

    component.searchTermChanged('foo');
    tick(500);

    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledWith(
      'foo'
    );
  }));

  it('should redirect to term search results with searchTerm querystring', async () => {
    jest.spyOn(router, 'navigate');

    component.openSearchByTerm('foo');

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['term'], {
      relativeTo: route,
      queryParams: { searchTerm: 'foo' }
    });
  });
});

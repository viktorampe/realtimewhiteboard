import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import {
  MatIconModule,
  MatIconRegistry,
  MatInputModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import {
  DalState,
  getStoreModuleForFeatures,
  LearningAreaFixture,
  LearningAreaInterface,
  LearningAreaReducer
} from '@campus/dal';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { FilterService, FILTER_SERVICE_TOKEN } from '@campus/utils';
import { Store, StoreModule } from '@ngrx/store';
import { AreasListComponent } from '../areas-list/areas-list.component';
import { FavoriteAreasComponent } from '../favorite-areas/favorite-areas.component';
import { EduContentLearningAreaOverviewComponent } from './edu-contents-learning-area-overview.component';

describe('EduContentLearningAreaOverviewComponent', () => {
  let areaListComponent: AreasListComponent;
  let component: EduContentLearningAreaOverviewComponent;
  let fixture: ComponentFixture<EduContentLearningAreaOverviewComponent>;
  let store: Store<DalState>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        StoreModule.forRoot({}),
        ...getStoreModuleForFeatures([LearningAreaReducer]),
        UiModule,
        RouterTestingModule,
        NoopAnimationsModule,
        FormsModule,
        MatIconModule,
        MatInputModule,
        DragDropModule
      ],
      declarations: [
        EduContentLearningAreaOverviewComponent,
        FavoriteAreasComponent,
        AreasListComponent
      ],
      providers: [
        Store,
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: FILTER_SERVICE_TOKEN, useClass: FilterService }
      ]
    }).compileComponents();

    store = TestBed.get(Store);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentLearningAreaOverviewComponent);
    component = fixture.componentInstance;
    areaListComponent = fixture.debugElement.query(
      By.directive(AreasListComponent)
    ).componentInstance;

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
});

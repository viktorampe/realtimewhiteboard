import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModule } from '@campus/search';
import { ENVIRONMENT_ICON_MAPPING_TOKEN, SharedModule } from '@campus/shared';
import { MockMatIconRegistry } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import { EduContentsViewModelMock } from '../edu-contents.viewmodel.mock';
import { FavoriteAreasComponent } from '../favorite-areas/favorite-areas.component';
import { EduContentLearningAreaOverviewComponent } from './edu-contents-learning-area-overview.component';

export class MockRouter {
  navigate = jest.fn();
}

describe('EduContentLearningAreaOverviewComponent', () => {
  let component: EduContentLearningAreaOverviewComponent;
  let fixture: ComponentFixture<EduContentLearningAreaOverviewComponent>;
  let router: Router;
  let route: ActivatedRoute;
  let eduContentsViewModel: EduContentsViewModel;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        UiModule,
        MatIconModule,
        SearchModule,
        NoopAnimationsModule,
        SharedModule,
        RouterTestingModule
      ],
      declarations: [
        EduContentLearningAreaOverviewComponent,
        FavoriteAreasComponent
      ],
      providers: [
        {
          provide: ENVIRONMENT_ICON_MAPPING_TOKEN,
          useValue: {}
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: {} },
        { provide: EduContentsViewModel, useClass: EduContentsViewModelMock }
      ]
    }).compileComponents();

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

  it('should send searchText to viewmodel subject', fakeAsync(() => {
    jest.spyOn(eduContentsViewModel, 'requestAutoComplete');

    component.searchTermChanged('foo');
    tick(500);

    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledWith(
      'foo'
    );
  }));

  it('should redirect to term search results with searchTerm querystring', () => {
    jest.spyOn(router, 'navigate');
    component.openSearchByTerm('foo');

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['term'], {
      relativeTo: route,
      queryParams: { searchTerm: 'foo' }
    });
  });
});

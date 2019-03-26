import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SearchModule } from '@campus/search';
import {
  EnvironmentSearchModesInterface,
  ENVIRONMENT_SEARCHMODES_TOKEN
} from '@campus/shared';
import { UiModule } from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import { EduContentsViewModelMock } from '../edu-contents.viewmodel.mock';
import { EduContentSearchModesComponent } from './edu-contents-search-modes.component';

export class MockRouter {
  navigate = jest.fn();
}

describe('EduContentSearchModesComponent', () => {
  const searchModes: EnvironmentSearchModesInterface = {};
  let params: BehaviorSubject<Params>;
  let eduContentsViewModel: EduContentsViewModel;
  let router: Router;
  let route: ActivatedRoute;
  let component: EduContentSearchModesComponent;
  let fixture: ComponentFixture<EduContentSearchModesComponent>;

  beforeEach(async(() => {
    params = new BehaviorSubject<Params>({ area: 1 });

    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule, SearchModule],
      declarations: [EduContentSearchModesComponent],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: ActivatedRoute, useValue: { params: params } },
        { provide: EduContentsViewModel, useClass: EduContentsViewModelMock },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: searchModes
        }
      ]
    }).compileComponents();

    router = TestBed.get(Router);
    route = TestBed.get(ActivatedRoute);
    eduContentsViewModel = TestBed.get(EduContentsViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EduContentSearchModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get learningArea from viewmodel', () => {
    expect(component.learningArea$).toBe(eduContentsViewModel.learningArea$);
  });

  it('should get autoComplete values from viewmodel', () => {
    expect(component.autoCompleteValues$).toBe(
      eduContentsViewModel.autoCompleteValues$
    );
  });

  it('should send searchText to viewmodel subject', () => {
    jest.spyOn(eduContentsViewModel.searchTerm$, 'next');
    component.searchTermChanged('foo');
    expect(eduContentsViewModel.searchTerm$.next).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.searchTerm$.next).toHaveBeenCalledWith('foo');
  });

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

import {
  async,
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick
} from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { SearchModeInterface, SearchModule } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import { UiModule } from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import { EduContentsViewModelMock } from '../edu-contents.viewmodel.mock';
import { EduContentSearchModesComponent } from './edu-contents-search-modes.component';

export class MockRouter {
  navigate = jest.fn();
}

describe('EduContentSearchModesComponent', () => {
  const searchModes: { [key: string]: SearchModeInterface } = {};
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
    jest.spyOn(eduContentsViewModel, 'getLearningAreaById');
    params.next({ area: 2 });
    expect(eduContentsViewModel.getLearningAreaById).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.getLearningAreaById).toHaveBeenCalledWith(2);
  });

  it('should request autoComplete values from the viewmodel on searchTerm change', fakeAsync(() => {
    jest.spyOn(eduContentsViewModel, 'requestAutoComplete');
    component.searchTermChanged('foo');
    tick(500);

    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledTimes(1);
    expect(eduContentsViewModel.requestAutoComplete).toHaveBeenCalledWith(
      'foo'
    );
  }));

  it('should redirect to with searchTerm querystring', () => {
    jest.spyOn(router, 'navigate');
    component.openSearchByTerm('foo');

    expect(router.navigate).toHaveBeenCalledTimes(1);
    expect(router.navigate).toHaveBeenCalledWith(['term'], {
      relativeTo: route,
      queryParams: { searchTerm: 'foo' }
    });
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { LearningAreaFixture } from '@campus/dal';
import { SearchModeInterface, SearchModule } from '@campus/search';
import { ENVIRONMENT_SEARCHMODES_TOKEN } from '@campus/shared';
import { ViewModelInterface } from '@campus/testing';
import { UiModule } from '@campus/ui';
import { BehaviorSubject } from 'rxjs';
import { EduContentsViewModel } from '../edu-contents.viewmodel';
import { EduContentSearchModesComponent } from './edu-contents-search-modes.component';

export class MockRouter {
  navigate = jest.fn();
}

export class MockViewModel implements ViewModelInterface<EduContentsViewModel> {
  getLearningAreaById() {
    return new BehaviorSubject(new LearningAreaFixture());
  }

  requestAutoComplete() {
    return new BehaviorSubject(['foo', 'bar', 'baz']);
  }
}

describe('EduContentSearchModesComponent', () => {
  const searchModes: { [key: string]: SearchModeInterface } = {};
  let params: BehaviorSubject<Params>;
  let eduContentsViewModel: EduContentsViewModel;
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
        { provide: EduContentsViewModel, useClass: MockViewModel },
        {
          provide: ENVIRONMENT_SEARCHMODES_TOKEN,
          useValue: searchModes
        }
      ]
    }).compileComponents();

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
});

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AUTH_SERVICE_TOKEN, LearningAreaInterface } from '@campus/dal';
import { ListFormat } from '@campus/ui';
import { Store, StoreModule } from '@ngrx/store';
import { hot } from '@nrwl/nx/testing';
import { BundlesViewModel } from '../bundles.viewmodel';
import { MockViewModel } from '../bundles.viewmodel.mocks';
import { LearningAreasComponent } from './learning-areas.component';

let bundlesViewModel;

describe('LearningAreasComponent', () => {
  let component: LearningAreasComponent;
  let fixture: ComponentFixture<LearningAreasComponent>;
  const learningAreas: LearningAreaInterface[] = [
    {
      icon: 'polpo-wiskunde',
      id: 19,
      color: '#2c354f',
      name: 'Wiskunde'
    },
    {
      icon: 'polpo-aardrijkskunde',
      id: 1,
      color: '#485235',
      name: 'Aardrijkskunde'
    },
    {
      icon: 'polpo-frans',
      id: 2,
      color: '#385343',
      name: 'Frans'
    },
    {
      icon: 'polpo-godsdienst',
      id: 13,
      color: '#325235',
      name: 'Godsdienst, Didactische & Pedagogische ondersteuning'
    }
  ];
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [LearningAreasComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: BundlesViewModel, useClass: MockViewModel },
        { provide: ActivatedRoute, useValue: {} },
        { provide: AUTH_SERVICE_TOKEN, useValue: {} },
        Store
      ]
    }).compileComponents();
    bundlesViewModel = TestBed.get(BundlesViewModel);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningAreasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should start with an empty filterInput string', () => {
    expect(component.filterInput$).toBeObservable(hot('a', { a: '' }));
  });
  it('should reset the filterInput$ when calling resetFilterInput', () => {
    component.filterInput$.next('not empty');
    component.resetFilterInput();
    expect(component.filterInput$).toBeObservable(hot('a', { a: '' }));
  });
  it('should change the filterInput$ when calling onChangeFilterInput', () => {
    component.onChangeFilterInput('the new value');
    expect(component.filterInput$).toBeObservable(
      hot('a', { a: 'the new value' })
    );
  });
  it('should call the viewModel changListFormat method when calling clickChangeListFormat', () => {
    const spy = jest.spyOn(bundlesViewModel, 'changeListFormat');
    component.clickChangeListFormat('GRID');
    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(ListFormat.GRID);
  });
  it('should get the listFormat$, learningAreas$, sharedLearningAreas$ and learningAreasCounts$ from the bundlesViewModel', () => {
    expect(component.listFormat$).toBeObservable(
      hot('a', { a: ListFormat.GRID })
    );
    expect(component.learningAreas$).toBeObservable(
      hot('a', { a: [{ name: 'name', color: 'color', id: 1 }] })
    );
    expect(component.sharedLearningAreas$).toBeObservable(
      hot('a', {
        a: [{ name: 'shared name', color: 'shared color', id: 1 }]
      })
    );
    expect(component.learningAreasCounts$).toBeObservable(
      hot('a', {
        a: {
          1: {
            booksCount: 2,
            bundlesCount: 3
          }
        }
      })
    );
  });
  it('should filter the learningAreas with case insensitivity', () => {
    const learningAreas$ = hot('a--|', { a: learningAreas });
    const filterInput$ = hot('abc|', {
      a: undefined,
      b: 'wISKUN',
      c: 'nothing nothing nothing'
    });
    expect(
      component.filterLearningAreas(learningAreas$, filterInput$)
    ).toBeObservable(
      hot('abc|', { a: learningAreas, b: [learningAreas[0]], c: [] })
    );
  });
});

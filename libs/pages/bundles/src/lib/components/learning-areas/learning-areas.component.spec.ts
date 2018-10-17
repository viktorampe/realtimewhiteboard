import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { Store, StoreModule } from '@ngrx/store';
import { BundlesViewModel } from '../bundles.viewmodel';
import { LearningAreasComponent } from './learning-areas.component';

let bundlesViewModel: MockViewModel;

class MockViewModel extends BundlesViewModel {}

beforeEach(() => {
  bundlesViewModel = new MockViewModel(<ActivatedRoute>{}, <Store<any>>{});
});

test('it should return', () => {
  return;
});

describe('LearningAreasComponent', () => {
  let component: LearningAreasComponent;
  let fixture: ComponentFixture<LearningAreasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [StoreModule.forRoot({})],
      declarations: [LearningAreasComponent],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        BundlesViewModel,
        { provide: ActivatedRoute, useValue: {} },
        Store
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearningAreasComponent);
    component = fixture.componentInstance;
    component.filterInput$.next('');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

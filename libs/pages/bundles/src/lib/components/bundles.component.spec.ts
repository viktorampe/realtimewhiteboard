import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { uiReducer } from '@campus/dal';
import { UiModule } from '@campus/ui';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable } from 'rxjs';
import { BundlesComponent } from './bundles.component';
import { BundlesViewModel } from './bundles.viewmodel';

class TestStore<T> {
  private state: BehaviorSubject<T> = new BehaviorSubject(undefined);

  setState(data: T) {
    this.state.next(data);
  }

  select(selector?: any): Observable<T> {
    return this.state.asObservable();
  }

  dispatch(action: any) {}
}

const uiStore = new TestStore<uiReducer.UiState>();

describe('BundlesComponent', () => {
  let component: BundlesComponent;
  let fixture: ComponentFixture<BundlesComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, NoopAnimationsModule],
      providers: [
        {
          provide: BundlesViewModel,
          useValue: {}
        }
      ],
      declarations: [BundlesComponent],
      providers: [{ provide: Store, useclass: uiStore }],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BundlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

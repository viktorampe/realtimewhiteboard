import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsListComponentComponent } from './results-list-component.component';

describe('ResultsListComponentComponent', () => {
  let component: ResultsListComponentComponent;
  let fixture: ComponentFixture<ResultsListComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsListComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsListComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

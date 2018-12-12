import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultsByPersonAndAreaComponent } from './results-by-person-and-area.component';

describe('ResultsByPersonAndAreaComponent', () => {
  let component: ResultsByPersonAndAreaComponent;
  let fixture: ComponentFixture<ResultsByPersonAndAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResultsByPersonAndAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultsByPersonAndAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

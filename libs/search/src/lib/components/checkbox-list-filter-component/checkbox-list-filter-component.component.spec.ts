import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxListFilterComponentComponent } from './checkbox-list-filter-component.component';

describe('CheckboxListFilterComponentComponent', () => {
  let component: CheckboxListFilterComponentComponent;
  let fixture: ComponentFixture<CheckboxListFilterComponentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxListFilterComponentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListFilterComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

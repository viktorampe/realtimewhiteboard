import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckboxSelectionListFilterComponent } from './checkbox-selection-list-filter.component';

describe('CheckboxSelectionListFilterComponent', () => {
  let component: CheckboxSelectionListFilterComponent;
  let fixture: ComponentFixture<CheckboxSelectionListFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckboxSelectionListFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxSelectionListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

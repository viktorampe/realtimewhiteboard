import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule, MatSelectModule } from '@angular/material';
import { SelectFilterComponent } from './select-filter.component';

describe('SelectFilterComponentComponent', () => {
  let component: SelectFilterComponent;
  let fixture: ComponentFixture<SelectFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatSelectModule, ReactiveFormsModule, MatBadgeModule],
      declarations: [SelectFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should add options to the select component', () => {
    // set filterCriteria, check MatOptions
  });

  it('should not display options where visible is falsy', () => {
    //
  });

  it('should display prediction numbers', () => {
    //
  });

  it('should display count-badge when one or more items are selected', () => {
    //
  });

  it('should add reset option to the select component', () => {
    // set filterCriteria and resetlabel inputs, check MatOptions
  });

  it('should add [multiple] option the select component', () => {
    // set filterCriteria and multiple inputs, check MatSelect multiple attribute
  });

  it('should output the updated searchFilterCriteria on change', () => {
    //
  });
});

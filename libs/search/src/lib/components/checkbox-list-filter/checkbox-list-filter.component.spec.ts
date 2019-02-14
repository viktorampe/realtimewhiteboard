import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxListFilterComponent } from './checkbox-list-filter.component';

describe('CheckboxListFilterComponentComponent', () => {
  let component: CheckboxListFilterComponent<unknown, unknown>;
  let fixture: ComponentFixture<CheckboxListFilterComponent<unknown, unknown>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxListFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxListFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

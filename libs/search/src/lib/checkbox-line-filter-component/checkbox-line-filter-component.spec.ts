import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxLineFilterComponent } from './checkbox-line-filter-component';

describe('CheckboxLineFilterComponent', () => {
  let component: CheckboxLineFilterComponent;
  let fixture: ComponentFixture<CheckboxLineFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxLineFilterComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxLineFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

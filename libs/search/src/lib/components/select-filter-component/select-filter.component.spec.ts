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
});

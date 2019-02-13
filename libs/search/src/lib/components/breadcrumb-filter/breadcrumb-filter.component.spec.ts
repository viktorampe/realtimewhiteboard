import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BreadcrumbFilterComponent } from './breadcrumb-filter.component';

describe('BreadcrumbFilterComponent', () => {
  let component: BreadcrumbFilterComponent;
  let fixture: ComponentFixture<BreadcrumbFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BreadcrumbFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

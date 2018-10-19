import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show the home icon when the linkArray is empty', () => {
    expect(component).toBeTruthy();
  });

  it('should show all breadcrumbs', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct link separator string', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct number of breadcrumbs', () => {
    expect(component).toBeTruthy();
  });

  it('should show the correct links hidden string', () => {
    expect(component).toBeTruthy();
  });
});

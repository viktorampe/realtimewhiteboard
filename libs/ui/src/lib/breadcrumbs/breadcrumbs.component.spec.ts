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

  it('should create', () => {});

  it('should show the home icon when the linkArray is empty', () => {});

  it('should show all breadcrumbs', () => {});

  it('should apply the correct link on the home icon', () => {});

  it('should aplly the correct link on crumbs', () => {});

  it('should show the correct link-separator string', () => {});

  it('should show the correct number of breadcrumbs', () => {});

  it('should show the correct links-hidden string', () => {});
});

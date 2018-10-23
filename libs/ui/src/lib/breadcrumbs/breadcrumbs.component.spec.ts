import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;

  const mockData = {
    hidden: '???',
    maxLen: 3,
    homeIcon: 'homeIconMock',
    seperator: 'seperatorMock',
    breadCrumbs: [
      {
        displayText: 'crumb1',
        href: 'crumb1'
      },
      {
        displayText: 'crumb2',
        href: 'crumb2'
      },
      {
        displayText: 'crumb3',
        href: 'crumb3'
      },
      {
        displayText: 'crumb4',
        href: 'crumb4'
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    component.breadCrumbs = mockData.breadCrumbs;
    component.hidden = mockData.hidden;
    component.maxLen = mockData.maxLen;
    component.seperator = mockData.seperator;
    component.homeIcon = mockData.homeIcon;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 4 breadcrumbs', () => {
    const breadcrumbs = fixture.debugElement.query(
      By.css('.ui-breadcrumbs__holder__breadcrumbs')
    );
    expect(breadcrumbs.children.length).toBe(4);
  });

  it('should show 3 first letters of first mock item breadcrumb followed by hidden string', () => {
    const breadcrumbs = fixture.debugElement.query(
      By.css('.ui-breadcrumbs__holder__breadcrumbs')
    );
    expect(breadcrumbs.children[0].children[1].nativeElement.innerHTML).toBe(
      mockData.breadCrumbs[0].displayText.substr(0, mockData.maxLen) +
        mockData.hidden
    );
  });

  it('should have correct href for first breadcrumb', () => {
    const breadcrumbs = fixture.debugElement.query(
      By.css('.ui-breadcrumbs__holder__breadcrumbs')
    );
    expect(breadcrumbs.children[0].children[1].nativeElement.href).toContain(
      mockData.breadCrumbs[0].href
    );
  });

  it('should show the correct home icon', () => {
    const breadcrumbs = fixture.debugElement.query(
      By.css('.ui-breadcrumbs__holder')
    );
    expect(breadcrumbs.children[0].nativeElement.className).toBe(
      mockData.homeIcon
    );
  });

  it('should show the correct seperator icon', () => {
    const breadcrumbs = fixture.debugElement.query(
      By.css('.ui-breadcrumbs__holder__breadcrumbs')
    );
    expect(breadcrumbs.children[0].children[0].nativeElement.className).toBe(
      mockData.seperator
    );
  });
});

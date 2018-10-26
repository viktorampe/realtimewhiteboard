import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '../ui.module';
import { BreadcrumbsComponent } from './breadcrumbs.component';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let breadcrumbs;

  const mockData = {
    hidden: '???',
    maxLen: 3,
    homeIcon: 'homeIconMock',
    seperator: 'seperatorMock',
    homeUrl: 'homeUrlMock',
    breadCrumbs: [
      {
        displayText: 'crumb1',
        link: 'crumb1'
      },
      {
        displayText: 'crumb2',
        link: 'crumb2'
      },
      {
        displayText: 'crumb3',
        link: 'crumb3'
      },
      {
        displayText: 'crumb4',
        link: 'crumb4'
      }
    ]
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    breadcrumbs = fixture.debugElement.query(
      By.css('.ui-breadcrumbs__holder__breadcrumbs')
    );
    component = fixture.componentInstance;
    component.breadCrumbs = mockData.breadCrumbs;
    component.hidden = mockData.hidden;
    component.maxLength = mockData.maxLen;
    component.seperator = mockData.seperator;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show 4 breadcrumbs', () => {
    expect(breadcrumbs.children.length).toBe(4);
  });

  it('should show 3 first letters of first mock item breadcrumb followed by hidden string', () => {
    expect(breadcrumbs.children[0].children[1].nativeElement.innerHTML).toBe(
      mockData.breadCrumbs[0].displayText.substr(0, mockData.maxLen) +
        mockData.hidden
    );
  });

  it('should have correct href for first breadcrumb', () => {
    expect(breadcrumbs.children[0].children[1].nativeElement.href).toContain(
      mockData.breadCrumbs[0].link
    );
  });

  it('should show the correct seperator icon', () => {
    expect(breadcrumbs.children[0].children[0].nativeElement.className).toBe(
      mockData.seperator
    );
  });
});

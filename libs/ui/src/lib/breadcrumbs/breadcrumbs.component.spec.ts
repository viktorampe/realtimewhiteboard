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
    overflowedLinkString: '???',
    maxLen: 3,
    homeIcon: 'homeIconMock',
    seperator: 'seperatorMock',
    homeUrl: 'homeUrlMock',
    breadCrumbs: [
      {
        displayText: 'crumb1',
        link: ['crumb1']
      },
      {
        displayText: 'crumb2',
        link: ['crumb2']
      },
      {
        displayText: 'crumb3',
        link: ['crumb3']
      },
      {
        displayText: 'crumb4',
        link: ['crumb4']
      },
      {
        displayText: 'crumb5',
        link: ['crumb5']
      },
      {
        displayText: 'crumb6',
        link: ['crumb6']
      },
      {
        displayText: 'crumb7',
        link: ['crumb7']
      },
      {
        displayText: 'crumb8',
        link: ['crumb8']
      },
      {
        displayText: 'crumb9',
        link: ['crumb9']
      },
      {
        displayText: 'crumb10',
        link: ['crumb10']
      },
      {
        displayText: 'crumb11',
        link: ['crumb11']
      },
      {
        displayText: 'crumb12',
        link: ['crumb12']
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
    breadcrumbs = fixture.debugElement.query(By.css('.ui-breadcrumbs__holder'));
    component = fixture.componentInstance;
    component.breadCrumbs = mockData.breadCrumbs;
    component.overflowedLinkString = mockData.overflowedLinkString;
    component.maxLength = mockData.maxLen;
    component.seperator = mockData.seperator;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 5 children breadcrumbs (home button, overflow button, and 3 children links', () => {
    expect(breadcrumbs.children.length).toBe(5);
  });

  it('should have 4 children breadcrumbs (home button, overflow button, and 2 children links', () => {
    component.maxLength = 2;
    fixture.detectChanges();
    expect(breadcrumbs.children.length).toBe(4);
  });

  it('should display the last item from the array', () => {
    component.maxLength = 1;
    fixture.detectChanges();
    expect(breadcrumbs.children[2].children[1].nativeElement.href).toContain(
      mockData.breadCrumbs[11].link
    );
  });

  it('should not display overflow when maxlen is not exceeded', () => {
    component.maxLength = 99;
    component.breadCrumbs = [
      {
        displayText: 'crumb1',
        link: ['crumb1']
      }
    ];
    fixture.detectChanges();
    expect(breadcrumbs.children.length).toBe(2);
    expect(breadcrumbs.children[1].children[1].nativeElement.href).toContain(
      'crumb1'
    );
  });

  it('should display correct overflow string', () => {
    component.maxLength = 1;
    component.breadCrumbs = [
      {
        displayText: 'crumb1',
        link: ['crumb1']
      },
      {
        displayText: 'crumb2',
        link: ['crumb2']
      },
      {
        displayText: 'crumb3',
        link: ['crumb3']
      },
      {
        displayText: 'crumb4',
        link: ['crumb4']
      },
      {
        displayText: 'crumb5',
        link: ['crumb5']
      }
    ];
    fixture.detectChanges();

    expect(breadcrumbs.children[1].children[1].nativeElement.innerHTML).toBe(
      mockData.overflowedLinkString
    );
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { PageHeaderComponent } from './page-header.component';

describe('PageHeaderComponent', () => {
  let component: PageHeaderComponent;
  let fixture: ComponentFixture<PageHeaderComponent>;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PageHeaderComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageHeaderComponent);
    component = fixture.componentInstance;

    // mock data
    mockData = {
      iconClass: 'polpo-wiskunde-lg',
      title: 'Titel',
      subTitle: 'SubTitel'
    };

    // simulate input
    component.iconClass = mockData.iconClass;
    component.title = mockData.title;
    component.subtitle = mockData.subTitle;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should apply the icon class', () => {
    const iconEl = fixture.debugElement.query(By.css('i'));

    expect(iconEl.nativeElement.className).toBe(mockData.iconClass);
  });

  it('shouldnt show the icon when the iconclass string is empty', () => {
    component.iconClass = '';
    fixture.detectChanges();

    const iconDE = fixture.debugElement.query(By.css('i'));

    expect(iconDE).toBeNull();
  });

  it('should display the title', () => {
    const TitleDE = fixture.debugElement;

    expect(TitleDE.nativeElement.textContent).toContain(mockData.title);
  });

  it('should display the subtitle', () => {
    const subTitleDE = fixture.debugElement.query(By.css('small'));

    expect(subTitleDE.nativeElement.textContent).toBe(mockData.subTitle);
  });
});

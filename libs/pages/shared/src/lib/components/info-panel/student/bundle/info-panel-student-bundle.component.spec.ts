import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelStudentBundleComponent } from './info-panel-student-bundle.component';

describe('info-panel-student-bundle', () => {
  let component: InfoPanelStudentBundleComponent;
  let fixture: ComponentFixture<InfoPanelStudentBundleComponent>;

  let mockData: { titleText: string };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelStudentBundleComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelStudentBundleComponent);
    component = fixture.componentInstance;

    mockData = { titleText: 'the-fancy-title' };

    component.titleText = mockData.titleText;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the title', () => {
    const title = fixture.debugElement.query(
      By.css('.info-panel__title')
    ).nativeElement.textContent;
    expect(title).toBe(mockData.titleText);
  });
});

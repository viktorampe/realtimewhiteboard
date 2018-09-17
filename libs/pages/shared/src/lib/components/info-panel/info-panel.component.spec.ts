import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelComponent } from './info-panel.component';

describe('info-panel-student-educontent', () => {
  let component: InfoPanelComponent;
  let fixture: ComponentFixture<InfoPanelComponent>;

  let mockData: { titleText: string };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelComponent);
    component = fixture.componentInstance;

    mockData = { titleText: 'the-fancy-title' };

    component.titleText = mockData.titleText;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the title', () => {
    const title = fixture.debugElement.query(By.css('.info-panel__title'))
      .nativeElement.textContent;
    expect(title).toBe(mockData.titleText);
  });
});

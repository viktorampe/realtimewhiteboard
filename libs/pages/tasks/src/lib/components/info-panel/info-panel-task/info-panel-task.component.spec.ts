import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { InfoPanelTaskComponent } from './info-panel-task.component';

describe('InfoPanelTaskComponent', () => {
  let component: InfoPanelTaskComponent;
  let fixture: ComponentFixture<InfoPanelTaskComponent>;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelTaskComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelTaskComponent);
    component = fixture.componentInstance;

    mockData = {
      person: { displayName: 'display name' },
      taskInfo: {
        taskInstance: {
          start: new Date()
        },
        task: {
          name: 'name',
          description: 'description'
        }
      }
    };
    component.taskInfo = mockData.taskInfo;
    component.person = mockData.person;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the name of the task', () => {
    const text = fixture.debugElement
      .query(By.css('.info-panel-task__text'))
      .query(By.css('strong')).nativeElement.textContent;
    expect(text).toBe(mockData.taskInfo.task.name);
  });
  it('should show the description of the task', () => {
    const text = fixture.debugElement.query(By.css('.info-panel-task__text'))
      .nativeElement.textContent;
    expect(text).toContain(mockData.taskInfo.task.description);
  });
});

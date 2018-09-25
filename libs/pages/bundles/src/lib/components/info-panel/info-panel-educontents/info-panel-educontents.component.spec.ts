import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelEducontentsComponent } from './info-panel-educontents.component';

describe('InfoPanelEducontentsComponent', () => {
  let component: InfoPanelEducontentsComponent;
  let fixture: ComponentFixture<InfoPanelEducontentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelEducontentsComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelEducontentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

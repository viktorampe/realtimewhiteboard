import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelEducontentComponent } from './info-panel-educontent.component';


describe('InfoPanelEducontentComponent', () => {
  let component: InfoPanelEducontentComponent;
  let fixture: ComponentFixture<InfoPanelEducontentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelEducontentComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelEducontentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

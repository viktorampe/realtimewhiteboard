import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelBundleComponent } from './info-panel-bundle.component';

describe('InfoPanelBundleComponent', () => {
  let component: InfoPanelBundleComponent;
  let fixture: ComponentFixture<InfoPanelBundleComponent>;

  let mockData: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelBundleComponent],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelBundleComponent);
    component = fixture.componentInstance;

    mockData = {
      name: 'string',
      description: 'string',
      teacher: { displayName: 'string' }
    };
    component.bundle = mockData;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

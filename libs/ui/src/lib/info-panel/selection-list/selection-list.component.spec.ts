import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelSelectionListComponent } from './selection-list.component';

describe('InfoPanelSelectionListComponent', () => {
  let component: InfoPanelSelectionListComponent;
  let fixture: ComponentFixture<InfoPanelSelectionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelSelectionListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelSelectionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelAdaptableListComponent } from './adaptable-list.component';

describe('InfoPanelAdaptableListComponent', () => {
  let component: InfoPanelAdaptableListComponent;
  let fixture: ComponentFixture<InfoPanelAdaptableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelAdaptableListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelAdaptableListComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

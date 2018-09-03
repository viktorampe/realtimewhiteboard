import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelInputLabelComponent } from './input-label.component';

describe('InfoPanelInputLabelComponent', () => {
  let component: InfoPanelInputLabelComponent;
  let fixture: ComponentFixture<InfoPanelInputLabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelInputLabelComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelInputLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

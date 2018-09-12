import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelStatusComponent } from './status.component';


describe('InfoPanelStatusComponent', () => {
  let component: InfoPanelStatusComponent;
  let fixture: ComponentFixture<InfoPanelStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelStatusComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should show the dropdown options', () => {

  });
});

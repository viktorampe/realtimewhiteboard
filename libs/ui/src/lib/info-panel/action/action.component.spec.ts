import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelActionComponent } from './action.component';

describe('InfoPanelActionComponent', () => {
  let component: InfoPanelActionComponent;
  let fixture: ComponentFixture<InfoPanelActionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelActionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolBarButtonComponent } from './tool-bar-button.component';


describe('ToolBarButtonComponent', () => {
  let component: ToolBarButtonComponent;
  let fixture: ComponentFixture<ToolBarButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToolBarButtonComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolBarButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should apply the icon to the element class', () => {

  });
  it('should be marked as active when input is true', () => {

  });
  it('should not be marked as active when input is false', () => {

  });
  it('should have the title as alt and/or? element title', () => {

  });
});

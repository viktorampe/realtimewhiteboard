import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoPanelEducontentPreviewComponent } from './educontent-preview.component';

describe('InfoPanelEducontentPreviewComponent', () => {
  let component: InfoPanelEducontentPreviewComponent;
  let fixture: ComponentFixture<InfoPanelEducontentPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [InfoPanelEducontentPreviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoPanelEducontentPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { MockMatIconRegistry } from '@campus/testing';
import { ToolbarComponent } from './toolbar.component';

describe('ToolbarComponent', () => {
  let component: ToolbarComponent;
  let fixture: ComponentFixture<ToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [ToolbarComponent],
      providers: [{ provide: MatIconRegistry, useClass: MockMatIconRegistry }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clickToggleEditIcon when toggleModus is called', () => {
    spyOn(component.delete, 'emit');
    component.onDeleteClicked();
    expect(component.delete.emit).toHaveBeenCalled();
  });

  it('should emit clickToggleEditIcon when toggleModus is called', () => {
    spyOn(component.clickColorIcon, 'emit');
    component.showColor();
    expect(component.clickColorIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickToggleEditIcon when toggleModus is called', () => {
    spyOn(component.clickToggleEditIcon, 'emit');
    component.toggleModus();
    expect(component.clickToggleEditIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickToggleEditIcon when toggleModus is called', () => {
    spyOn(component.clickToggleView, 'emit');
    component.toggleView();
    expect(component.clickToggleView.emit).toHaveBeenCalled();
  });
});

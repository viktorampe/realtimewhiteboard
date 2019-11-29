import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorlistComponent } from './colorlist.component';

describe('ColorlistComponent', () => {
  let component: ColorlistComponent;
  let fixture: ComponentFixture<ColorlistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorlistComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit the right swatch when a colorlist_swatch element is clicked', () => {
    spyOn(component.selectedColor, 'emit');
    component.clickColor('black');
    expect(component.selectedColor.emit).toHaveBeenCalledWith('black');
  });
});

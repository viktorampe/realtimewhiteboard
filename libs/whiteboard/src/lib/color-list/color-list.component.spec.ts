import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ColorListComponent } from './color-list.component';

describe('ColorlistComponent', () => {
  let component: ColorListComponent;
  let fixture: ComponentFixture<ColorListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ColorListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ColorListComponent);
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

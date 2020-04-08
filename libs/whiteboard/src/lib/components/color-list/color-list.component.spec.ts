import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { configureTestSuite } from 'ng-bullet';
import { ColorListComponent } from './color-list.component';

describe('ColorListComponent', () => {
  let component: ColorListComponent;
  let fixture: ComponentFixture<ColorListComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule],
      declarations: [ColorListComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
    });
  });

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

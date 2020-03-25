import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WhiteboardModule } from '@campus/whiteboard';
import { configureTestSuite } from 'ng-bullet';
import { ShelfComponent } from './shelf.component';

describe('ShelfComponent', () => {
  let component: ShelfComponent;
  let fixture: ComponentFixture<ShelfComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule],
      declarations: []
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShelfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle isMinimized when toggleShelf is called', () => {
    component.isMinimized = false;
    component.toggleShelf();
    expect(component.isMinimized).toBe(true);
  });

  it('should emit minimizeShelf when toggleShelf is called', () => {
    spyOn(component.isMinimizedChange, 'emit');
    component.toggleShelf();
    expect(component.isMinimizedChange.emit).toHaveBeenCalled();
  });
});

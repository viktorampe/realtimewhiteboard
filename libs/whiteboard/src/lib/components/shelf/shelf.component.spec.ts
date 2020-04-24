import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconRegistry } from '@angular/material';
import { HAMMER_LOADER } from '@angular/platform-browser';
import { MockMatIconRegistry } from '@campus/testing';
import { WhiteboardModule } from '@campus/whiteboard';
import { configureTestSuite } from 'ng-bullet';
import { ShelfComponent } from './shelf.component';

describe('ShelfComponent', () => {
  let component: ShelfComponent;
  let fixture: ComponentFixture<ShelfComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [WhiteboardModule],
      declarations: [],
      providers: [
        { provide: MatIconRegistry, useClass: MockMatIconRegistry },
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        }
      ]
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

  it('should emit clickDeleteIcon when deleteIconClicked is called', () => {
    spyOn(component.deleteCard, 'emit');
    component.emitDeleteCard({});
    expect(component.deleteCard.emit).toHaveBeenCalled();
  });
});

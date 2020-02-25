import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { ListItemContentComponent } from './list-item-content.component';

describe('ListItemContentComponent', () => {
  let component: ListItemContentComponent;
  let fixture: ComponentFixture<ListItemContentComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [ListItemContentComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListItemContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set the separated class', () => {
    expect(
      fixture.debugElement.query(
        By.css('.ui-list-item__content-right--separated')
      )
    ).toBeNull();
  });

  it('should set the separated class', () => {
    component.contentRightSeparated = true;
    fixture.detectChanges();

    expect(
      fixture.debugElement.query(
        By.css('.ui-list-item__content-right--separated')
      )
    ).toBeDefined();
  });
});

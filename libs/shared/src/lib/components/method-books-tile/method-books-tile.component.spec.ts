import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { UiModule } from '@campus/ui';
import { configureTestSuite } from 'ng-bullet';
import { MethodBooksTileComponent } from './method-books-tile.component';

describe('MethodBooksTileComponent', () => {
  let component: MethodBooksTileComponent;
  let fixture: ComponentFixture<MethodBooksTileComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [UiModule, RouterTestingModule],
      declarations: [MethodBooksTileComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodBooksTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

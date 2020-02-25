import { ComponentFixture, TestBed } from '@angular/core/testing';
import { configureTestSuite } from 'ng-bullet';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;
  let clickCtaSpy: jest.SpyInstance;
  configureTestSuite(() => {
    TestBed.configureTestingModule({
      declarations: [EmptyStateComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmptyStateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('CTA', () => {
    it('should emit clickCta when cta is clicked', () => {
      clickCtaSpy = jest.spyOn(component.clickCta, 'emit');
      component.ctaClick();
      expect(clickCtaSpy).toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule } from '@angular/material';
import { configureTestSuite } from 'ng-bullet';
import { ButtonComponent } from './../button/button.component';
import { EmptyStateComponent } from './empty-state.component';

describe('EmptyStateComponent', () => {
  let component: EmptyStateComponent;
  let fixture: ComponentFixture<EmptyStateComponent>;
  let clickCtaSpy: jest.SpyInstance;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule],
      declarations: [EmptyStateComponent, ButtonComponent]
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

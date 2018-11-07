import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { ButtonComponent } from './button.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
  <div (click)="this.onClick()">
    <campus-button>tekst</campus-button>
  </div>
  `
})
export class TestContainerComponent {
  onClick() {}
}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent]
})
export class TestModule {}

describe('ButtonComponent', () => {
  let component: ButtonComponent;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let componentDE: DebugElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    component = <ButtonComponent>(
      testContainerFixture.debugElement.query(By.css('campus-button'))
        .componentInstance
    );
    testContainerFixture.detectChanges();

    componentDE = testContainerFixture.debugElement.query(
      By.css('campus-button')
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shouldnt show the icon, if not provided', () => {
    const iconDE = componentDE.query(By.css('i'));

    expect(iconDE).toBeFalsy();
  });

  it('should show the icon, if provided', () => {
    const mockIconClass = 'icon-tasks';

    component.iconClass = mockIconClass;
    testContainerFixture.detectChanges();

    const iconDE = componentDE.query(By.css('mat-icon'));

    expect(iconDE.nativeElement).toBeTruthy();
  });

  it('shouldnt project the content', () => {
    expect(componentDE.nativeElement.textContent).toContain('tekst');
  });

  it('should stop click event bubbling from children', () => {
    spyOn(testContainerComponent, 'onClick');

    const compChilderen = componentDE.queryAll(By.all());
    compChilderen.forEach(c => c.nativeElement.click());

    expect(testContainerComponent.onClick).not.toHaveBeenCalled();
  });
});

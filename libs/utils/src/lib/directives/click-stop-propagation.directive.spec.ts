import { CommonModule } from '@angular/common';
import { Component, DebugElement, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UtilsModule } from '../utils.module';
import { ClickStopPropagationDirective } from './click-stop-propagation.directive';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
    <div (click)="this.onClick()">
      <span clickStopPropagation>tekst</span>
    </div>
  `
})
export class TestContainerComponent {
  onClick() {}
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container-without',
  template: `
    <div (click)="this.onClick()"> <span>tekst</span> </div>
  `
})
export class TestContainerWithoutDirectiveComponent {
  onClick() {}
}

@NgModule({
  declarations: [
    TestContainerComponent,
    TestContainerWithoutDirectiveComponent
  ],
  imports: [CommonModule, UtilsModule],
  exports: [TestContainerComponent, TestContainerWithoutDirectiveComponent]
})
export class TestModule {}

describe('ClickStopPropagationDirective', () => {
  let directive: ClickStopPropagationDirective;
  let component: Component;
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
    componentDE = testContainerFixture.debugElement.query(By.css('span'));
    component = componentDE.componentInstance;
    testContainerFixture.detectChanges();
    directive = componentDE.injector.get(ClickStopPropagationDirective);
  });

  it('should create the host with the directive attached', () => {
    expect(component).toBeTruthy();
    expect(directive).toBeTruthy();
  });

  it('should stop click event bubbling from children', () => {
    const ev = new MouseEvent('click', { bubbles: true });

    spyOn(testContainerComponent, 'onClick');
    componentDE.nativeElement.dispatchEvent(ev);

    expect(testContainerComponent.onClick).not.toHaveBeenCalled();
  });

  // double check that the onClick has been called without the directive
  it("shouldn't stop click event bubbling from children without the directive", () => {
    const ev = new MouseEvent('click', { bubbles: true });

    const testContainerWithoutFixture = TestBed.createComponent(
      TestContainerWithoutDirectiveComponent
    );
    const testContainerWithoutComponent =
      testContainerWithoutFixture.componentInstance;
    const componentWithoutDE = testContainerWithoutFixture.debugElement.query(
      By.css('span')
    );

    spyOn(testContainerWithoutComponent, 'onClick');
    componentWithoutDE.nativeElement.dispatchEvent(ev);

    expect(testContainerWithoutComponent.onClick).toHaveBeenCalled();
  });
});

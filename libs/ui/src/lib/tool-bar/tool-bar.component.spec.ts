import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { UiModule } from '@campus/ui';
import { ToolBarComponent } from './tool-bar.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
  <campus-toolbar>
  </campus-toolbar>
  `
})
export class TestContainerComponent {
}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, UiModule],
  exports: [TestContainerComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [],
})

export class TestModule { }

describe('ToolBarComponent', () => {
  let component: ToolBarComponent;
  let fixture: ComponentFixture<ToolBarComponent>;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let innerComponent: ToolBarComponent;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        TestModule
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    // regular component
    fixture = TestBed.createComponent(ToolBarComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    // templated component
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    innerComponent = <ToolBarComponent>(
      testContainerFixture.debugElement.query(By.css('campus-toolbar')).componentInstance
    );
    testContainerFixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create innerComponent', () => {
    expect(innerComponent).toBeTruthy();
  });
  it('should have the fixed modiefier if the input is true', () => {

  });
  it('should not have the fixed modiefier if the input is false', () => {

  });
  it('should project the content', () => {

  });
});

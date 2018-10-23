import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, NgModule } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SharedModule } from '../../shared.module';
import { PageBarContainerComponent } from './page-bar-container.component';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'test-container',
  template: `
  <div id="test-div">
    <div id="page-bar-container"></div>
    <campus-page-bar>
      this is a test text
    </campus-page-bar>
  </div>
  `
})
export class TestContainerComponent {}

@NgModule({
  declarations: [TestContainerComponent],
  imports: [CommonModule, SharedModule],
  exports: [TestContainerComponent],
  providers: [{ provide: document, useValue: DOCUMENT }]
})
export class TestModule {}

describe('PageBarComponent', () => {
  let component: PageBarContainerComponent;
  let fixture: ComponentFixture<PageBarContainerComponent>;
  let testContainerFixture: ComponentFixture<TestContainerComponent>;
  let testContainerComponent: TestContainerComponent;
  let innerComponent: PageBarContainerComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    }).compileComponents();
  }));
  beforeEach(() => {
    // templated component
    testContainerFixture = TestBed.createComponent(TestContainerComponent);
    testContainerComponent = testContainerFixture.componentInstance;
    innerComponent = <PageBarContainerComponent>(
      testContainerFixture.debugElement.query(By.css('campus-page-bar'))
        .componentInstance
    );
    testContainerFixture.detectChanges();

    // return TestContainerComponent div with id 'page-bar-container'
    jest.spyOn(document, 'querySelector').mockImplementation(() => {
      return testContainerFixture.nativeElement.querySelector(
        '#page-bar-container'
      );
    });
    // regular component
    fixture = TestBed.createComponent(PageBarContainerComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create innerComponent', () => {
    expect(innerComponent).toBeTruthy();
  });
  it('should display the div with the id page-bar-container', () => {
    expect(
      testContainerFixture.debugElement.query(By.css('#page-bar-container'))
    ).toBeTruthy();
  });
  xit('should show the text from the campus-page-bar inside the page-bar-constainer', async () => {
    // component.ngAfterViewInit();
    // fixture.detectChanges();
    // testContainerFixture.detectChanges();

    return fixture.whenStable().then(() => {
      const containerText = testContainerFixture.debugElement.query(
        By.css('#page-bar-container')
      ).nativeElement.textContent;
      fixture.detectChanges();
      testContainerFixture.detectChanges();
      expect(containerText).toBe('this is a the text');
    });
  });
});

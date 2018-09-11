import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SideSheetComponent } from './side-sheet.component';

import { Component } from '@angular/core';
import { SideSheetHeaderDirective } from './directives/side-sheet-header.directive';
import { By } from '@angular/platform-browser';
import { MatSidenavModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SideSheetBodyDirective } from './directives/side-sheet-body.directive';
import { SideSheetPageDirective } from './directives/side-sheet-page.directive';

@Component({
  selector: 'test',
  template: `
  <campus-side-sheet [isOpen]="true">
    <campus-side-sheet-header>Test header</campus-side-sheet-header>
    <campus-side-sheet-body>
      <div><p>Test body</p></div>
    </campus-side-sheet-body>
    <campus-side-sheet-page>
    <div>This is a test page.</div>
    </campus-side-sheet-page>
  </campus-side-sheet>`
})
export class TestHostComponent {
  isOpen: boolean;
}

describe('SideSheetComponent', () => {
  let hostComponent: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let sideSheetComp: SideSheetComponent;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MatSidenavModule],
      declarations: [
        TestHostComponent,
        SideSheetComponent,
        SideSheetHeaderDirective,
        SideSheetBodyDirective,
        SideSheetPageDirective
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = fixture.componentInstance;
    sideSheetComp = <SideSheetComponent>(
      fixture.debugElement.query(By.css('campus-side-sheet')).componentInstance
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should display the header text', () => {
    expect(
      fixture.debugElement.query(By.directive(SideSheetHeaderDirective))
        .nativeElement.innerHTML
    ).toContain('Test header');
  });

  it('should display the body content', () => {
    expect(
      fixture.debugElement
        .query(By.directive(SideSheetBodyDirective))
        .query(By.css('p')).nativeElement.innerHTML
    ).toBe('Test body');
  });

  it('should display the page content', () => {
    expect(
      fixture.debugElement
        .query(By.directive(SideSheetPageDirective))
        .query(By.css('div')).nativeElement.innerHTML
    ).toBe('This is a test page.');
  });

  it('should open the drawer by default', () => {
    expect(sideSheetComp.sheet.opened).toBe(true);
  });
});

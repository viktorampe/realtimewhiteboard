import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconModule, MatIconRegistry } from '@angular/material';
import { By, HAMMER_LOADER } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockMatIconRegistry } from '@campus/testing';
import { configureTestSuite } from 'ng-bullet';
import { CardTypeEnum } from '../../enums/cardType.enum';
import { CardToolbarComponent } from './card-toolbar.component';
// file.only
describe('CardToolbarComponent', () => {
  let component: CardToolbarComponent;
  let fixture: ComponentFixture<CardToolbarComponent>;

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, BrowserAnimationsModule],
      declarations: [CardToolbarComponent],
      providers: [
        {
          provide: HAMMER_LOADER,
          useValue: () => new Promise(() => {})
        },
        { provide: MatIconRegistry, useClass: MockMatIconRegistry }
      ]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clickDeleteIcon when deleteIconClicked is called', () => {
    spyOn(component.clickDeleteIcon, 'emit');
    component.deleteIconClicked();
    expect(component.clickDeleteIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickReturntoshelfIcon when returntoshelfIcon is called', () => {
    spyOn(component.clickReturnToShelfIcon, 'emit');
    component.returnToShelfIconClicked();
    expect(component.clickReturnToShelfIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickEditIcon when editIconClicked is called', () => {
    spyOn(component.clickEditIcon, 'emit');

    component.editIconClicked();
    expect(component.clickEditIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickFlipIcon when flipIconClicked is called', () => {
    spyOn(component.clickFlipIcon, 'emit');

    component.flipIconClicked();
    expect(component.clickFlipIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickConfirmIcon when confirmIconClicked is called', () => {
    spyOn(component.clickConfirmIcon, 'emit');

    component.confirmIconClicked();
    expect(component.clickConfirmIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickMultiSelectIcon when multiSelectClicked is called', () => {
    spyOn(component.clickMultiSelectIcon, 'emit');

    component.multiSelectClicked();
    expect(component.clickMultiSelectIcon.emit).toHaveBeenCalled();
  });

  it('should emit clickMultiSelectSelectedIcon when multiSelectSelectedClicked is called', () => {
    spyOn(component.clickMultiSelectSelectedIcon, 'emit');

    component.multiSelectSelectedClicked();
    expect(component.clickMultiSelectSelectedIcon.emit).toHaveBeenCalled();
  });

  describe('delete', () => {
    const testCases = [
      {
        description: 'should be available',
        data: {
          canManage: true,
          cardType: CardTypeEnum.PUBLISHERCARD
        },
        shouldBeAvailable: true
      },
      {
        description: 'should be available',
        data: {
          canManage: true,
          cardType: CardTypeEnum.TEACHERCARD
        },
        shouldBeAvailable: true
      },
      {
        description: 'should be available',
        data: {
          canManage: false,
          cardType: CardTypeEnum.TEACHERCARD
        },
        shouldBeAvailable: true
      },
      {
        description: 'should not be available',
        data: {
          canManage: false,
          cardType: CardTypeEnum.PUBLISHERCARD
        },
        shouldBeAvailable: false
      }
    ];
    function getDeleteTool(): DebugElement {
      return fixture.debugElement.query(By.css('[data-cy="delete-tool"]'));
    }

    testCases.forEach(testCase => {
      it(`${testCase.description} when canManage = ${testCase.data.canManage}, cardType = ${testCase.data.cardType}`, () => {
        Object.assign(component, testCase.data);

        fixture.detectChanges();

        if (testCase.shouldBeAvailable) {
          expect(getDeleteTool()).toBeTruthy();
        } else {
          expect(getDeleteTool()).toBeFalsy();
        }
      });
    });
  });

  describe('return to shelf', () => {
    const testCases = [
      {
        description: 'should be available',
        data: {
          inShelf: false,
          cardType: CardTypeEnum.PUBLISHERCARD
        },
        shouldBeAvailable: true
      },
      {
        description: 'should not be available',
        data: {
          inShelf: true,
          cardType: CardTypeEnum.PUBLISHERCARD
        },
        shouldBeAvailable: false
      },
      {
        description: 'should not be available',
        data: {
          inShelf: true,
          cardType: CardTypeEnum.PUBLISHERCARD
        },
        shouldBeAvailable: false
      },
      {
        description: 'should not be available',
        data: {
          inShelf: false,
          cardType: CardTypeEnum.TEACHERCARD
        },
        shouldBeAvailable: false
      }
    ];

    function getReturnToShelfTool(): DebugElement {
      return fixture.debugElement.query(
        By.css('[data-cy="return-to-shelf-tool"]')
      );
    }

    testCases.forEach(testCase => {
      it(`${testCase.description} when inShelf = ${testCase.data.inShelf}, cardType = ${testCase.data.cardType}`, () => {
        Object.assign(component, testCase.data);

        fixture.detectChanges();

        if (testCase.shouldBeAvailable) {
          expect(getReturnToShelfTool()).toBeTruthy();
        } else {
          expect(getReturnToShelfTool()).toBeFalsy();
        }
      });
    });
  });
});

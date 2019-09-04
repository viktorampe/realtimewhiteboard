import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatCheckbox,
  MatCheckboxModule,
  MatIcon,
  MatIconModule
} from '@angular/material';
import { By } from '@angular/platform-browser';
import { configureTestSuite } from 'ng-bullet';
import { MultiCheckBoxTableComponent } from './multi-check-box-table.component';
import {
  MultiCheckBoxTableItemColumnInterface,
  MultiCheckBoxTableItemInterface,
  MultiCheckBoxTableRowHeaderColumnInterface,
  MultiCheckBoxTableSubLevelInterface
} from './multi-check-box-table.interface';

describe('MultiCheckBoxTableComponent', () => {
  let component: MultiCheckBoxTableComponent<any, any, any>;
  let fixture: ComponentFixture<MultiCheckBoxTableComponent<any, any, any>>;

  const subLevels: MultiCheckBoxTableSubLevelInterface<any, any>[] = [
    {
      item: { id: 1, title: 'les1' },
      label: 'title',
      children: [
        {
          header: { id: 1, goal: 'item1' },
          content: { 1: true }
        },
        {
          header: { id: 2, goal: 'item2' },
          content: { 2: true }
        },
        {
          header: { id: 3, goal: 'item3' },
          content: { 1: true, 2: true }
        }
      ]
    },
    {
      item: { id: 2, title: 'les2' },
      label: 'title',
      children: [
        {
          header: { id: 4, goal: 'item4' },
          content: {}
        },
        {
          header: { id: 5, goal: 'item5' },
          content: {}
        }
      ]
    }
  ];

  const itemColumns: MultiCheckBoxTableItemColumnInterface<any>[] = [
    {
      item: { id: 1, name: 'klas1' },
      key: 'id',
      label: 'name'
    },
    {
      item: { id: 2, name: 'klas2' },
      key: 'id',
      label: 'name'
    }
  ];

  const rowHeaderColumns: MultiCheckBoxTableRowHeaderColumnInterface<any>[] = [
    { caption: 'id', key: 'id' },
    { caption: 'beschrijving', key: 'goal' }
  ];

  const items: MultiCheckBoxTableItemInterface<any>[] = [
    {
      header: { id: 1, goal: 'item1' },
      content: { 1: true }
    },
    {
      header: { id: 2, goal: 'item2' },
      content: { 2: true }
    },
    {
      header: { id: 3, goal: 'item3' },
      content: { 1: true, 2: true }
    }
  ];

  configureTestSuite(() => {
    TestBed.configureTestingModule({
      imports: [MatIconModule, MatCheckboxModule],
      declarations: [MultiCheckBoxTableComponent]
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiCheckBoxTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('data', () => {
    beforeEach(() => {
      component.rowHeaderColumns = rowHeaderColumns;
      component.itemColumns = itemColumns;
    });

    describe('table header', () => {
      beforeEach(() => {
        fixture.detectChanges();
      });

      describe('for row header cells', () => {
        let headerCells;

        beforeEach(() => {
          headerCells = fixture.debugElement.queryAll(
            By.css('.ui-multi-check-box-table__header--row-header')
          );
        });

        it('should have the correct amount of cells', () => {
          expect(headerCells.length).toBe(rowHeaderColumns.length);
        });

        it('should contain the correct text', () => {
          const headerCellTextContents = headerCells.map(cell =>
            cell.nativeElement.textContent.trim()
          );

          const expectedHeaderCellTextContents = rowHeaderColumns.map(
            rowHeaderColumn => rowHeaderColumn.caption
          );

          expect(headerCellTextContents).toEqual(
            expectedHeaderCellTextContents
          );
        });
      });

      describe('for item cells', () => {
        let headerCells;

        beforeEach(() => {
          headerCells = fixture.debugElement.queryAll(
            By.css('.ui-multi-check-box-table__header--item')
          );
        });

        it('should have the correct amount of cells', () => {
          expect(headerCells.length).toBe(itemColumns.length);
        });

        it('should contain the correct text', () => {
          const headerCellTextContents = headerCells.map(cell =>
            cell.nativeElement.textContent.trim()
          );

          const expectedHeaderCellTextContents = itemColumns.map(
            itemColumn => itemColumn.item[itemColumn.label]
          );

          expect(headerCellTextContents).toEqual(
            expectedHeaderCellTextContents
          );
        });
      });
    });

    describe('rows', () => {
      describe('with sub levels', () => {
        beforeEach(() => {
          component.subLevels = subLevels;
          fixture.detectChanges();
        });

        it('should show the correct amount of subLevels', () => {
          const subLevelRows = fixture.debugElement.queryAll(
            By.css('.ui-multi-check-box-table__body__row--subLevel')
          );

          expect(subLevelRows.length).toBe(subLevels.length);
        });

        it('should show the correct amount of rows per subLevel', () => {
          const rows = fixture.debugElement.queryAll(
            By.css(
              '.ui-multi-check-box-table__body__row--item,' +
                '.ui-multi-check-box-table__body__row--subLevel '
            )
          );

          const rowsTypes = rows.map(row =>
            row.nativeElement.classList.contains(
              'ui-multi-check-box-table__body__row--subLevel'
            )
              ? 'subLevel'
              : 'item'
          );

          const expectedRowTypes = subLevels.reduce(
            (acc, subLevel) => [
              ...acc,
              'subLevel',
              ...new Array(subLevel.children.length).fill('item')
            ],
            []
          );

          expect(rows.length).toBe(expectedRowTypes.length);
          expect(rowsTypes).toEqual(expectedRowTypes);
        });
      });

      describe('without sub level', () => {
        beforeEach(() => {
          component.items = items;
          fixture.detectChanges();
        });
        it('should show the correct amount of rows', () => {
          const itemRows = fixture.debugElement.queryAll(
            By.css('.ui-multi-check-box-table__body__row--item')
          );

          expect(itemRows.length).toBe(items.length);
        });
      });

      describe('data per row', () => {
        describe('subLevel rows', () => {
          beforeEach(() => {
            component.subLevels = [subLevels[0]]; // limit component to 1 subLevel row
            fixture.detectChanges();
          });

          describe('row header cells', () => {
            let headerCells;

            beforeEach(() => {
              headerCells = fixture.debugElement.queryAll(
                By.css('.ui-multi-check-box-table__body__row--subLevel--header')
              );
            });

            it('should have the correct amount of cells', () => {
              expect(headerCells.length).toBe(1);
            });

            it('should contain the correct text', () => {
              const headerCellTextContents = headerCells.map(cell =>
                cell.nativeElement.textContent.trim()
              );

              const expectedHeaderCellTextContents = [
                subLevels[0].item[subLevels[0].label]
              ];

              expect(headerCellTextContents).toEqual(
                expectedHeaderCellTextContents
              );
            });
          });

          describe('item column header cells', () => {
            let itemHeaderCells;

            beforeEach(() => {
              itemHeaderCells = fixture.debugElement.queryAll(
                By.css('.ui-multi-check-box-table__body__row--subLevel--item')
              );
            });

            it('should have the correct amount of cells', () => {
              expect(itemHeaderCells.length).toBe(itemColumns.length);
            });

            it('should contain the correct icons', () => {
              const itemHeaderCellIcons = itemHeaderCells.map(
                cell =>
                  (cell.query(By.directive(MatIcon))
                    .componentInstance as MatIcon).svgIcon
              );

              const expectedItemHeaderCellIcons = new Array(
                itemColumns.length
              ).fill('select-all');

              expect(itemHeaderCellIcons).toEqual(expectedItemHeaderCellIcons);
            });
          });
        });

        describe('item rows', () => {
          beforeEach(() => {
            component.items = [items[0]]; // limit component to 1 row
            fixture.detectChanges();
          });

          describe('row header cells', () => {
            let headerCells;

            beforeEach(() => {
              headerCells = fixture.debugElement.queryAll(
                By.css('.ui-multi-check-box-table__body__row__cell--row-header')
              );
            });

            it('should have the correct amount of cells', () => {
              expect(headerCells.length).toBe(rowHeaderColumns.length);
            });

            it('should contain the correct text', () => {
              const headerCellTextContents = headerCells.map(cell =>
                cell.nativeElement.textContent.trim()
              );

              const expectedHeaderCellTextContents = rowHeaderColumns.map(
                rowHeaderColumn =>
                  items[0].header[rowHeaderColumn.key].toString()
              );

              expect(headerCellTextContents).toEqual(
                expectedHeaderCellTextContents
              );
            });
          });

          describe('checkbox cells', () => {
            let checkboxCells;

            beforeEach(() => {
              checkboxCells = fixture.debugElement.queryAll(
                By.css('.ui-multi-check-box-table__body__row__cell--checkbox')
              );
            });

            it('should have the correct amount of cells', () => {
              expect(checkboxCells.length).toBe(itemColumns.length);
            });

            it('should contain a checkbox with the correct checked status', () => {
              const checkboxValues = checkboxCells.map(
                checkboxCell =>
                  !!(checkboxCell.query(By.directive(MatCheckbox))
                    .componentInstance as MatCheckbox).checked
              );

              const expectedCheckboxValues = itemColumns.map(
                itemColumn =>
                  !!items[0].content[itemColumn.item[itemColumn.key]]
              );

              expect(checkboxValues).toEqual(expectedCheckboxValues);
            });
          });
        });
      });
    });
  });

  describe('table options', () => {
    beforeEach(() => {
      component.rowHeaderColumns = rowHeaderColumns;
      component.itemColumns = itemColumns;
      fixture.detectChanges();
    });

    describe('toplevelSelectAllEnabled', () => {
      beforeEach(() => {
        component.topLevelSelectAllEnabled = true;
        fixture.detectChanges();
      });

      it('should show the select all checkboxes', () => {
        const checkBoxes = fixture.debugElement.queryAll(
          By.css('.ui-multi-check-box-table__header mat-checkbox')
        );

        expect(checkBoxes.length).toEqual(itemColumns.length);
      });

      it('should show the correct text', () => {
        const headerCells = fixture.debugElement.queryAll(
          By.css(
            '.ui-multi-check-box-table__header .ui-multi-check-box-table__header--row-header'
          )
        );
        expect(
          headerCells[rowHeaderColumns.length].nativeElement.textContent.trim()
        ).toContain('Alle');
      });

      describe('selection state', () => {
        /**
         * Test setup:
         *
         *          X         0
         *        klas 1    klas 2
         * item 1   X         0
         * item 2   X         X
         * item 3   X         X
         */
        let bodyCheckBoxes;
        let topLevelCheckBoxes;
        beforeEach(() => {
          component.itemColumns = itemColumns;
          component.itemColumns[0].isTopLevelSelected = true;

          component.items = items;
          fixture.detectChanges();

          const allCheckBoxes = fixture.debugElement.queryAll(
            By.directive(MatCheckbox)
          );
          topLevelCheckBoxes = allCheckBoxes.splice(0, itemColumns.length);
          bodyCheckBoxes = allCheckBoxes;
        });
        it('should reflect the toplevel selection state', () => {
          expect(!!topLevelCheckBoxes[0].componentInstance.checked).toBe(true);
          expect(!!topLevelCheckBoxes[1].componentInstance.checked).toBe(false);
        });

        it('should select and disable all items when toplevel is clicked', () => {
          const checkBoxCheckedStates = bodyCheckBoxes.map(
            checkBox => !!checkBox.componentInstance.checked
          );
          const checkBoxDisabledStates = bodyCheckBoxes.map(
            checkBox => !!checkBox.componentInstance.disabled
          );

          const expectedCheckedValues = [true, false, true, true, true, true];
          const expectedDisabledValues = [
            true,
            false,
            true,
            false,
            true,
            false
          ];

          expect(checkBoxCheckedStates).toEqual(expectedCheckedValues);
          expect(checkBoxDisabledStates).toEqual(expectedDisabledValues);
        });
      });
    });
  });

  describe('event handlers', () => {
    describe('clickCheckBox', () => {
      beforeEach(() => {
        component.rowHeaderColumns = [];
        component.itemColumns = [itemColumns[0]];
        component.items = [items[0]];
        fixture.detectChanges();
      });
      it('should be triggered by checkbox click', () => {
        jest.spyOn(component, 'clickCheckbox');

        const checkBoxDebugElement = fixture.debugElement.query(
          By.directive(MatCheckbox)
        );
        checkBoxDebugElement.triggerEventHandler('click', null);

        expect(component.clickCheckbox).toHaveBeenCalledTimes(1);
        expect(component.clickCheckbox).toHaveBeenCalledWith(
          items[0].header,
          itemColumns[0].item,
          undefined, // no subLevel in inputs
          checkBoxDebugElement.componentInstance
        );
      });

      it('should emit a checkBoxChanged event', () => {
        jest.spyOn(component.checkBoxChanged, 'emit');

        component.clickCheckbox(
          items[0].header,
          itemColumns[0].item,
          subLevels[0].item,
          { checked: true } as MatCheckbox
        );

        expect(component.checkBoxChanged.emit).toHaveBeenCalledTimes(1);
        expect(component.checkBoxChanged.emit).toHaveBeenCalledWith({
          column: itemColumns[0].item,
          item: items[0].header,
          subLevel: subLevels[0].item,
          previousCheckboxState: true
        });
      });
    });
    describe('selectAllForSubLevel', () => {
      beforeEach(() => {
        component.rowHeaderColumns = [];
        component.itemColumns = [itemColumns[0]];
        component.items = items;
        component.subLevels = [subLevels[0]];
        fixture.detectChanges();
      });
      it('should be triggered by selectAll click', () => {
        jest.spyOn(component, 'clickSelectAllForSubLevel');

        fixture.debugElement
          .query(By.directive(MatIcon))
          .triggerEventHandler('click', null);

        expect(component.clickSelectAllForSubLevel).toHaveBeenCalledWith(
          subLevels[0],
          itemColumns[0]
        );
      });

      it('should emit a checkBoxChanged event', () => {
        jest.spyOn(component.checkBoxesChanged, 'emit');

        component.clickSelectAllForSubLevel(subLevels[0], itemColumns[0]);

        expect(component.checkBoxesChanged.emit).toHaveBeenCalledTimes(1);
        expect(component.checkBoxesChanged.emit).toHaveBeenCalledWith([
          {
            column: itemColumns[0].item,
            item: items[0].header,
            subLevel: subLevels[0].item
          },
          {
            column: itemColumns[0].item,
            item: items[1].header,
            subLevel: subLevels[0].item
          },
          {
            column: itemColumns[0].item,
            item: items[2].header,
            subLevel: subLevels[0].item
          }
        ]);
      });
    });

    describe('clickSelectAllForTopLevel', () => {
      beforeEach(() => {
        component.topLevelSelectAllEnabled = true;
        component.itemColumns = itemColumns;
        component.rowHeaderColumns = rowHeaderColumns;
        fixture.detectChanges();
      });

      it('should be triggered by topLevelselectAllCheckbox', () => {
        jest.spyOn(component, 'clickSelectAllForTopLevel');

        const checkBox = fixture.debugElement.query(By.directive(MatCheckbox));
        checkBox.triggerEventHandler('click', null);

        expect(component.clickSelectAllForTopLevel).toHaveBeenCalled();
      });

      it('should emit a topLevelCheckBoxToggled event', () => {
        jest.spyOn(component.topLevelCheckBoxToggled, 'emit');

        component.clickSelectAllForTopLevel(itemColumns[0], {
          checked: true
        } as MatCheckbox);

        expect(component.topLevelCheckBoxToggled.emit).toHaveBeenCalledTimes(1);
        expect(component.topLevelCheckBoxToggled.emit).toHaveBeenCalledWith({
          itemColumn: itemColumns[0].item,
          isSelected: false
        });
      });
    });
  });
});

import { Component, Input } from '@angular/core';

/**
 * @example
 *  <campus-info-panel>
      <campus-content-preview preview
                              [preview]="'https://d1fh3heiqa6frl.cloudfront.net/890f054414a06a81489f35e6b27fc23c9ee12d0ce4e0a867801a569a073438de/7bc034592d6ea1a4ec2f3e99eb63ad56_340-1.png'"
                              [titleText]="'the title'"
                              [description]="'descriptions yo'">
        <campus-file-extension-presenter type
                                        [extension]="'xls'"></campus-file-extension-presenter>
        <div icon
            class="polpo-presentatie"></div>
        <div badge
            *ngFor="let badge of ['method1', 'method2']">
          {{badge}}
        </div>
      </campus-content-preview>
      <campus-person-badge person
                          [displayName]="'Tom Mertens'"
                          [align]="'left'"
                          [size]="'medium'">
      </campus-person-badge>
      <campus-input-label name
                          [titleText]="'Titel'"
                          [text]="'name'"></campus-input-label>
      <campus-input-label description
                          [titleText]="'Omschrijving'"
                          [text]="'description'"></campus-input-label>
      <campus-editable-inline-tag-list list
                            [titleText]="'Geselecteerd items'"
                            [items]="[{text: 'one'},{text: 'two', count: 12},{text: 'two', count: 1, editable: 3}]"></campus-editable-inline-tag-list>
      <campus-adaptable-select status
                              [label]="'status'"
                              [options]="['one', 'two']"
                              [selectedOption]="'one'"
                              [text]="'some explenation'"
                              (saveStatus)="saveStatus($event)"></campus-adaptable-select>
    </campus-info-panel>
 * 
 * @export
 * @class InfoPanelComponent
 */
@Component({
  selector: 'campus-info-panel',
  templateUrl: './info-panel.component.html',
  styleUrls: ['./info-panel.component.scss']
})
export class InfoPanelComponent {
  @Input() titleText: string;
}

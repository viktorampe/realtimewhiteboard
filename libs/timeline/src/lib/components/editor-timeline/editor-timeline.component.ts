import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineViewSlideInterface } from '../../interfaces/timeline';
import { EditorViewModel } from '../editor.viewmodel';

@Component({
  selector: 'campus-editor-timeline',
  templateUrl: './editor-timeline.component.html',
  styleUrls: ['./editor-timeline.component.scss']
})
export class EditorTimelineComponent implements OnInit, OnChanges {
  public slides$: Observable<TimelineViewSlideInterface[]>;

  @Input() eduContentMetadataId: number;
  @Input() apiBase: string;

  constructor(private editorViewModel: EditorViewModel) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.initialise();
  }

  private initialise() {
    if (this.apiBase && this.eduContentMetadataId) {
      this.editorViewModel.setHttpSettings({
        apiBase: this.apiBase,
        eduContentMetadataId: this.eduContentMetadataId
      });
    }
  }

  noop(): void {}
}

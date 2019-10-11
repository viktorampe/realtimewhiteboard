import {
  Component,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { Observable } from 'rxjs';
import { TimelineViewSlideInterface } from '../../interfaces/timeline';
import { EDITOR_HTTP_SERVICE_TOKEN } from '../../services/editor-http.service';
import { EditorHttpServiceInterface } from '../../services/editor-http.service.interface';
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

  constructor(
    private editorViewModel: EditorViewModel,
    @Inject(EDITOR_HTTP_SERVICE_TOKEN)
    private editorHttpService: EditorHttpServiceInterface
  ) {}

  ngOnInit() {}

  ngOnChanges(changes: SimpleChanges) {
    this.initialise();
  }

  private initialise() {
    if (this.apiBase && this.eduContentMetadataId) {
      this.editorHttpService.apiBase = this.apiBase;
      this.editorHttpService.eduContentMetadataId = this.eduContentMetadataId;
      this.editorViewModel.initialise();
    }
  }

  noop(): void {}
}

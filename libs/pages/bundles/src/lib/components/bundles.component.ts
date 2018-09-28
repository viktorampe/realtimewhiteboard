import { Component } from '@angular/core';

@Component({
  selector: 'campus-bundles',
  templateUrl: './bundles.component.html',
  styleUrls: ['./bundles.component.scss']
})
export class BundlesComponent implements OnInit {
  bundleData = {
    name: 'How now brown cow? Is it wrong to be strong? Aardrijkskunde',
    icon: 'polpo-aardrijkskunde',
    color: '#485235',
    id: 1,
    eduContents: [
      {
        type: 'boek-e',
        id: 18,
        publishedEduContentMetadataId: 31,
        publishedEduContentMetadata: {
          version: 1,
          metaVersion: '0.1',
          language: 'nl',
          title: 'Topos 3',
          description: 'Dit is de digitale uitgave bij de methode Topos 3',
          created: '2018-08-17T08:11:32.000Z',
          published: null,
          quotable: false,
          taskAllowed: false,
          standalone: true,
          teacherCanUnlock: true,
          fileName: null,
          file: null,
          checksum: null,
          link: '9060600043',
          commitMessage: 'publish message',
          previewId: null,
          thumb: null,
          thumbSmall: null,
          showCommitMessage: false,
          locked: false,
          sourceRef: null,
          id: 31,
          publisherId: 1,
          eduContentId: 18,
          editorId: 1,
          learningAreaId: 1,
          eduContentProductTypeId: 15,
          editorStatusId: 1,
          eduContentBookId: null,
          eduContentSourceId: null,
          fileExt: 'boek-e',
          fileLabel: 'boek',
          learningArea: {
            name: 'Aardrijkskunde',
            icon: 'polpo-aardrijkskunde',
            color: '#485235',
            id: 1
          },
          methods: [
            {
              name: 'Topos',
              icon: 'topos',
              logoUrl: 'topos.jpg',
              experimental: false,
              id: 22,
              learningAreaId: 1
            }
          ]
        }
      },
      {
        type: 'boek-e',
        id: 19,
        publishedEduContentMetadataId: 33,
        publishedEduContentMetadata: {
          version: 1,
          metaVersion: '0.1',
          language: 'nl',
          title: 'Topos 1',
          description: 'Dit is de digitale uitgave bij de methode Topos 1',
          created: '2018-08-17T08:11:32.000Z',
          published: null,
          quotable: false,
          taskAllowed: false,
          standalone: true,
          teacherCanUnlock: true,
          fileName: null,
          file: null,
          checksum: null,
          link: '906060013',
          commitMessage: 'publish message',
          previewId: null,
          thumb: null,
          thumbSmall: null,
          showCommitMessage: false,
          locked: false,
          sourceRef: null,
          id: 33,
          publisherId: 1,
          eduContentId: 19,
          editorId: 1,
          learningAreaId: 1,
          eduContentProductTypeId: 15,
          editorStatusId: 3,
          eduContentBookId: null,
          eduContentSourceId: null,
          fileExt: 'boek-e',
          fileLabel: 'boek',
          learningArea: {
            name: 'Aardrijkskunde',
            icon: 'polpo-aardrijkskunde',
            color: '#485235',
            id: 1
          },
          methods: [
            {
              name: 'Topos',
              icon: 'topos',
              logoUrl: 'topos.jpg',
              experimental: false,
              id: 22,
              learningAreaId: 1
            }
          ]
        }
      }
    ],
    bundles: [{}, {}]
  };

  lineView: boolean;
  constructor() {}

  ngOnInit() {
    this.lineView = false;
  }
}

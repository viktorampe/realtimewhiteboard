export interface PolpoStudentOpenBundleContentInterface {
  polpoStudentOpenBundleContent: {
    login: { username: string; password: string };
    teacher: {
      name: string;
      firstName: string;
      created: string;
      gender: string;
      type: string;
      email: string;
      currentSchoolYear: number;
      terms: boolean;
      username: string;
      id: number;
      displayName: string;
    };
    learningArea: {
      name: string;
      icon: string;
      color: string;
      id: number;
    };
    bundle: {
      name: string;
      start: string;
      end: string;
      id: number;
      teacherId: number;
      learningAreaId: number;
    };
    contentExercise: {
      type: string;
      id: number;
      publishedEduContentMetadataId: number;
      publishedEduContentMetadata: PublishedEduContentMetadataInterface;
    };
    contentDownloadable: {
      type: string;
      id: number;
      publishedEduContentMetadataId: number;
      publishedEduContentMetadata: PublishedEduContentMetadataInterface;
    };
    contentUserContent: {
      name: string;
      description: string;
      type: string;
      link: string;
      id: number;
      teacherId: number;
      fileExt: string;
      fileLabel: string;
    };
    boeke: {
      type: string;
      id: number;
      publishedEduContentMetadataId: number;
      publishedEduContentMetadata: PublishedEduContentMetadataInterface;
    };
  };
}

export interface PublishedEduContentMetadataInterface {
  version: number;
  metaVersion: number;
  language: string;
  title: string;
  description: string;
  created: string;
  published: string;
  quotable: boolean;
  taskAllowed: boolean;
  standalone: boolean;
  teacherCanUnlock: boolean;
  fileName: string;
  file: string;
  checksum: string;
  link: string;
  commitMessage: string;
  previewId: number;
  thumb: string;
  thumbSmall: string;
  showCommitMessage: boolean;
  locked: boolean;
  sourceRef: string;
  id: number;
  publisherId: number;
  eduContentId: number;
  editorId: number;
  learningAreaId: number;
  eduContentProductTypeId: number;
  editorStatusId: number;
  eduContentBookId: number;
  eduContentSourceId: number;
  levelId: number;
  fileExt: string;
  fileLabel: string;
}

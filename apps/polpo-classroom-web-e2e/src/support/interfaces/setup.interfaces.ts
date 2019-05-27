export interface StudentOpenBundleContentInterface {
  studentOpenBundleContent: {
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
    };
    contentDownloadable: {
      type: string;
      id: number;
      publishedEduContentMetadataId: number;
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
    boeke: { type: string; id: number; publishedEduContentMetadataId: number };
  };
}

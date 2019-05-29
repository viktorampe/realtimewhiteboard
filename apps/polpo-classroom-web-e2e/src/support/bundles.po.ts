import { StudentOpenBundleContentInterface } from './interfaces';

export const getContentDisplayData = (
  setup: StudentOpenBundleContentInterface
) => {
  return [
    {
      name:
        setup.studentOpenBundleContent.contentExercise
          .publishedEduContentMetadata.title,
      fileLabel:
        setup.studentOpenBundleContent.contentExercise
          .publishedEduContentMetadata.fileLabel
    },
    {
      name:
        setup.studentOpenBundleContent.contentDownloadable
          .publishedEduContentMetadata.title,
      fileLabel:
        setup.studentOpenBundleContent.contentDownloadable
          .publishedEduContentMetadata.fileLabel
    },
    {
      name: setup.studentOpenBundleContent.contentUserContent.name,
      fileLabel: setup.studentOpenBundleContent.contentUserContent.fileLabel
    }
  ];
};

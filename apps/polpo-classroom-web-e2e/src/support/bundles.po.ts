import { PolpoStudentOpenBundleContentInterface } from './interfaces';

export const getContentDisplayData = (
  setup: PolpoStudentOpenBundleContentInterface
) => {
  return [
    {
      name:
        setup.polpoStudentOpenBundleContent.contentExercise
          .publishedEduContentMetadata.title,
      fileLabel:
        setup.polpoStudentOpenBundleContent.contentExercise
          .publishedEduContentMetadata.fileLabel
    },
    {
      name:
        setup.polpoStudentOpenBundleContent.contentDownloadable
          .publishedEduContentMetadata.title,
      fileLabel:
        setup.polpoStudentOpenBundleContent.contentDownloadable
          .publishedEduContentMetadata.fileLabel
    },
    {
      name: setup.polpoStudentOpenBundleContent.contentUserContent.name,
      fileLabel:
        setup.polpoStudentOpenBundleContent.contentUserContent.fileLabel
    }
  ];
};

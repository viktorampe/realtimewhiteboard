import { Injectable } from '@angular/core';
import {
  BundleInterface,
  ContentInterface,
  EduContentInterface,
  UserContentInterface
} from '@campus/dal';

@Injectable({
  providedIn: 'root'
})
export class DataConverterService {
  /**
   * Transform Bundle to object for use in info-panel-bundle
   *
   * @param {BundleInterface} data
   * @returns {object}
   * @memberof DataConverterService
   */
  public transformToBundleForInfoPanel(data: BundleInterface): object {
    return {
      name: data.name,
      description: data.description,
      teacher: {
        displayName: data.teacher.displayName
          ? data.teacher.displayName
          : data.teacher.name + ' ' + data.teacher.firstName
      }
    };
  }

  /**
   * Creates an object for use in the info-panel-content
   *
   * @param {ContentInterface} data
   * @returns {object}
   * @memberof DataConverterService
   */
  public transformToContentForInfoPanel(data: ContentInterface): object {
    return {
      name: data.name,
      description: data.description,
      extension: data.fileExtension,
      productType: data.productType,
      methods: data.methodLogos
    };
  }

  /**
   * Creates an object for use in the info-panel-contents
   *
   * @param {ContentInterface[]} data
   * @returns {object[]}
   * @memberof DataConverterService
   */
  public transformToContentsForInfoPanel(data: ContentInterface[]): object[] {
    return data.map(d => ({ text: d.name, data: d }));
  }

  /**
   *  Extracts the extension from a filename
   *
   * @private
   * @param {string} fileName
   * @returns
   * @memberof DataConverterService
   */
  private getExtension(fileName: string) {
    return fileName.substring(fileName.lastIndexOf('.') + 1);
  }

  /**
   * Evaluates Educontent to build an array of possible actions
   *
   * @private
   * @param {EduContentInterface} content
   * @returns {string[]}
   * @memberof DataConverterService
   */
  private getActionsFromEducontent(content: EduContentInterface): string[] {
    const actionsArray: string[] = [];
    // Geen idee op welke basis dit wordt beslist
    // Andere mogelijkheid: action-object maken en ook icon en payload mee geven
    if (content.id) {
      actionsArray.push('file');
    }
    return actionsArray;
  }

  /**
   * Evaluates Usercontent to build an array of possible actions
   *
   * @private
   * @param {UserContentInterface} content
   * @returns {string[]}
   * @memberof DataConverterService
   */
  private getActionsFromUsercontent(content: UserContentInterface): string[] {
    const actionsArray: string[] = [];
    if (content.link) {
      actionsArray.push('link');
    }
    return actionsArray;
  }
}

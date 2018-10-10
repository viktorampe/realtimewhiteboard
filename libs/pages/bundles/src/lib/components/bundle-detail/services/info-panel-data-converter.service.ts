import { Injectable } from '@angular/core';
import { ContentInterface } from '@campus/dal';

@Injectable({
  providedIn: 'root'
})
export class InfoPanelDataConverterService {
  public transformToContentForInfoPanel(data: ContentInterface): object {
    return {
      name: data.name,
      description: data.description,
      extension: data.fileExtension,
      productType: data.productType,
      methods: data.methodLogos,
      status: data.status
    };
  }

  public transformToContentsForInfoPanel(data: ContentInterface[]): object[] {
    return data.map(d => ({ text: d.name, data: d }));
  }
}

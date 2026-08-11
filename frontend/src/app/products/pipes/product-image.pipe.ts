import { Pipe, PipeTransform } from '@angular/core';
import { environment } from 'src/environments/environment';

const baseUrl = environment.baseUrl;

@Pipe({
  name: 'productImage'
})

export class ProductImagePipe implements PipeTransform {
  transform(value: null | string | string[], ...args: any[]): string {
    const placeholder = './assets/images/no-image.jpg';

    if ( value == null ) {
      return placeholder;
    }

    if (typeof value == 'string') {
      if (value.startsWith('blob:')) {
        return value;
      }

      return `${baseUrl}/files/product/${value}`;
    }

    const image = value[0];
    if (!image) {
      return placeholder;
    }

    return `${baseUrl}/files/product/${image}`;
  }
}

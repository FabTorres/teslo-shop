import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'joinSizePipe'
})

export class JoinSizePipe implements PipeTransform {
  transform(value: string[], separator = ', '): string {
    return value.join(separator);
  }
}

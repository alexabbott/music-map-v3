import {Pipe, PipeTransform, Injectable} from '@angular/core';

@Pipe({ name: 'slugify' })
@Injectable()
export class SlugifyPipe implements PipeTransform {

  transform(input: any): any {

    if (typeof input !== 'string') {
      return input;
    }

    return (
      input
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, ' ')
      .replace(/[\s-]+/g, '-')
    );
  }
}
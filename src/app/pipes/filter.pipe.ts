import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'filter' })
@Injectable()
export class FilterPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {
        if (!items) return [];
        if (field && value) {
          return items.filter(it => it[field].indexOf(value) > -1);
        } else {
          return items;
        }
    }
}
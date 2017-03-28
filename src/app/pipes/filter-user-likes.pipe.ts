import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({ name: 'filterUserLikes' })
@Injectable()
export class FilterUserLikesPipe implements PipeTransform {
    transform(items: any[], field : string, value : string): any[] {
        if (!items) return [];
        if (field && value) {
          return items.filter(it => {
            if (it[field]) {
              console.log('match');
              value in it[field];
            }
          });
        } else {
          return items;
        }
    }
}
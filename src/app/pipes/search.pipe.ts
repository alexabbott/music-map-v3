import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name:'search',
  pure: false
})
@Injectable()
export class SearchPipe implements PipeTransform {

  transform(items :any ,term :any): any {
    if(term === undefined) return items;

    if (items) {
      return items.filter( function(item){
        if (item.name && item.location && item.userName && item.tag) {
          return item.name.toLowerCase().includes(term.toLowerCase()) || item.location.toLowerCase().includes(term.toLowerCase()) || item.userName.toLowerCase().includes(term.toLowerCase()) || item.tag.toLowerCase().includes(term.toLowerCase());
        }
      })
    }
  }
}
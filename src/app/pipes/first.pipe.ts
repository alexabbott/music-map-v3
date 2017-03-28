import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'first' })
export class FirstPipe implements PipeTransform {
  transform(val, args) {
    if (val === null) return val;
    return val[0];
  }
}

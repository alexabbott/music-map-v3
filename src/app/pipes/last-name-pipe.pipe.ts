import { Pipe, PipeTransform, Injectable } from '@angular/core';

@Pipe({
  name: 'lastNamePipe'
})
@Injectable()
export class LastNamePipePipe implements PipeTransform {

  transform(input: any): any {

    if (typeof input !== 'string') {
      return input;
    } else {
      input = input.split(' ')[0] + ' ' + input.split(' ')[(input.split(' ').length - 1)][0];
    }

    return (
      input
    );
  }

}

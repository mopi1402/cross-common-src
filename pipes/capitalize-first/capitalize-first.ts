import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'capitalizeFirst',
} )
export class CapitalizeFirstPipe implements PipeTransform {
  /**
   * Capitalize the first letter only
   *
   * @param {string} value
   * @param {any[]} args
   * @returns {string}
   * @memberof CapitalizeFirstPipe
   */
  transform( value: string, args: any[] ): string {
    if ( value === null ) return '';
    let result = value.toLowerCase();
    result = result.charAt( 0 ).toUpperCase() + result.slice( 1 );
    return result;
  }
}

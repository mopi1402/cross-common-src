import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
  name: 'formatName',
} )
export class FormatNamePipe implements PipeTransform {
  /**
   * Capitalize the first letter and lower all others
   *
   * @param {string} value
   * @param {*} args
   * @returns
   * @memberof FormatNamePipe
   */
  transform( value: string, ...args ) {
    return !value ? "" : value.replace( /[^ 0-9-]*/g, function ( txt ) { return txt.charAt( 0 ).toUpperCase() + txt.substr( 1 ).toLowerCase(); } );
  }
}

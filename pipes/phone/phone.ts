import { Pipe, PipeTransform } from '@angular/core';

@Pipe( {
    name: 'phone'
} )
export class PhonePipe implements PipeTransform {
    /**
     * Transform a set of digits to a french phone number (00 00 00 00 00)
     *
     * @param {*} val
     * @param {*} args
     * @returns
     * @memberof PhonePipe
     */
    transform( val, args ) {
        val = val.charAt( 0 ) != 0 ? '0' + val : '' + val;
        let newStr = '';

        for ( var i = 0; i < ( Math.floor( val.length / 2 ) - 1 ); i++ ) {
            newStr = newStr + val.substr( i * 2, 2 ) + ' ';
        }
        return newStr + val.substr( i * 2 );
    }

}
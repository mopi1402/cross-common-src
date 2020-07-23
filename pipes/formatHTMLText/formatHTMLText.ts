import { DomSanitizer } from '@angular/platform-browser'
import { PipeTransform, Pipe } from "@angular/core";

@Pipe( { name: 'formatHTMLText' } )
export class formatHTMLTextPipe implements PipeTransform {
    constructor() { }

    /**
     *
     * Function used to replace http link by clickable link in html
     * @param {string} value
     * @returns
     * @memberof formatHTMLTextPipe
     */
    transform( value: string ) {
        return value.replace( /(\r\n|\n|\r)/g, "<br />" ).replace( /(http|ftp|https):\/\/([\w +?\.\w +])+([a-zA-Z0-9\~\!\@\#\$\%\^\&\*\(\)_\-\=\+\\\/\?\:\;\'\,]*)/g, "<a href =$&>$&</a>" );
    }
}
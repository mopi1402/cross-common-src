interface IFileEntry {
  file( successCallback: Function, errorCallback?: Function ): void;
}

/**
 * Cette classe permet de travailler sur les bytes, les blobs et les fichiers
 *
 * @export
 * @class FileUtils
 */
export class FileUtils {

  /**
  * Convert a base64 string in a Blob according to the data and contentType.
  *
  * @param b64Data {String} Pure base64 string without contentType
  * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
  * @param sliceSize {Int} SliceSize to process the byteCharacters
  * @see http://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  * @return Blob
  */
  static b64toBlob( b64Data: string, contentType: string = '', sliceSize: number = 512 ) {
    let byteCharacters = atob( b64Data );
    let byteArrays = [];
    let slice: string;
    let byteNumbers;
    let sliceLength: number;
    let byteArray: Uint8Array;

    for ( let offset = 0, length = byteCharacters.length; offset < length; offset += sliceSize ) {
      slice = byteCharacters.slice( offset, offset + sliceSize );
      sliceLength = slice.length;
      byteNumbers = new Array( sliceLength );
      for ( let i = 0; i < sliceLength; i++ ) {
        byteNumbers[ i ] = slice.charCodeAt( i );
      }

      byteArray = new Uint8Array( byteNumbers );
      byteArrays.push( byteArray );
    }

    let blob = new Blob( byteArrays, { type: contentType } );
    return blob;
  }

  static bufferToBlob( bytes: ArrayBuffer | Uint8Array, contentType: string = '' ) {
    let data: Uint8Array = ( bytes instanceof Uint8Array ? bytes : new Uint8Array( bytes ) );
    let options = ( contentType ? { type: contentType } : null );
    return new Blob( [ data ], options );
  }

  /**
  * Convert a string in a Blob according to the data and contentType.
  *
  * @param stringData {String} Pure string without contentType
  * @param contentType {String} the content type of the file i.e (image/jpeg - image/png - text/plain)
  * @param sliceSize {Int} SliceSize to process the byteCharacters
  * @return Blob
  */
  static stringtoBlob( stringData: string, contentType: string = '', sliceSize: number = 512 ) {

    let blob = new Blob( [ stringData ], { type: contentType } );
    return blob;
  }

  /**
   * Fait passer un objet pour un simple blob
   *
   * @static
   * @param {File} file
   * @returns {Blob}
   * @memberof FileUtils
   */
  static fileToBlob( file: File ): Blob {
    return <Blob>file;
  }

  /**
   * Converti un fichier ou on blob en une URL consultable depuis un img src par exemple
   *
   * @static
   * @param {(File | Blob)} data
   * @returns
   * @memberof FileUtils
   */
  static fileToURL( data: File | Blob ) {
    return URL.createObjectURL( data );
  }

  /**
   * Converti un blob en fichier
   *
   * @export
   * @param {Blob} blob
   * @param {string} filename
   * @returns {File}
   */
  static blobToFile( blob: Blob, filename: string ): File {
    let file: any = blob;
    file.name = filename;
    file.lastModified = new Date();
    //NOTE mopi : pas trouvé de moyen de convertir proprement sans que le blob soit perdu !
    //Object.setPrototypeOf( file, File );
    //file.__proto__ = File.prototype;
    return file;
  }

  static extractFilePath( path: string ): string {
    return path.substring( 0, path.lastIndexOf( "/" ) );
  }

  static extractFileName( path: string ): string {
    return path.replace( /^.*[\\\/]/, '' );
  }

  static renameFile( file: File, newFilename: string ) {
    ( file as any ).name = newFilename;
  }

  static toFile( fileEntry: IFileEntry ): Promise<File> {
    return new Promise( ( resolve, reject ) => {
      fileEntry.file( ( file: File ) => { resolve( file ); }, ( error ) => { reject( error ) } );
    } );

  }

}
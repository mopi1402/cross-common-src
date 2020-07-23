import { FileUtils } from "./FileUtils";
import { File as NativeFile } from '@ionic-native/file';

/**
 * Cette classe permet de travailler sur les bytes, les blobs et les fichiers
 * Elle a besoin du plugin File from '@ionic-native' pour fonctionner.
 *
 * @export
 * @class NativeFileUtils
 */
export class NativeFileUtils {

    private static _nativeFile: NativeFile;

    private static _isInitialized = false;

    /**
     * Il faut instancier le service pour qu'il fonctionne, en lui passant le plugin
     *
     * @static
     * @param {NativeFile} file
     * @memberof NativeFileUtils
     */
    static init( file: NativeFile ) {
        this._nativeFile = file;
        this._isInitialized = true;
    }

    static checkInit(): void {
        if ( !this._isInitialized ) {
            throw new Error( "Il faut instancier le service NativeFileUtils en lui passant @ionic-native/File" );
        }
    }

    /**
     * Retourne un File à partir d'un chemin d'accès natif.
     * Non fonctionnelle ?
     *
     * @static
     * @param {string} nativePath
     * @returns {Promise<File>}
     * @memberof NativeFileUtils
     */
    static getFile2( nativePath: string ): Promise<File> {

        this.checkInit();

        return new Promise( ( resolve, reject ) => {
            //Recupère un fichier à partir de l'URL
            this._nativeFile.resolveDirectoryUrl( FileUtils.extractFilePath( nativePath ) )
                .then( directoryEntry => {

                    this._nativeFile.getFile( directoryEntry, FileUtils.extractFileName( nativePath ), null )
                        .then( fileEntry => {

                            FileUtils.toFile( fileEntry )
                                .then( file => {
                                    resolve( file );
                                },
                                    ( error ) => { reject( error ) } )
                        }, ( error ) => { reject( error ) } )

                }, ( error ) => { reject( error ) } )
        } )

    }

    /**
     * Génère un fichier en mémoire à partir du contenu d'un fichier
     *
     * @static
     * @param {string} nativePath
     * @returns {Promise<File>}
     * @memberof NativeFileUtils
     */
    static getFile( nativePath: string, filename: string, contentType?: string ): Promise<File> {

        this.checkInit();

        return new Promise( ( resolve, reject ) => {

            //Recupère un fichier à partir de l'URL

            this._nativeFile.readAsArrayBuffer( FileUtils.extractFilePath( nativePath ), FileUtils.extractFileName( nativePath ) )
                .then( ( value ) => {

                    let file: File = FileUtils.blobToFile( FileUtils.bufferToBlob( value, contentType ), filename );
                    resolve( file );

                }, ( error => reject( error ) ) )

        } );
    }

}
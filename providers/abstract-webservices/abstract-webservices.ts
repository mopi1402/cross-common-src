import { HttpClient, HttpRequest, HttpParams, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

// The request's methods
export enum Http_Methods {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE"
}

// The content types for the headers
export enum Content_Types {
  APPLICATION_JSON = 'application/json',
  MULTIPART_FORM_DATA = 'multipart/form-data',
  TEXT_PLAIN = 'text/plain'
}

@Injectable()
export class AbstractWebServices {

  // The api address of the application
  private _host: string = '';

  constructor( public http: HttpClient ) { }

  get host(): string {
    return this._host;
  }
  set host( host: string ) {
    this._host = host;
  }

  /**
   * Generate the HttpParams
   *
   * @protected
   * @param {(Object | JSON)} data  the data to pass in parameters
   * @param {HttpParams} [params] existing HttpParams if needed
   * @returns {HttpParams}
   * @memberof WebServicesAbstract
   */
  protected generateParameters( data: Object | JSON, params?: HttpParams ): HttpParams {
    let result = params || new HttpParams();
    if ( !data ) return result;

    let toIterate = data instanceof Object ? Object.keys( data ) : Object.keys( JSON.parse( JSON.stringify( data ) ) );

    toIterate.forEach( key => {

      if ( data[ key ] ) {

        if ( data[ key ].forEach ) {
          data[ key ].forEach( element => {
            if ( !key.includes( '[]' ) ) result = result.append( key + '[]', element );
            else result = result.append( key, element );
          } );
        } else {
          result = result.append( key, data[ key ] );
        }
      }
    } );

    return result;
  }


  /**
   * Generate the HttpHeaders
   *
   * @private
   * @param {string} contentType from the object CONTENT_TYPES
   * @param {HttpHeaders} [headers] existing HttpHeaders if needed
   * @returns {HttpHeaders}
   * @memberof WebServicesAbstract
   */
  protected generateHeaders( contentType: string, headers?: HttpHeaders ): HttpHeaders {
    let result = headers || new HttpHeaders();

    if ( contentType ) {
      result = result.append( 'Content-Type', contentType );
    }

    return result;
  }

  /**
   * Génère en interne la requete a envoyer au serveur
   *
   * @protected
   * @param {string} service API endpoint
   * @param {string} method POST, GET...
   * @param {(Object | JSON)} data the data to pass in parameters
   * @param {HttpParams} params existing params if needed
   * @param {boolean} needAuthentification is authentification needed
   * @param {HttpHeaders} headers existing headers if needed
   * @param {('arraybuffer' | 'blob' | 'json' | 'text')} responseType what type of response do we expect
   * @returns {HttpRequest<any>}
   * @memberof WebServicesAbstract
   */
  protected generateRequest(
    service: string,
    method: string,
    data: Object | JSON,
    params: HttpParams,
    isAbsolute: Boolean,
    needAuthentification: boolean,
    headers: HttpHeaders,
    responseType: 'arraybuffer' | 'blob' | 'json' | 'text' ): HttpRequest<any> {

    //Need this to use the feed in the actualities
    let finalService = this._host + service;
    if ( isAbsolute ) {
      finalService = service;
    }

    let request: HttpRequest<any> = new HttpRequest<any>(
      method,                   // La méthode utilisée pour l'envoi des données
      finalService,             // L'url du service
      data,                     // The body / Les paramètres à envoyer
      {
        headers: headers,
        reportProgress: false,
        params: params,         // Envoi toutes les données sous la forme de paramètres
        responseType: responseType,   // Le type de réponse souhaité : json
        withCredentials: needAuthentification
      }
    );

    return request;
  }


  /**
   * Send the request to the API endpoint
   * @param {string} service API endpoint
   * @param {string} method POST, GET...
   * @param {(Object | JSON)} [data=null] the data to pass in parameters
   * @param {HttpParams} [params=null] existing params if needed
   * @param {boolean} [needAuthentification=false] is authentification needed
   * @param {HttpHeaders} [headers=null] existing headers if needed
   * @param {string} [contentType=null] value of contentType
   * @param {('arraybuffer' | 'blob' | 'json' | 'text')} [responseType='json'] what type of response do we expect
   * @returns {Promise<any>}
   * @memberof WebServicesAbstract
   */
  public launchRequest(
    service: string,
    method: string,
    data: Object | JSON = null,
    params: HttpParams = null,
    isAbsolute: Boolean,
    needAuthentification: boolean = false,
    headers: HttpHeaders = null,
    contentType: string = null,
    responseType: 'arraybuffer' | 'blob' | 'json' | 'text' = 'json' ): Observable<Response> {
    // Parameters construction
    if ( data !== null ) {
      params = params || new HttpParams();//this.generateParameters( data, params );
    }

    // Header construction
    //headers = this.generateHeaders( contentType || Content_Types.APPLICATION_JSON, headers );
    headers = this.generateHeaders( contentType, headers );

    let httpPromise: Observable<any>;

    let request = this.generateRequest( service, method, data, params, isAbsolute, needAuthentification, headers, responseType );

    httpPromise = this.http.request<Response>( request );
    return httpPromise;

    // TODO: externalise errors management
    // // The promise returned by the function, resolved when the request is in succes, reject in error
    // let promise = new Promise( ( resolve, reject ): void => {
    //   httpPromise.subscribe(
    //     function ( response ) {
    //       resolve( response );
    //     },
    //     function ( error ) {
    //       if ( error.status == 401 ) {
    //         console.log( "Token expiré, déconnection !", error );
    //       }
    //       if ( error.status === 0 ) {
    //         error.data = 'USER.CANCELLED';
    //       } else if ( error.status === -1 ) {
    //         error.data = 'NETWORK.TIMEOUT';
    //       }
    //       reject( error );
    //     }
    //   );
    // } );
  }

/**
 * Permet de télécharger des fichiers
 * @param url            url de téléchargement
 * @param contentType    content type du fichier à télécharger
 * @param responseType   type de transfert, normalement blob
 */
  public getFileFromURL( url: string, contentType: string, responseType:any='blob' ): Observable<any> {
    let headers = new HttpHeaders().append( 'Accept', contentType );
    return this.launchRequest( url, Http_Methods.GET,null,null,null,null,headers,contentType, responseType );
  }
}
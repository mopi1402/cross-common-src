import { Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';

/**
 * This class give a look to Ionic more smooth and sexy 
 * - fix Ionic Keyboard overlay input
 * - hide Splash Screen when application is loaded
 * 
 * 
 * NOTE : Add this to config.xml : 
 * <preference name="SplashScreenDelay" value="10000" />
 * <preference name="KeyboardResizeMode" value="ionic" />
 * 
 * usage : 
 * export class MyApp extends IonicBeautifier {
 *   constructor( platform: Platform, splashScreen: SplashScreen ) {
 *     super( platform, splashScreen );
 *   }
 * }
 *
 *
 * @export
 * @class IonicBeautifier
 * 
 */
export class IonicBeautifier {

    constructor( platform: Platform, splashScreen: SplashScreen ) {

        //Fix ionic bug for keyboard overlay input 
        window.addEventListener( "keyboardDidShow", () => {
            document.activeElement.scrollIntoView( { behavior: 'smooth', inline: 'nearest', block: 'center' } );
        } );

        platform.ready().then( () => {

            if ( platform.is( 'cordova' ) ) {
                setTimeout( () => splashScreen.hide(), 1000 );
            }

        } );
    }

}
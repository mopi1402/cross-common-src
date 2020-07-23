import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network';
import { Subscription, BehaviorSubject } from 'rxjs';

@Injectable()
export class NetworkProvider {

    private _onConnect: Subscription;
    private _onDisconnect: Subscription;

    private _isConnected: boolean;
    private _isConnectedSubscription: BehaviorSubject<boolean>;

    constructor( private network: Network ) {
        this._isConnectedSubscription = new BehaviorSubject<boolean>( false );
        this._isConnectedSubscription.subscribe( ( b: boolean ) => {
            this._isConnected = b;
        } );

        this._onConnect = this.network.onConnect().subscribe( ( data ) => {
            this._isConnectedSubscription.next( true );
        } );

        this._onDisconnect = this.network.onDisconnect().subscribe( ( data ) => {
            this._isConnectedSubscription.next( false );
        } );
    }

    checkConnection(): BehaviorSubject<boolean> {
        return this._isConnectedSubscription;
    }

    get isConnected(): boolean {
        return this._isConnected;
    }

}

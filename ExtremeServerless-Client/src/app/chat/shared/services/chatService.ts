import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {HubConnection} from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';
import {Observable} from 'rxjs';
import {ConnectionConfig} from '../model/connectionConfig';
import {map} from 'rxjs/operators';
import {Subject} from 'rxjs';
import {environment} from 'environments/environment';
import {Message} from '../model/message';

@Injectable()
export class ChatService {
  private _hubConnection: HubConnection;

  public messages: Subject<Message> = new Subject();

  constructor(private _http: HttpClient) {
  }

  private getConnectionInfo(): Observable<ConnectionConfig> {
    let requestUrl = `${environment.apiBaseUrl}config`;

    return this._http.get<ConnectionConfig>(requestUrl);
  }

  public init() {
    console.log(`Initializing ChatService...`);

    this.getConnectionInfo().subscribe(config => {
      console.log(`Received info for endpoint ${config.hubUrl}`);

      let options = {
        accessTokenFactory: () => config.accessToken
      };

      this._hubConnection = new signalR.HubConnectionBuilder()
        .withUrl(config.hubUrl, options)
        .configureLogging(signalR.LogLevel.Information)
        .build();

      this._hubConnection.start().catch(err => console.error(err.toString()));
      // TODO: only start when no error from start()...
      this._hubConnection.on('NewMessages', (data: any) => {
        // Seems we need to do this with the early stage of SignalR...
        var message = JSON.parse(data);
        this.messages.next(message);
      });
    });
  }

  public send(message: Message) {
    let requestUrl = `${environment.apiBaseUrl}save`;

    return this._http.post(requestUrl, message);
  }
}

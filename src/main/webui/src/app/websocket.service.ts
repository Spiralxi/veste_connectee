import { Injectable } from '@angular/core';
import * as Stomp from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient: Stomp.Client | null = null;
  private sensorDataSubject: Subject<any> = new Subject<any>();

  constructor() {
    this.connect();
  }

  private connect(): void {
    const socket = new SockJS('http://localhost:8080/websocket');
    this.stompClient = Stomp.over(socket);
    this.stompClient.connect({}, () => {
      console.log('WebSocket connected');
      this.stompClient?.subscribe('/topic/sensor', (message) => {
        if (message.body) {
          this.sensorDataSubject.next(JSON.parse(message.body));
        }
      });
    });
  }

  public getSensorData() {
    return this.sensorDataSubject.asObservable();
  }
}

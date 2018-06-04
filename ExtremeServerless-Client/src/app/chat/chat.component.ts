import {Component, OnInit, ViewChildren, ViewChild, AfterViewInit, QueryList, ElementRef, NgZone} from '@angular/core';
import {MatDialog, MatDialogRef, MatList, MatListItem} from '@angular/material';

import {Message} from './shared/model/message';
import {User} from './shared/model/user';
import {DialogUserComponent} from './dialog-user/dialog-user.component';
import {DialogUserType} from './dialog-user/dialog-user-type';
import {ChatService} from './shared/services/chatService';

const AVATAR_URL = 'https://api.adorable.io/avatars/285';

@Component({
  selector: 'tcc-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit, AfterViewInit {
  user: User;
  messages: Message[] = [];
  messageContent: string;
  dialogRef: MatDialogRef<DialogUserComponent> | null;
  defaultDialogUserParams: any = {
    disableClose: true,
    data: {
      title: 'Welcome',
      dialogType: DialogUserType.NEW
    }
  };

  @ViewChild(MatList, { read: ElementRef }) matList: ElementRef;

  @ViewChildren(MatListItem, { read: ElementRef }) matListItems: QueryList<MatListItem>;

<<<<<<< HEAD
  constructor(private _chatService: ChatService, 
    public dialog: MatDialog) { }
=======
  constructor(private _chatService: ChatService, private _zone: NgZone,
              public dialog: MatDialog) {
  }
>>>>>>> c98ec3d8d692091bec30f70869c10663f3baba1a

  ngOnInit(): void {
    this.initModel();
    // Using timeout due to https://github.com/angular/angular/issues/14748
    setTimeout(() => {
      this.openUserPopup(this.defaultDialogUserParams);
    }, 0);

    this._chatService.init();
<<<<<<< HEAD
    this._chatService.messages.subscribe(messagesFromServer => {
      this.messages = this.messages.concat(messagesFromServer);
=======
    this._chatService.messages.subscribe(message => {
      //this._zone.run(() =>{
      this.messages.push(message);
      //});
>>>>>>> c98ec3d8d692091bec30f70869c10663f3baba1a
    });
  }

  ngAfterViewInit(): void {
    this.matListItems.changes.subscribe(elements => {
      this.scrollToBottom();
    });
  }

  // auto-scroll fix: inspired by this stack overflow post
  // https://stackoverflow.com/questions/35232731/angular2-scroll-to-bottom-chat-style
  private scrollToBottom(): void {
    try {
      this.matList.nativeElement.scrollTop = this.matList.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  private initModel(): void {
    const randomId = this.getRandomId();
    this.user = {
      id: randomId,
      avatar: `${AVATAR_URL}/${randomId}.png`
    };
  }

  private getRandomId(): number {
    return Math.floor(Math.random() * (1000000)) + 1;
  }

  private openUserPopup(params): void {
    this.dialogRef = this.dialog.open(DialogUserComponent, params);
    this.dialogRef.afterClosed().subscribe(paramsDialog => {
      if (!paramsDialog) {
        return;
      }

      this.user.name = paramsDialog.username;
    });
  }

  public sendMessage(message: string): void {
    if (!message) {
      return;
    }

    this._chatService.send({
      user: this.user,
      message: message
    }).subscribe();

    this.messageContent = null;
  }
}

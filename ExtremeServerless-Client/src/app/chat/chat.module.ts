import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MaterialModule } from '../shared/material/material.module';

import { ChatComponent } from './chat.component';
import { DialogUserComponent } from './dialog-user/dialog-user.component';
import { ChatService } from './shared/services/chatService';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    HttpClientModule
  ],
  declarations: [ChatComponent, DialogUserComponent],
  providers: [ChatService],
  entryComponents: [DialogUserComponent]
})
export class ChatModule { }

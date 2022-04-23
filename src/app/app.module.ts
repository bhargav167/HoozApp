import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { TopNavBarComponent } from './Shared/TopNavBar/TopNavBar.component';
import { JobPostComponent } from './Job/JobPost/JobPost.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SocialLoginModule, SocialAuthServiceConfig } from 'angularx-social-login';
import {
  GoogleLoginProvider,
  FacebookLoginProvider
} from 'angularx-social-login';
import { HttpClientModule } from '@angular/common/http';
import { JobListComponent } from './Job/JobList/JobList.component';
import { JobDetailComponent } from './Job/JobDetails/JobDetail.component';
import { UserProfileComponent } from './Profile/UserProfile/UserProfile.component';
import { WallListComponent } from './Wall/wallList/wallList.component';
import { LoginComponent } from './Auth/Login/Login.component';
import { EditComponent } from './Profile/EditProfile/Edit.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { AgmCoreModule } from '@agm/core';
import { MessagesComponent } from './Shared/messages/messages.component';
import { HotToastModule } from '@ngneat/hot-toast';
// for HttpClient import:
import { LoadingBarHttpClientModule } from '@ngx-loading-bar/http-client';

// for Router import:
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';

// for Core import:
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { SharedService } from './services/SharedServices/Shared.service';
import { JobEditComponent } from './Job/JobEdit/JobEdit.component';
import { HelpDeskComponent } from './Settings/HelpDesk/HelpDesk.component';
import { DownloadComponent } from './Settings/Download/Download.component';
import { UserListComponent } from './Wall/UserList/userList.component';
import { ClipboardModule } from 'ngx-clipboard';
import { ChatsComponent } from './ChatModule/Chats/Chats.component';
import { ChatboxComponent } from './ChatModule/Chatbox/Chatbox.component';
@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    JobPostComponent,
    JobListComponent,
    JobDetailComponent,
    JobEditComponent,
    UserProfileComponent,
    LoginComponent,
    EditComponent,
    MessagesComponent,
    HelpDeskComponent,
    DownloadComponent,
    UserListComponent,
    WallListComponent,
      ChatsComponent,
      ChatboxComponent
   ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    AppRoutingModule,
    SocialLoginModule,
    ClipboardModule,
    HttpClientModule,
    InfiniteScrollModule,
      // for HttpClient use:
      LoadingBarHttpClientModule,

      // for Router use:
      LoadingBarRouterModule,

      // for Core use:
      LoadingBarModule,
    HotToastModule.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2FrT93DXiG5u9Ow2LCAie6wIxoQzv5qQ',
      libraries: ['places']
    })
  ],
  providers: [
    SharedService,
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '547202752586-q5lou7tho2mp7ej1g7cfci3hq5offm46.apps.googleusercontent.com'
            )
          },
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('clientId')
          },

        ]
      } as SocialAuthServiceConfig,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}

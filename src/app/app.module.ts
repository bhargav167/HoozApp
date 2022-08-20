
import { JobDetailComponent } from './Job/JobDetails/JobDetail.component';
import { SharedModule } from './Shared/Shared.module';
import { UserListComponent } from './Wall/UserList/userList.component';
import { LoginComponent } from './Auth/Login/Login.component';
import { NgModule } from '@angular/core';
import { BrowserModule, BrowserTransferStateModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppRoutingModule } from './app-routing.module';
import { LoadingBarRouterModule } from '@ngx-loading-bar/router';
import { LoadingBarModule } from '@ngx-loading-bar/core';
import { AppComponent } from './app.component';

import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { TopNavBarComponent } from './Shared/TopNavBar/TopNavBar.component';
import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { HotToastModule } from '@ngneat/hot-toast';
import { SharedService } from './services/SharedServices/Shared.service';
import { PendingChangesGuard } from './guard/activate-guard';
import { AgmCoreModule } from '@agm/core';
import { WallListComponent } from './Wall/wallList/wallList.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { NgxCopyToClipboardModule } from 'ngx-copy-to-clipboard';
import { TimeagoCustomFormatter, TimeagoFormatter, TimeagoIntl, TimeagoModule } from 'ngx-timeago';
import { DownloadComponent } from './Settings/Download/Download.component';
import { HelpDeskComponent } from './Settings/HelpDesk/HelpDesk.component';
import { JobEditComponent } from './Job/JobEdit/JobEdit.component';
import { JobListComponent } from './Job/JobList/JobList.component';
import { JobPostComponent } from './Job/JobPost/JobPost.component';
import { JobResponceComponent } from './Job/JobResponce/JobResponce.component';
import { ChatboxComponent } from './ChatModule/Chatbox/Chatbox.component';
import { ChatsComponent } from './ChatModule/Chats/Chats.component';
import { JobChatComponent } from './ChatModule/JobChat/JobChat.component';
import { EditComponent } from './Profile/EditProfile/Edit.component';
import { UserProfileComponent } from './Profile/UserProfile/UserProfile.component';
import { HomeSetComponent } from './Admin/HomeSet/HomeSet.component';
import { UserHomeComponent } from './Home/UserHome/UserHome.component';
export class MyIntl extends TimeagoIntl {
  // do extra stuff here...
  }
@NgModule({
  imports: [
    BrowserModule.withServerTransition({ appId: 'tour-of-heroes' }),
    BrowserTransferStateModule,
   SharedModule,
   CommonModule,
   FormsModule,
   ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    LoadingBarRouterModule,
    InfiniteScrollModule,
    NgxCopyToClipboardModule,
    TimeagoModule.forRoot({
      intl: { provide: TimeagoIntl },
      formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
    }),

    SocialLoginModule,
    // for Core use:
    LoadingBarModule,
    HotToastModule.forRoot(),
    SweetAlert2Module.forRoot(),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyC2FrT93DXiG5u9Ow2LCAie6wIxoQzv5qQ',
      libraries: ['places']
    })
  ],
  declarations: [
    AppComponent,
    TopNavBarComponent,
    LoginComponent,
    WallListComponent,
    UserListComponent,
    JobDetailComponent,
    JobEditComponent,
    JobListComponent,
    JobPostComponent,
    JobResponceComponent,
    ChatboxComponent,
    ChatsComponent,
    EditComponent,
    UserProfileComponent,
    JobChatComponent,
    HelpDeskComponent,
    DownloadComponent,
    HomeSetComponent,
    UserHomeComponent
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
            provider: new FacebookLoginProvider('447347270279612')
          },

        ]
      } as SocialAuthServiceConfig,
    },
    PendingChangesGuard
  ],
  bootstrap: [ AppComponent]
})
export class AppModule {
  constructor(
    @Inject(PLATFORM_ID) private platformId: object,
    @Inject(APP_ID) private appId: string) {
    const platform = isPlatformBrowser(platformId) ?
      'in the browser' : 'on the server';
    console.log(`Running ${platform} with appId=${appId}`);
  }
}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { AppComponent } from './app.component'; 
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './Shared/Shared.module';
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
import {CloudinaryModule} from '@cloudinary/ng';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { InfiniteScrollModule } from 'ngx-infinite-scroll'; 
 

@NgModule({
  declarations: [
    AppComponent,
    TopNavBarComponent,
    JobPostComponent,
    JobListComponent,
    JobDetailComponent,
    UserProfileComponent,
    LoginComponent,
    EditComponent,
    WallListComponent],
  imports: [ 
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    SharedModule,
    AppRoutingModule,
    SocialLoginModule,
    HttpClientModule,
    CloudinaryModule,
    AutocompleteLibModule,
    InfiniteScrollModule
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(
              '686535990215-6j4hhcqvmi1rdlqg8rq96da45o6gkpph.apps.googleusercontent.com'
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

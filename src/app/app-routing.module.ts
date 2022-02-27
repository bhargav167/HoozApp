import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './Auth/Login/Login.component';
import { AuthModalComponent } from './Auth/LoginModal/AuthModal/AuthModal.component';
import { authPageGaurd } from './guard/authPage.guard';
import { LoginGaurd } from './guard/Login.guard';
import { JobDetailComponent } from './Job/JobDetails/JobDetail.component'; 
import { JobEditComponent } from './Job/JobEdit/JobEdit.component';
import { JobListComponent } from './Job/JobList/JobList.component';
import { JobPostComponent } from './Job/JobPost/JobPost.component';
import { EditComponent } from './Profile/EditProfile/Edit.component';
import { UserProfileComponent } from './Profile/UserProfile/UserProfile.component';
import { DownloadComponent } from './Settings/Download/Download.component';
import { HelpDeskComponent } from './Settings/HelpDesk/HelpDesk.component';
import { MessagesComponent } from './Shared/messages/messages.component';
import { UserListComponent } from './Wall/UserList/userList.component';
import { WallListComponent } from './Wall/wallList/wallList.component';

const routes: Routes = [
  {
    path: 'login',
    component:LoginComponent,
    canActivate: [authPageGaurd]
  },
  {
    path: 'loginModal',
    component:AuthModalComponent
  },
  {
    path: 'jobpost',
    component:JobPostComponent,
    canActivate: [LoginGaurd]
  },
  {
    path: 'joblist',
    component:JobListComponent,
    canActivate: [LoginGaurd]
  },
  {
    path: 'jobDetails/:id',
    component:JobDetailComponent
  },
  {
    path: 'jobEdit',
    component:JobEditComponent
  },
  {
    path: 'profile/:id',
    component:UserProfileComponent
  },
  {
    path:'editProfile',
    component:EditComponent,
    canActivate: [LoginGaurd]
  },
  {
    path:'editJob',
    component:JobEditComponent,
    canActivate: [LoginGaurd]
  },
  {
    path:'message',
    component:MessagesComponent
  },
  {
    path: '',
    component:WallListComponent
  },
   
  {
    path: 'settings/helpDesk',
    component:HelpDeskComponent
  },
  {
    path: 'settings/download',
    component:DownloadComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}

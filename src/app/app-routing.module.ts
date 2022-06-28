import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './Auth/Login/Login.component';
import { ChatboxComponent } from './ChatModule/Chatbox/Chatbox.component';
import { ChatsComponent } from './ChatModule/Chats/Chats.component';
import { JobChatComponent } from './ChatModule/JobChat/JobChat.component';
import { PendingChangesGuard } from './guard/activate-guard';
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
import { WallListComponent } from './Wall/wallList/wallList.component';
const routes: Routes = [
  {
    path: 'login',
    component:LoginComponent,
    canActivate: [authPageGaurd]
  },
  {
    path: '',
    component:WallListComponent
  },

  {
    path: 'profile',
    component:UserProfileComponent
  },
  {
    path:'editProfile',
    component:EditComponent,
    canActivate: [LoginGaurd]
  },
  {
    path: 'jobDetails/:id',
    component:JobDetailComponent
  },
  {
    path: 'jobpost',
    component:JobPostComponent,
    canActivate: [LoginGaurd],
    canDeactivate: [PendingChangesGuard]
  },
  {
    path: 'joblist',
    component:JobListComponent,
    canActivate: [LoginGaurd]
  },
  {
    path:'jobEdit',
    component:JobEditComponent,
    canActivate: [LoginGaurd]
  },
  {
    path:'chat',
    component:ChatsComponent,
    canActivate: [LoginGaurd]
  },
  {
    path:'chatbox',
    component:ChatboxComponent,
    canActivate: [LoginGaurd]
  },
  {
    path:'jobchatbox',
    component:JobChatComponent,
    canActivate: [LoginGaurd]
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
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}

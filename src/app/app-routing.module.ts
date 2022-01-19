import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './Auth/Login/Login.component';
import { JobDetailComponent } from './Job/JobDetails/JobDetail.component';
import { JobListComponent } from './Job/JobList/JobList.component';
import { JobPostComponent } from './Job/JobPost/JobPost.component';
import { EditComponent } from './Profile/EditProfile/Edit.component';
import { UserProfileComponent } from './Profile/UserProfile/UserProfile.component';
import { MessagesComponent } from './Shared/messages/messages.component';
import { WallListComponent } from './Wall/wallList/wallList.component';

const routes: Routes = [
  {
    path: 'login',
    component:LoginComponent
  },
  {
    path: 'jobpost',
    component:JobPostComponent
  },
  {
    path: 'joblist',
    component:JobListComponent
  },
  {
    path: 'jobDetails/:id',
    component:JobDetailComponent
  },
  {
    path: 'profile/:id',
    component:UserProfileComponent
  },
  {
    path:'editProfile',
    component:EditComponent
  },
  {
    path:'message',
    component:MessagesComponent
  },
  {
    path: '',
    component:WallListComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}

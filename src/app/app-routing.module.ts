import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { JobPostComponent } from './JobPost/JobPost.component';

const routes: Routes = [
  {
    path: 'jobpost',
    component:JobPostComponent
  },
  // {
  //   path: 'profile',
  //   loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule)
  // },
  // {
  //   path: 'editor',
  //   loadChildren: () => import('./editor/editor.module').then(m => m.EditorModule)
  // },
  // {
  //   path: 'article',
  //   loadChildren: () => import('./article/article.module').then(m => m.ArticleModule)
  // }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules,
    relativeLinkResolution: 'legacy'
})],
  exports: [RouterModule]
})
export class AppRoutingModule {}

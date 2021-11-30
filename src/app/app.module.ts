import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser'; 
import { AppComponent } from './app.component'; 
import { AppRoutingModule } from './app-routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './Shared/Shared.module';
import { TopNavBarComponent } from './Shared/TopNavBar/TopNavBar.component';
import { JobPostComponent } from './JobPost/JobPost.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [AppComponent,TopNavBarComponent,JobPostComponent],
  imports: [
    BrowserModule,
    CoreModule,
     SharedModule,  
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JobModel } from '../../Model/Job/JobModel';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import {Location} from '@angular/common';
import swal from 'sweetalert2';
import { UserJobs } from '../../Model/Job/UserJobs';
import { ReportJobService } from '../../services/JobPost/ReportJob.service';
import { JobResponces } from '../../Model/Job/JobResponces';
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
import { ClipboardService } from 'ngx-clipboard'
import { HotToastService } from '@ngneat/hot-toast';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/en';
import { SharedService } from 'src/app/services/SharedServices/Shared.service';
import { SeoServiceService } from 'src/app/services/SeoService.service';
@Component({
  selector: 'app-JobDetail',
  templateUrl: './JobDetail.component.html',
  styleUrls: ['./JobDetail.component.scss'],
})
export class JobDetailComponent implements OnInit {
  jobSeo$: any;
  job!: JobModel;
  jobId: number = 0;
  loggedUserId!: number;
  loggeduser!: SocialAuthentication;
  userJob!: UserJobs;
  isJobAdded: boolean = false;
  IsOnResponces: boolean = false;
  IsChatActive:boolean=false;
  totalResponces: number = 0;
  jobResponces: JobResponces[] = [];
  public sharedLink: string = '';
  isCopied!: boolean;
  shareJobId: number = 0;
  senderIds!:number;
  constructor(
    private _jobServices: JobPostService,
    intl: TimeagoIntl,
    private navServices: NavbarCommunicationService,
    private _reportServices: ReportJobService,
    private activatedRoute: ActivatedRoute,
    private _clipboardService: ClipboardService,
    private toast: HotToastService,
    private _navigaterouter: Router,
    private _shareService: SharedService,
    private _seo: SeoServiceService,
    private _location: Location
  ) {
    this._jobServices
      .GetJobById(parseInt(this.activatedRoute.snapshot.paramMap.get('id')!))
      .subscribe((jb: any) => {
        console.log(jb);
        this._seo.generatesTags({
          title: jb[0]?.Descriptions,
          description: jb[0]?.Descriptions.trim(),
          image: jb[0]?.ThumbNailImage,
        });
      });
    this._shareService.checkInterNetConnection();
    intl.strings = englishStrings;
    intl.changes.next();
    this.activatedRoute.queryParams.subscribe((params) => {
      this.jobId = params['target'];
      if(params['onChat']){ 
        this.IsChatActive=true;
      }
      this.LoadJobDetailsById(this.jobId);
      this.loadUserData();
    });
  }
  //Load Basic User Data
  loadUserData() {
    if (localStorage.getItem('user')) {
      this.loggeduser = JSON.parse(localStorage.getItem('user')!);
      this.loggedUserId = this.loggeduser.Id;
      if (
        this.loggedUserId !=
        parseInt(this.activatedRoute.snapshot.paramMap.get('id')!)
      ) {
        this.loadResponcesData(this.loggedUserId);
      }
    }
  }

  ngOnInit() {
    if (
      this.loggedUserId !=
      parseInt(this.activatedRoute.snapshot.paramMap.get('id')!)
    ) {
      setInterval(() => {
        this.loadResponcesData(this.loggedUserId);
      }, 4000);
    }
  }

  showToast() {
    this.toast.success('Link copied!', {
      position: 'top-center',
    });
  }
  LoadJobDetailsById(id: number) {
    this._jobServices.GetJobById(id).subscribe((data: any) => {
      this.job = data[0];
      this.IsAddedJob(this.loggedUserId, this.jobId);
      console.log(this.job)
    });
  }

  loadResponcesData(userId: number) {
    this._jobServices
      .GetResponceCount(this.jobId, userId)
      .subscribe((data: any) => {
        this.totalResponces = data;
      });
  }

  //Job status update
  UpdateStatus($event: any) {
    swal
      .fire({
        text: `Are you sure to update status to ${$event.target.value}`,
        showDenyButton: true,
        confirmButtonText: 'Yes',
        denyButtonText: `No`,
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          this._jobServices
            .UpdateJobStatus(this.jobId, $event.target.value)
            .subscribe(
              () => {
                swal.fire('Job status updated successfully!', '', 'success');
              },
              (err) => {
                console.log(err);
              }
            );
        } else if (result.isDenied) {
          this._navigaterouter.navigateByUrl('/jobDetails/' + this.jobId);
        }
      });
  }

  //Check is this job added already
  IsAddedJob(userId: number, jobId: number) {
    this._jobServices.IsAddedJob(userId, jobId).subscribe((data: any) => {
      if (data.Status == 200) {
        this.isJobAdded = false;
      } else {
        this.isJobAdded = true;
      }
    });
  }
  // Job Added
  AddToJob() {
    let userJob = {
      jobModelId: this.jobId,
      socialAuthenticationId: this.loggedUserId,
    };
    swal.fire({
      text: 'Please wait.. Adding job',
      showConfirmButton: false,
      icon: 'info',
    });
    this._jobServices.AddJobToUser(userJob).subscribe(
      (data: any) => {
        if (data._responce.Status == 422) {
          swal.fire(`Job ${this.jobId} removed successfully!`, '', 'info');
          this.IsAddedJob(this.loggedUserId, this.jobId);
        } else {
          swal.fire(`Job ${this.jobId} Added successfully!`, '', 'success');
          this.IsAddedJob(this.loggedUserId, this.jobId);
        }
      },
      (err) => {
        console.log(err);
      }
    );
    // swal.fire({
    //   text: `Confirm to add Job Post Id: ${this.job.Id}`,
    //   showDenyButton: true,
    //   confirmButtonText: 'Yes',
    //   confirmButtonColor:'#00fa9a',
    //   denyButtonText: `No`,
    //   denyButtonColor:'black'
    // }).then((result) => {
    //   /* Read more about isConfirmed, isDenied below */
    //   if (result.isConfirmed) {

    //   } else if (result.isDenied) {

    //   }
    // })
  }

  // Job Removed
  RemoveToJob() {
    let userJob = {
      jobModelId: this.jobId,
      socialAuthenticationId: this.loggedUserId,
    };
    swal.fire({
      text: 'Please wait.. Removing job',
      showConfirmButton: false,
      icon: 'info',
    });
    this._jobServices.AddJobToUser(userJob).subscribe(
      (data: any) => {
        if (data._responce.Status == 422) {
          swal.fire(`Job ${this.jobId} removed successfully!`, '', 'info');
          this.IsAddedJob(this.loggedUserId, this.jobId);
        } else {
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  //Edit Job
  Edit(jobId: any) {
    sessionStorage.setItem('EditJobId', jobId);
    this._navigaterouter.navigate(['/jobEdit']);
  }
  ResponceTab() {
    this.IsOnResponces = !this.IsOnResponces;
    if(this.IsOnResponces==false){
      this.IsChatActive=false;

    }else{

    }
  }
  Chat(){
    if(this.loggedUserId){
      this.IsChatActive=!this.IsChatActive; 
    }else{
      this._navigaterouter.navigate(['/login']);
    }
  }

  Report() {
    swal
      .fire({
        title: `Report Post`,
        input: 'textarea',
        showDenyButton: true,
        confirmButtonText: 'Report',
        denyButtonText: `Cancel`,
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let reportJob = {
            jobModelId: this.jobId,
            socialAuthenticationId: this.loggedUserId,
            Isusue: result.value,
          };
          swal.fire({
            text: 'Please wait... Reporting',
            showConfirmButton: false,
            icon: 'info',
          });
          this._reportServices.ReportJob(reportJob).subscribe(
            (data: any) => {
              swal.fire(`Job ${this.job.Id} Reported!`, '', 'success');
            },
            (err) => {
              console.log(err);
            }
          );
        } else if (result.isDenied) {
          // swal.fire('Changes are not saved', '', 'info')
        }
      });
  }
  //Back loacation History
  backClicked() {
    this._location.back();
  }
  hideEvent() {
    this.navServices.Toggle();
  }
  public shareFB() {
    return window.open(
      'https://www.facebook.com/sharer/sharer.php?' +
        `u=https://hoozonline.com/jobDetails/${this.jobId}?target=` +
        this.jobId,
      'Hooz',
      `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=600,height=300,left=100,top=100`
    );
  }

  public shareTwitter() {
    return window.open(
      'https://twitter.com/share?' +
        `url=http://hoozonline.com/jobDetails/${this.jobId}?target=` +
        this.jobId,
      'Hooz',
      `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=600,height=300,left=100,top=100`
    );
  }
  public shareWhatsApp() {
    return window.open(
      `https://api.whatsapp.com/send?text=https://hoozonline.com/jobDetails/${this.jobId}?target=` +
        this.jobId,
      '_blank'
    );
  }

  //Shared Link
  GetSharedLink(jobId: number) {
    this.sharedLink =
      `https://hoozonline.com/jobDetails/${jobId}?target=` + this.jobId;
    this._clipboardService.copy(this.sharedLink);
    this.showToast();
  }
  RedirectToUser(userId: number) {
    this._navigaterouter.navigate(['/profile'], {
      queryParams: { target: userId },
    });
  }
  SetSenderId(id:number){
    sessionStorage.setItem("senderId",id.toString());
  }
  chatBack(eve:boolean){
    this.IsChatActive=false;
  }
  OnChat(){
    this.IsChatActive=true;
    return ('chatPg')
  }
  OnChatPg(){
    // if (this.IsChatActive=true) {
    //   return ('chatPg');
    // } else {
    //   return null;
    // }
    return ('chatPg')
  }
}

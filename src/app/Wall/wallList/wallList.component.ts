 import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { Pagination } from '../../Model/Pagination';
import { TagMaster } from '../../Model/TagMaster';
import { SocialAuthentication } from '../../Model/User/SocialAuthentication';
import { WallResponce } from '../../Model/Wall/WallResponce';
import { ProfileService } from '../../services/Auth/Profile.service';
import { SharedService } from '../../services/SharedServices/Shared.service';
import { WallService } from '../../services/Wall/Wall.service';
import swal from 'sweetalert2';
import { JobPostService } from '../../services/JobPost/JobPost.service';
import { ReportJobService } from '../../services/JobPost/ReportJob.service';
import { HotToastService } from '@ngneat/hot-toast';
import { ClipboardService } from 'ngx-clipboard'
import { NavbarCommunicationService } from '../../Shared/services/NavbarCommunication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
@Component({
  selector: "app-wallList",
  templateUrl: "./wallList.component.html",
  styleUrls: ["./wallList.component.scss"],
})
export class WallListComponent implements OnInit {
  currentPosition = window.pageYOffset;
  public flag: boolean = true;
  userParams: string = "";
  pagination: Pagination;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  walldata: WallResponce;
  walldatas: WallResponce[];
  isLoading: boolean = true;
  tag: TagMaster;
  noResultText: string = "Explore more with different keyword";
  user: SocialAuthentication;
  userId: number = 0;
  //Scroll Variable
  NotEmptPost: boolean = true;
  notScrollY: boolean = true;
  isLogedIn: boolean = false;

  isOnline: boolean;
  isJobAdded: boolean = false;
  shareJobId: number = 0;
  shareimgUrl:string;
  sharedLink: string;
   params :`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
   width=600,height=300,left=100,top=100`;
  // TabToggleTrackVariable
  IsOnJob: boolean = true;
  constructor(
    private meta: Meta,
    private _clipboardService: ClipboardService,
    private navServices:NavbarCommunicationService,
    private _wallServices: WallService,
    private activatedRoute: ActivatedRoute,
    private _reportServices: ReportJobService,
    private _jobServices: JobPostService,
    public _sharedServices: SharedService,
    private toast: HotToastService,
    private _router:Router
  ) {

  }
  ngOnInit() {
    this._sharedServices.checkInterNetConnection();
    this.activatedRoute.queryParams.subscribe(params => {
      const paramVal = params['searchTerm'];
       if (paramVal==undefined) {
        this.LoadWallData(
          this.currentPage,
          this.itemsPerPage,
          this.userParams,
          this.userId
        );
       }else{
         this.userParams=paramVal;
        this.LoadWallData(
          this.currentPage,
          this.itemsPerPage,
          paramVal,
          this.userId
        );
       }
    });

  }

  //For Nav
  LogOut() {
    localStorage.clear();
    location.href = "/";
  }
  showToast() {
    this.toast.success('Link copied!', {
      position: 'top-center',
    });
  }


  LoadWallData(currentPage: number, itemsPerPage: number, userParams, userId) {
    this.isLoading = true;
    this._wallServices
      .GetWall(currentPage, itemsPerPage, userParams, userId)
      .subscribe(
        (res: any) => {
          this.walldata = res.result;
          this.walldatas = res.result;
          this.pagination = res.pagination;
          this.isLoading = false;
          this.noResultText = "Explore more with different keyword";
        },
        (err) => {
          this.isLoading = false;
          this.walldatas = [];
          this.NotEmptPost = false;
          this.notScrollY = false;
          this.noResultText = `Sorry, we couldn't find any Post with ${userParams} tag.`;
        }
      );
  }
  LoadNextPost() {
    this.currentPage = this.currentPage + 1;
    this._wallServices
      .GetWall(
        this.currentPage,
        this.itemsPerPage,
        this.userParams,
        this.userId
      )
      .subscribe((res: any) => {
        const newData = res.result;
        this.isLoading = false;
        if (newData.length === 0) {
          this.NotEmptPost = false;
        }

        this.walldatas = this.walldatas.concat(newData);
        this.notScrollY = true;
        this.pagination = res.pagination;
      });
  }
  onScroll() {
    if (this.notScrollY && this.NotEmptPost) {
      this.noResultText = "Explore more with different keyword";
      this.isLoading = true;
      this.notScrollY = false;
      this.LoadNextPost();
    }
  }

  // Job Added
  AddToJob(jobId) {
    let userJob = {
      jobModelId: jobId,
      socialAuthenticationId: this.userId,
    };
    swal.fire({
      text: "Please wait.. Adding job",
      showConfirmButton: false,
      icon: "info",
    });
    this._jobServices.AddJobToUser(userJob).subscribe(
      (data: any) => {
        if (data._responce.Status == 422) {
          swal.fire(`This Job ${jobId} is already Added!`, "", "info");
        } else {
          swal.fire(`Job ${jobId} Added successfully!`, "", "success");
          this.LoadWallData(
            this.currentPage,
            this.itemsPerPage,
            this.userParams,
            this.userId
          );
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  // Job Removed
  RemoveToJob(jobId) {
    let userJob = {
      jobModelId: jobId,
      socialAuthenticationId: this.userId,
    };
    swal.fire({
      text: "Please wait.. Removing job",
      showConfirmButton: false,
      icon: "info",
    });
    this._jobServices.AddJobToUser(userJob).subscribe(
      (data: any) => {
        if (data._responce.Status == 422) {
          swal.fire(`Job ${jobId} Removed successfully!`, "", "success");
          this.LoadWallData(
            this.currentPage,
            this.itemsPerPage,
            this.userParams,
            this.userId
          );
        } else {
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  Report(jobId) {
    swal
      .fire({
        title: `Report`,
        input: "textarea",
        showDenyButton: true,
        confirmButtonText: "Report",
        confirmButtonColor: "#00fa9a",
        denyButtonText: `Cancel`,
        denyButtonColor: "black",
      })
      .then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
          let reportJob = {
            jobModelId: jobId,
            socialAuthenticationId: this.userId,
            Isusue: result.value,
          };
          swal.fire({
            text: "Please wait... Reporting",
            showConfirmButton: false,
            icon: "info",
          });
          this._reportServices.ReportJob(reportJob).subscribe(
            (data: any) => {
              swal.fire(`Job ${jobId} Reported!`, "", "success");
            },
            (err) => {
              console.log(err);
            }
          );
        } else if (result.isDenied) {
          swal.fire("Changes are not saved", "", "info");
        }
      });
  }

  // Suggetion list focous out
  hideEvent(){
    this.navServices.Toggle();
 }

  //Share Button
  getJobId(jobId,imgUrl) {
    this.shareimgUrl=imgUrl;
    this.shareJobId = jobId;
    this.meta.updateTag({ property: 'og:image:type', content: imgUrl });
   // window.document.querySelector('meta[property="og:image:type"]').setAttribute("content", imgUrl);
  }
  public shareFB(jobId) {
    return window.open(
      "https://www.facebook.com/sharer/sharer.php?" +
        "u=https://hoozonline.com/jobDetails?target=" +
        jobId,"Hooz",`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
        width=600,height=300,left=100,top=100`
    );
  }

  public shareTwitter(jobId) {
    return window.open(
      "http://twitter.com/share?" +
        "url=https://hoozonline.com/jobDetails?target=" +
        jobId,
       "Hooz",`scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,
       width=600,height=300,left=100,top=100`
    );
  }
  public shareWhatsApp(jobId) {
    return window.open(
      "https://api.whatsapp.com/send?text=https://hoozonline.com/jobDetails?target=" +
        jobId,
      "_blank"
    );
  }

  //Shared Link
  GetSharedLink(jobId) {
    this.sharedLink = "https://hoozonline.com/jobDetails?target="+jobId;
    this._clipboardService.copy(this.sharedLink);
    this.showToast();
  }
  //Checkbox toggle method
  checkValue(event: any) {
    this.IsOnJob = event;
  }
  LogoClick() {
    window.location.href = "/";
  }
  RedirectToJob(jobId){
    this._router.navigate(['/jobDetails'], { queryParams: {target: jobId}});
  }
  RedirectToUser(userId){
    this._router.navigate(['/profile'], { queryParams: {target: userId}});
  }
}

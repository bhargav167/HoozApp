import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { fromEvent, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
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

@Component({
  selector: "app-wallList",
  templateUrl: "./wallList.component.html",
  styleUrls: ["./wallList.component.scss"],
})
export class WallListComponent implements OnInit {
  @ViewChild("movieSearchInput", { static: true }) movieSearchInput: ElementRef;
  currentPosition = window.pageYOffset;
  public flag: boolean = true;
  userParams: string = "";
  pagination: Pagination;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  searchTerm: string;
  hidesearchlist: boolean = false;
  showClose: boolean = false;
  walldata: WallResponce;
  walldatas: WallResponce[];
  isLoading: boolean = true;
  tag: TagMaster;
  searchval: string;
  noResultText: string = "Explore more with different keyword";
  user: SocialAuthentication;
  userId: number = 0;
  //Scroll Variable
  NotEmptPost: boolean = true;
  notScrollY: boolean = true;
  isLogedIn: boolean = false;
  isShowingMenu: boolean = true;
  navbarUserPic: string =
    "http://res.cloudinary.com/livsolution/image/upload/c_fill,f_auto,g_faces,h_128,q_auto,w_128/DefaultUser_ktw7ga.png";

  isOnline: boolean;
  isJobAdded: boolean = false;
  shareJobId: number = 0;
  sharedLink: string;

  // TabToggleTrackVariable
  IsOnJob: boolean = true;
  constructor(
    private _clipboardService: ClipboardService,
    private _wallServices: WallService,
    private _reportServices: ReportJobService,
    private _profileServices: ProfileService,
    private _jobServices: JobPostService,
    private _sharedServices: SharedService,
    private _http: HttpClient,
    private toast: HotToastService
  ) {
    if (localStorage.getItem("user")) {
      this.user = JSON.parse(localStorage.getItem("user"));
      this.userId = this.user.Id;
      this._profileServices.GetUserProfile(this.user.Id).subscribe(
        (data: SocialAuthentication) => {
          this.navbarUserPic = data.UserImage;
        },
        (err) => {
          console.log("Something wen wrong" + err);
        }
      );
      this.isLogedIn = true;
    } else {
      this.isLogedIn = false;
    }
  }
  ngOnInit() {
    this._sharedServices.checkInterNetConnection();
    this.fireSearchlist();
    this.LoadWallData(
      this.currentPage,
      this.itemsPerPage,
      this.userParams,
      this.userId
    );
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
  //Search wall by click
  SearchByClick(searchTerm) {
    this.currentPage = 1;
    this.hidesearchlist = false;
    (document.getElementById("searchTag") as HTMLInputElement).value =
      searchTerm;
    this.userParams = searchTerm;
    this.LoadWallData(
      this.currentPage,
      this.itemsPerPage,
      searchTerm,
      this.userId
    );
  }
  //Search wall by enter
  SearchByEnter() {
    this.searchval = (
      document.getElementById("searchTag") as HTMLInputElement
    ).value;
    this.userParams = this.searchval;
    this.currentPage = 1;
    this.hidesearchlist = false;
    this.LoadWallData(
      this.currentPage,
      this.itemsPerPage,
      this.searchval,
      this.userId
    );
  }

  ClearSearch() {
    (document.getElementById("searchTag") as HTMLInputElement).value = "";
    this.showClose = false;
    this.hidesearchlist = false;
    this.searchval = "";
    this.userParams = "";
    this.NotEmptPost = true;
    this.LoadWallData(
      this.currentPage,
      this.itemsPerPage,
      this.userParams,
      this.userId
    );
  }
  fireSearchlist() {
    fromEvent(this.movieSearchInput.nativeElement, "keyup")
      .pipe(
        map((event: any) => {
          return event.target.value;
        }),
        // if character length greater then 2
        filter((res) => res.length > -1),

        // Time in milliseconds between key events
        debounceTime(0),

        // If previous query is diffent from current
        distinctUntilChanged()

        // subscription for response
      )
      .subscribe((text: string) => {
        //Search api call
        if (text == "") {
          this.hidesearchlist = false;
        }
        this.searchGetCall(text).subscribe(
          (res: any) => {
            if (res.data.length == 0) {
              this.hidesearchlist = false;
              return;
            }
            this.tag = res;
            this.hidesearchlist = true;
            this.showClose = true;
          },
          (err) => {
            console.log("error", err);
          }
        );
      });
  }

  searchGetCall(term: string) {
    if (term === "") {
      return of([]);
    }
    return this._http.get(environment.api_url + "Tag/TagSuggestion/" + term);
  }
  //End Search

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
  hide() {
    this.hidesearchlist = false;
    this.isShowingMenu = false;
  }
  ShowMenu() {
    this.isShowingMenu = true;
  }

  //Share Button
  getJobId(jobId) {
    this.shareJobId = jobId;
  }
  public shareFB(jobId) {
    return window.open(
      "https://www.facebook.com/sharer/sharer.php?" +
        "u=http://hoozonline.com/jobDetails/" +
        jobId,
      "_blank"
    );
  }

  public shareTwitter(jobId) {
    return window.open(
      "http://twitter.com/share?" +
        "url=http://hoozonline.com/jobDetails/" +
        jobId,
      "_blank"
    );
  }
  public shareWhatsApp(jobId) {
    return window.open(
      "https://api.whatsapp.com/send?text=http://hoozonline.com/jobDetails/" +
        jobId,
      "_blank"
    );
  }

  //Shared Link
  GetSharedLink(jobId) {
    this.sharedLink = "http://hoozonline.com/jobDetails/"+jobId;
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
}

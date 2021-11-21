import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-JobPost',
  templateUrl: './JobPost.component.html',
  styleUrls: ['./JobPost.component.css']
})
export class JobPostComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }
  AddTagging($event){
    alert($event.taget.value);
  }
}

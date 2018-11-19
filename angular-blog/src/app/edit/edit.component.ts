import { Component, OnInit } from '@angular/core';
import {tick} from '@angular/core/testing';
import { Post } from "../blog.service";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  curr_post : Post;

  constructor() {
    // this.curr_post.title = 'hello title';
    // this.curr_post.body = 'hello body';
  }

  ngOnInit() {
  }

  deletePost(): void {
    return;
  }

  savePost(): void {
    return;
  }

  previewPost(): void {
    return;
  }
}

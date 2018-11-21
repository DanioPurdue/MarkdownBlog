import { Component, OnInit } from '@angular/core';
import {tick} from '@angular/core/testing';
import { Post } from '../blog.service';
import { BlogService} from '../blog.service';
import {Router, RouterModule, Routes} from '@angular/router';
import { ActivatedRoute} from '@angular/router';
import {Location} from "@angular/common";

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  post: Post;
  username: string;
  isSaved: boolean;

  constructor(private blogService: BlogService,
              private route: ActivatedRoute,
              private location: Location) {
  }

  ngOnInit() {
    this.route.paramMap.subscribe(() => this.getPost());
    console.log(this.post);
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.blogService.getPost('cs144', id)
      .subscribe(post => this.post = post);
    this.isSaved = true;
  }

  deletePost(): void {
    // need to ask list component to delete the post in its this.posts
    this.blogService.getUsername().subscribe(username => this.blogService.deletePost(username, this.post.postid));
  }

  // save the post that your currently working
  savePost(): void {
    this.isSaved = true;
    this.blogService.getUsername()
      .subscribe(username => {this.blogService.updatePost(username, this.post); });
    return;
  }

  changeToNotSaved(): void {
    // console.log("not saved update");
    this.isSaved = false;
  }

  noNeedToSave(): boolean{
    return this.isSaved;
  }

  previewPost(): void {
    this.savePost();
    return;
  }
}

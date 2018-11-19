import { Component, OnInit } from '@angular/core';
import {tick} from '@angular/core/testing';
import { Post } from '../blog.service';
import { BlogService} from '../blog.service';
import {Router, RouterModule, Routes} from '@angular/router';
import { ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  post: Post;

  constructor(private blogService: BlogService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getPost();
  }

  getPost(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.blogService.getPost('cs144', id)
      .subscribe(post => this.post = post);

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

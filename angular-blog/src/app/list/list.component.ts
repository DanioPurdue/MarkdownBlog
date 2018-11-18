import { Component, OnInit } from '@angular/core';
import { BlogService} from '../blog.service';
import {Post} from '../blog.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  posts: Post[];
  constructor() { }

  ngOnInit() {
    this.getPosts();
  }

  getPosts(): void {
    this.BlogPosts().subscribe(posts => this.posts = posts);
  }

}

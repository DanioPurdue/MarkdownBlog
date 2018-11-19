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
  username: string;
  constructor(private blogService: BlogService) { }

  ngOnInit() {
    this.getPosts();
    this.blogService.parseHttpResposne();
  }

  parseJWT(token): string {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)).username;
  }

  getPosts(): void {
    this.username = 'cs144';
    this.blogService.getPosts(this.username)
      .subscribe(posts => this.posts = posts);
  }

  createPost(): void {
    return;
  }

  testFetch() :void{
    this.blogService.fetchPosts('cs144');
  }

}

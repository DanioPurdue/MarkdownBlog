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
    // this.blogService.parseHttpResposne();
  }

  parseJWT(token): string {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64)).username;
  }

  getPosts(): void {
    this.username = 'cs144';
    this.blogService.fetchPosts(this.username);
    this.blogService.getPosts(this.username)
      .subscribe(posts => this.posts = posts);
  }

  createPost(): void {
    return;
  }

  testFetch() :void{
    this.blogService.fetchPosts('cs144');
  }

  testNew(): void{
    this.blogService.newPost('cs144');
  }

  testDelete(): void{
    this.blogService.deletePost('cs144', 4);
  }

  testUpdate(): void {
    const time = new Date();
    this.blogService.updatePost('cs144', { postid: 5, created: time, modified: time , title: 'updated t', body: 'updated b'});
  }

}

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
    this.blogService.fetchPosts('cs144');
    this.getPosts();
    // this.blogService.parseHttpResposne();
  }


  parseJWTUsername(token): string {
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

  testFetch():void{
    this.blogService.fetchPosts('cs144');
  }

  formatDate(date: Date): string {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const minutes_str = minutes < 10 ? '0' + minutes : minutes + '';
    const strTime = hours + ':' + minutes_str + ' ' + ampm;
    return date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear() + ', ' + strTime;
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

import { Component, OnInit } from '@angular/core';
import { BlogService} from '../blog.service';
import {Post} from '../blog.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})

export class ListComponent implements OnInit {
  posts: Post[];
  username: string;
  constructor(private blogService: BlogService, private route: Router) { }

  ngOnInit() {
    this.blogService.getUsername()
      .subscribe(username => {
        this.username = username;
        this.getPosts(); });
  }

  getPosts(): void {
    this.blogService.getPosts(this.username)
      .subscribe(posts => {
        posts.sort(this.comparePost);
        console.log('list: ', this.posts);
        this.posts = posts; });
  }

  comparePost(post1: Post, post2: Post): number {
    return post1.postid - post2.postid;
  }

  createPost(): void {
    this.blogService.newPost(this.username)
      .subscribe(post => this.route.navigateByUrl(`edit/${post.postid}`));
    return;
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
}

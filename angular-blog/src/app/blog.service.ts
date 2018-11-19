import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {forEach} from '@angular/router/src/utils/collection';
import {element} from 'protractor';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

@Injectable({providedIn: 'root'})

export class BlogService {
  private baseUrl = 'http://localhost:3000/api';  // URL to web api
  private posts: Post[];

  // private http: HttpClient;
  constructor(private http: HttpClient) {}

  fetchPosts (username: string): void {
    // add a response event handler
    this.posts = [];
    const url = `${this.baseUrl}/${username}`;
    console.log(url);
    this.http.get(url,{observe: 'response'}).subscribe((res) => {
      console.log(res);
      let data = res.body;
      for (let idx in data) {
        let element = data[idx];
        let post: Post = {postid: element['postid'], created: Date(element['created']),
          modified: new Date(element['modified']), title: element['title'], body: element['body']};
        this.posts.push(post);
      }
    });
  }

  getPosts(username: string): Observable<Post []> {
    this.posts = [
      {postid: 1, created: new Date(), modified: new Date(), title: 'Title 1', body: 'Hello, world!' },
      {postid: 2, created: new Date(), modified: new Date(), title: 'Title 2', body: 'Hasdfsdd!' }];
    return of(this.posts);
  }

  getPost(username: string, id: number): Observable<Post> {
    return of(this.posts.filter(post => post.postid === id)[0]);
  }

  newPost(username: string): Observable<Post> {
    const time = new Date();
    const postid = 0;
    const url = '${baseUrl}/${username}/${postid}';
    const post: Post = {postid: postid, created: time, modified: time, title: '', body: ''};
    // let post = new Post(postid, time, time, '','');
    this.http.post(url, post, httpOptions);
    this.posts.push(post);
    // add response handler
    return of(post);
  }

  updatePost(username: string, post: Post): void {
    const updateed_post = this.posts.filter(p => p.postid === post.postid).forEach(p => {
      p.title = post.title;
      p.body = post.body;
    });
    const url = '${baseUrl}/${username}/${postid}';
    this.http.put(url, updateed_post, httpOptions);
  }

  // deletePost(username: string, postid: number): void {
  //   const url = '${baseUrl}/${username}/${postid}';
  //   let to_delete: Post[] = this.posts.filter(p => p.postid === postid);
  //   if (to_delete.length > 0){
  //     this.posts = this.posts.filter(p => p.postid !== postid);
  //     this.http.delete(url, httpOptions);
  //   }
  // }
}



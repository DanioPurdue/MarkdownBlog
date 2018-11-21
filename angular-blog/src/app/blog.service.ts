import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import { Observable, of} from 'rxjs';
import { Router} from '@angular/router';

const httpOptions = {observe: 'response'};

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

export interface RawTuple {
  postid: number;
  username: string;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

@Injectable({providedIn: 'root'})

export class BlogService {
  private baseUrl = 'http://localhost:3000/api';  // URL to web api
  private posts: Post[];
  private username: string;
  constructor(private http: HttpClient, private router: Router) {
    this.getUsername()
      .subscribe(username => {this.fetchPosts(username); this.username = username; });
    console.log(document.cookie);
  }
  private rawTuples: RawTuple[];
  private headers: string;

  parseJWTUsername(token): string {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let json = JSON.parse(atob(base64));
    return json.usr;
  }

  // return the username from the cookie
  getUsername(): Observable<string> {
    return of(this.parseJWTUsername(document.cookie));
  }

  fetchPosts (username: string): void {
    // add a response event handler
    this.posts = [];
    const url = `${this.baseUrl}/${username}`;
    let req = new XMLHttpRequest();
    req.open('GET', url, false);
    req.onreadystatechange = () => {
      if (req.readyState === 4) {
        JSON.parse(req.response).forEach(p => {
          const post: Post = {postid: p.postid, created: new Date(p.created),
                   modified: new Date(p.modified), title: p.title, body: p.body};
          this.posts.push(post);
        });
      }
    };
    req.send();
  }

  getPosts(username: string): Observable<Post []> {
    return of(this.posts);
  }

  getPost(username: string, id: number): Observable<Post> {
    return of(this.posts.filter(p => p.postid === id) [0]);
  }

  generatePostid(): number {
    return Math.max(...this.posts.map(p => p.postid)) + 1;
  }

  newPost(username: string): Observable<Post> {
    const time = new Date();
    const postid = this.generatePostid();
    const url = `${this.baseUrl}/${username}/${postid}`;
    const post: Post = {postid: postid, created: time, modified: time, title: '', body: ''};
    this.posts.push(post);
    this.http.post(url, {title: '', body: ''},{observe: 'response'}).subscribe(res => {
      if (res['status'] !== 201) {
        this.posts.pop();
        console.log('error creating new post');
        this.router.navigateByUrl('/');
      }
    });
    return of(post);
  }

  updatePost(username: string, post: Post): void {
    // do nothing if there is no match (loop not entered)
    const updated_post = this.posts.filter(p => p.postid === post.postid).slice(0, 1).forEach(p => {
      p.title = post.title;
      p.body = post.body;
      p.modified = new Date();
      const url = `${this.baseUrl}/${username}/${p.postid}`;
      this.http.put(url, {title: p.title, body: p.body}, {observe: 'response'}).subscribe(res => {
        if (res['status'] !== 200) {
          console.log('Error updating post');
          // display error
          // navigate to "edit view" page
        }
      });
    });
  }

  deletePost(username: string, postid: number): void {
    const url = `${this.baseUrl}/${username}/${postid}`;
    const to_delete: Post[] = this.posts.filter(p => p.postid === postid);
    console.log('to delete: ', to_delete);
    for (let i = 0; i < to_delete.length; i++) {
      this.posts.splice(this.posts.findIndex( p => p.postid === postid), 1);
      this.http.delete(url, {observe: 'response'}).subscribe(res => {
        if (res.status !== 204) {
          console.log('error deleting post');
          // display alert message
          this.router.navigateByUrl('/');
        }
      });
    }
  }

  refreshPosts(username: string): Observable<Post[]> {
    this.fetchPosts(username);
    return this.getPosts(username);
  }

}



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
    // console.log(json);
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
    this.http.get(url, {observe: 'response'}).subscribe((res) => {
      // console.log(res.status);
      const data = res.body;
      for (let idx in data) {
        if (data.hasOwnProperty(idx)){
          const element = data[idx];
          const post: Post = {postid: element['postid'], created: new Date(element['created']),
            modified: new Date(element['modified']), title: element['title'], body: element['body']};
          this.posts.push(post);
        }
      }
    });
  }

  getPosts(username: string): Observable<Post []> {
    return of(this.posts);
  }

  getPost(username: string, id: number): Observable<Post> {
    return of(this.posts.filter(post => post.postid === id)[0]);
  }

  generatePostid(): number {
    let max = 0;
    for (let p of this.posts){
      if (p.postid > max) {
        max = p.postid;
      }
    }
    return max + 1;
  }

  newPost(username: string): Observable<Post> {
    console.log('posts: ', this.posts);
    const time = new Date();
    const postid = this.generatePostid();
    const url = `${this.baseUrl}/${username}/${postid}`;
    const post: Post = {postid: postid, created: time, modified: time, title: '', body: ''};
    this.posts.push(post);
    this.http.post(url, {title: '', body: ''},{observe: 'response'}).subscribe(res => {
      //console.log('new post', res['status']);
      if (res['status'] !== 201) {
        this.posts.pop();
        console.log('error creating new post');
        this.router.navigateByUrl('/preview');
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
      console.log(p);
      this.http.put(url, {title: p.title, body: p.body}, {observe: 'response'}).subscribe(res => {
        console.log(res);
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
    for (let i = 0; i < to_delete.length; i++) {
      this.posts = this.posts.filter(p => p.postid !== postid);
      this.http.delete(url, {observe: 'response'}).subscribe(res => {
        console.log(res);
        if (res.status !== 204) {
          console.log('error deleting post');
          // display alert message
          // navigate to /, the list pane
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



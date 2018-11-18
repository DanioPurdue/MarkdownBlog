import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import { Observable, of} from 'rxjs';

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
  private baseUrl = 'api';  // URL to web api
  private http: HttpClient;
  private posts: Post[];
  private sampleUrl;
  constructor(http: HttpClient) {
    // initializations for testing purpos
  }

  fetchPosts (username: string): void {
    // add a response event handler
    const url = '${baseUrl}/${username}';
    this.http.get(url);
  }

  getPostsHttp (): Observable<Post[]> {
    this.sampleUrl = 'localhost:3000/api/cs144';
    return this.http.get<Post[]>(this.sampleUrl);
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



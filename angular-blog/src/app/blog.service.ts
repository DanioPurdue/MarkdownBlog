import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
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
  constructor(private http: HttpClient) {}
  private rawTuples: RawTuple[];
  private headers: string;

  fetchPosts (username: string): void {
    // add a response event handler
    this.posts = [];
    const url = `${this.baseUrl}/${username}`;
    console.log(url);
    this.http.get(url, {observe: 'response'}).subscribe((res) => {
      console.log(res);
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

  getPostsHttp (): Observable<RawTuple[]> {
    const sampleUrl = 'http://localhost:3000/api/cs144';
    return this.http.get<RawTuple[]>(sampleUrl);
  }

  parseHttpResposne(): void {
    this.getPostsHttp().subscribe(data => {
      this.rawTuples = data;
      console.log(this.rawTuples);
    });
  }

  getPosts(username: string): Observable<Post []> {
    return of(this.posts);
  }

  getPost(username: string, id: number): Observable<Post> {
    return of(this.posts.filter(post => post.postid === id)[0]);
  }

  newPost(username: string): Observable<Post> {
    const time = new Date();
    const postid = 0;
    const url = `${this.baseUrl}/${username}/${postid}`;
    const post: Post = {postid: postid, created: time, modified: time, title: '', body: ''};
    // let post = new Post(postid, time, time, '','');
    this.http.post(url, post, httpOptions);
    this.posts.push(post);
    // add response handler
    return of(post);
  }

  updatePost(username: string, post: Post): void {
    const updated_post = this.posts.filter(p => p.postid === post.postid).forEach(p => {
      p.title = post.title;
      p.body = post.body;
      p.modified = new Date();
    });
    const url = '${baseUrl}/${username}/${postid}';
    this.http.put(url, updated_post, httpOptions).subscribe(res => {
      if (res['status'] !== 200) {
        console.log('Error updating post');
        // display error
        // navigate to "edit view" page
      }
    });
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



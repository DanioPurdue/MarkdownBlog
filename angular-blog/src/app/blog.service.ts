import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;

  constructor(postid, created, modified, title, body){
    this.postid = postid;
    this.created = created;
    this.modified = modified;
    this.title = title;
    this.body = body;
  }
}

export class BlogService {
  private baseUrl = 'api';  // URL to web api
  private http: HttpClient;
  private posts: Post[];
  constructor() { }

  fetchPosts (username : string): void{
    this.http.get(this.baseUrl);
  }

  getPosts(username: string): Post[]{
    return this.posts;
  }

  getPost(username: string, id: number): Post{
    return this.posts.filter(post => post.postid === id)[0];
  }

  newPost(username: string): Post{
    const time = new Date();
    let postid = 0;
    const url = '${baseUrl}/${username}/${postid}';
    let post = new Post(postid, time, time, '','');
    this.http.post(url, post, httpOptions);
    this.posts.push(post);
    // add response handler
    return post;
  }

  updatePost(username: string, post: Post): void{
    let updateed_post = this.posts.filter(p => p.postid === post.postid).forEach(p => {
      p.title = post.title;
      p.body = post.body;
    });
    const url = '${baseUrl}/${username}/${postid}';
    this.http.put(url, updateed_post, httpOptions);
  }
}



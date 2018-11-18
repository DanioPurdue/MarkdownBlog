import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})

export class Post {
  postid: number;
  created: Date;
  modified: Date;
  title: string;
  body: string;
}

export class BlogService {
  private posts: Post[];
  constructor(http: HttpClient) { }
}

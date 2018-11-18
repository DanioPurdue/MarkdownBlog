import { Injectable } from '@angular/core';

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
  constructor() { }
}

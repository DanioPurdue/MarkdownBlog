import { NgModule }             from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { Parser, HtmlRenderer } from 'commonmark';
import { BlogService} from '../blog.service';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';



@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})


export class PreviewComponent implements OnInit {
  title: string;
  body: string;
  username: string;
  constructor(private blogservice: BlogService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.blogservice.getUsername()
      .subscribe(username => {
        this.username = username;
        this.getTitleBody();
      });
  }

  getTitleBody(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.blogservice.getPost(this.username, id).subscribe(post => {
      // console.log('preview: ', post);
      const reader = new Parser();
      const writer = new HtmlRenderer();
      this.title = writer.render(reader.parse(post.title));
      this.body = writer.render(reader.parse(post.body));
      console.log(this.body);
      console.log(this.title);
    });
  }

  goBack(): void {
    this.location.back();
  }


}

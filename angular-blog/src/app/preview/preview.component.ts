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
  constructor(private parser: Parser, private blogservice: BlogService, private route: ActivatedRoute, private location: Location) { }

  ngOnInit() {
    this.getTitleBody();
  }

  getTitleBody(): void {
    const id = +this.route.snapshot.paramMap.get('id');
    this.blogservice.getPost('cs144', id).subscribe(post => {
      this.title = post.title;
      this.body = post.body;
    });
  }

  goback(): void {
    this.location.back();
  }


}

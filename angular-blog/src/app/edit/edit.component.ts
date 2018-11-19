import { Component, OnInit } from '@angular/core';
import {tick} from '@angular/core/testing';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  title: string;
  body: string;

  constructor() {
    this.title = 'hello title';
    this.body = 'hello body';
  }

  ngOnInit() {
  }

  deletePost(): void {
    return;
  }

  savePost(): void {
    return;
  }

  previewPost(): void {
    return;
  }
}

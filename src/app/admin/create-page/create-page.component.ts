import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Post } from '../../shared/interfaces';
import { PostsService } from '../../shared/posts.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlertService } from '../shared/service/alert.service';

@Component({
  selector: 'app-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss']
})
export class CreatePageComponent implements OnInit, OnDestroy {

  form: FormGroup;
  destroy$: Subject<boolean> = new Subject();
  constructor(
    private fb: FormBuilder,
    private postService: PostsService,
    private alertService: AlertService
  ) { }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [null, Validators.required],
      text: [null, Validators.required],
      author: [null, Validators.required],
    });
  }

  submit() {
    if (this.form.invalid) {
      return;
    }

    const post: Post = {
      title: this.form.value.title,
      text: this.form.value.text,
      author: this.form.value.author,
      date: new Date()
    };

    this.postService.create(post)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.alertService.success('Пост был создан');
        this.form.reset();
    });

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

}

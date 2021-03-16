import { Component, OnDestroy, OnInit } from '@angular/core';
import { PostsService } from '../../shared/posts.service';
import { Post } from '../../shared/interfaces';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit, OnDestroy {
  searchStr = '';
  posts: Post[] = [];
  destroy$: Subject<boolean> = new Subject();
  constructor(
    private postService: PostsService
  ) { }

  ngOnInit(): void {
    this.postService.getAll()
      .pipe(takeUntil(this.destroy$))
      .subscribe(posts => {
        this.posts = posts;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  remove(id: string) {
    this.postService.remove(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.posts = this.posts.filter(post => post.id !== id);
    });
  }
}

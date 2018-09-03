import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';

import { Observable } from 'rxjs';

import { AngularFireDatabase } from 'angularfire2/database';

import { SeoService } from '../seo.service';

@Component({
  selector: 'blog-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  post$: Observable<any>;
  last$: Observable<any[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private db: AngularFireDatabase,
    private seo: SeoService) { }

  ngOnInit() {
    this.route.paramMap.subscribe((params: ParamMap) => {
      const id = params.get('id');
      this.post$ = this.db.object(`posts/${id}`).valueChanges();
      this.last$ = this.db.list(`posts`, ref => ref.orderByChild('time').limitToLast( 7 ) ).valueChanges();

      this.post$.subscribe( ( post : any ) => {
        if(!post){
          this.router.navigateByUrl('/404');
        } else {
          this.seo.generateTags({
            title: post.title, 
            description: post.description, 
            image: post.featured_image,
            slug: post.id,
            type: 'article'
          })
        }
      });
    });
  }

}

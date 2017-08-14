import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit, OnDestroy {

  private subscription: any;
  title: string;

  constructor(private router: ActivatedRoute) {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello Contact');
    this.subscription = this.router.data.subscribe(
        data => {
            this.title = data['title'];
        }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

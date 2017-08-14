import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  templateUrl: './action.based.component.html',
  styleUrls: ['./action.based.component.css']
})
export class ActionBasedComponent implements OnInit, OnDestroy {

  protected subscription: any;
  public actionName: string;

  constructor(protected router: ActivatedRoute) {}

  ngOnInit() {
    console.log('Hello ActionBasedComponent');
    this.subscription = this.router.data.subscribe(
        data => {
            this.actionName = data['action'];
        }
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetUserReviewsComponent } from './get-user-reviews.component';

describe('GetUserReviewsComponent', () => {
  let component: GetUserReviewsComponent;
  let fixture: ComponentFixture<GetUserReviewsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetUserReviewsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetUserReviewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

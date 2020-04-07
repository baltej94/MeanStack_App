import { Component } from '@angular/core'
import { RouterModule } from '@angular/router'
import { AuthenticationService, UserDetails } from '../authentication.service'

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserDetails

  constructor(private auth: AuthenticationService) {}

  ngOnInit() {
    this.auth.profile().subscribe(
      user => {
        this.details = user
      },
      err => {
        console.error(err)
      }
    )
  }
}

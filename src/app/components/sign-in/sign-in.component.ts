import { Component, OnInit } from '@angular/core';
 
import { AuthService } from '../../services/auth/auth.service';
import { TokenStorageService } from '../../services/auth/token-storage.service';
import { SignInInfo } from '../../services/auth/sign-in-info';
 
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  form: any = {};
  isSignedIn = false;
  isSignInFailed = false;
  errorMessage = '';
  roles: string[] = [];
  private signInInfo: SignInInfo;
 
  constructor(private authService: AuthService, private tokenStorage: TokenStorageService) { }
 
  ngOnInit() {
    if (this.tokenStorage.getToken()) {
      this.isSignedIn = true;
      this.roles = this.tokenStorage.getAuthorities();
    }
  }
 
  onSubmit() {
    this.signInInfo = new SignInInfo(this.form.username, this.form.password);
    this.authService.signIn(this.signInInfo).subscribe(
      data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUsername(data.username);
        this.tokenStorage.saveAuthorities(data.authorities);
        this.isSignInFailed = false;
        this.isSignedIn = true;
        this.roles = this.tokenStorage.getAuthorities();
        this.reloadPage();
      },
      error => {
        console.log(error);
        this.errorMessage = error.error.message;
        this.isSignInFailed = true;
      }
    );
  }
 
  reloadPage() {
    window.location.reload();
  }
}
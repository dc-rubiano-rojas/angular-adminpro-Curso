import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

import { UsuarioService } from '../../services/usuario.service';

// Variable de google sign-in
declare const gapi: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {

  formSubmitted = false;
  auth2: any;

  loginForm = this.fb.group({
    email: [localStorage.getItem('email') || '', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    remember: [false]
  });

  constructor(private router: Router,
              private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private ngZone: NgZone) { }

  ngOnInit(): void {
    this.enderButton();
  }

  login(): void {
    this.usuarioService.login(this.loginForm.value)
                  .subscribe(res => {
                    // console.log(res);
                    if (this.loginForm.get('remember')?.value) {
                      localStorage.setItem('email', this.loginForm.get('email')?.value);
                    } else{
                      localStorage.removeItem('email');
                    }
                    this.router.navigateByUrl('/');
                  }, err => {
                    // console.warn(err.error.msg);
                    Swal.fire('Error', err.error.msg, 'error');
                  });
  }


  enderButton(): any {
    gapi.signin2.render('my-signin2', {
      'scope': 'profile email',
      'width': 240,
      'height': 50,
      'longtitle': true,
      'theme': 'dark',
    });
    this.startApp();
  }

  async startApp(): Promise<any>{
    await this.usuarioService.googleInit();
    this.auth2 = this.usuarioService.auth2;
    this.attachSignin(document.getElementById('my-signin2'));
  }

  attachSignin(element: any): any {
    // console.log(element.id);
    this.auth2.attachClickHandler(element, {},
        (googleUser: any) => {
            const id_token = googleUser.getAuthResponse().id_token;
            // console.log(id_token);
            this.usuarioService.loginGoogle(id_token)
                                .subscribe(res => {
                                  this.ngZone.run(() => {
                                    this.router.navigateByUrl('/');
                                  });
                                });
          }, (error: any) => {
          alert(JSON.stringify(error, undefined, 2));
        });
  }


}

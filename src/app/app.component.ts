import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';


import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent, RouterModule],
  templateUrl: './app.component.html',
})
export class AppComponent {}
import { Component } from '@angular/core';
import { HeaderComponent } from './shared/header/header.component';

import { CommonModule } from '@angular/common';

import { RouterModule } from "@angular/router";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ HeaderComponent, RouterModule, CommonModule, 
    CommonModule,   ],
  templateUrl: './app.component.html',
})
export class AppComponent {}
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormFileComponent } from './components/form-file/form-file.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormFileComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dmo-asistencia-ubic';
}

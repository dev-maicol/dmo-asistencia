import {AfterViewInit, Component, ViewChild, inject} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';

import {MatButtonModule} from '@angular/material/button';

import {MatInputModule} from '@angular/material/input';

import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatFormFieldModule} from '@angular/material/form-field';


import {
  MatSnackBar,
  MatSnackBarHorizontalPosition,
  MatSnackBarVerticalPosition,
} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-form-file',
  imports: [ FormsModule, CommonModule, MatButtonModule, MatInputModule,
    MatFormFieldModule, MatTableModule, MatSortModule, MatPaginatorModule, MatFormFieldModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './form-file.component.html',
  styleUrl: './form-file.component.css'
})
export class FormFileComponent {

  private _snackBar = inject(MatSnackBar);

  horizontalPosition: MatSnackBarHorizontalPosition = 'right';
  verticalPosition: MatSnackBarVerticalPosition = 'top';

  openSnackBar() {
    this._snackBar.open('✅ Copiado con éxito', 'Cerrar', {
      horizontalPosition: this.horizontalPosition,
      verticalPosition: this.verticalPosition,
      duration: 2 * 1000,
    });
  }

  displayedColumns: string[] = ['datetime', 'name', 'ubi'];
  dataSource: MatTableDataSource<string[]>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // @ViewChild(MatSort) sort!: MatSort;

  constructor() {
    // Create 100 users
    // const users = Array.from({length: 100}, (_, k) => createNewUser(k + 1));

    // Assign the data to the data source for the table to render
    this.dataSource = new MatTableDataSource(this.arrayOutputFinal);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  selectedFile: File | null = null;
  fileContent: string = '';
  inputDate: string = '';
  inputDateFormat: string = '';

  // array final para almacenar las lineas en tres partes [{'20/3/2025, 09:00', 'Maicol', 'ubicacion ...'}]
  arrayOutputFinal: string[][] = [];

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
    this.writeFile();
  }

  writeFile(): void {
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: ProgressEvent<FileReader>) => {
        const result = e.target?.result;
        if (typeof result === 'string') {
          this.fileContent = result;
        }
      };
      reader.readAsText(this.selectedFile);
    } else {
      console.error('No file selected.');
    }
  }

  deleteData(idInput: string): void{
    const input = document.getElementById(idInput) as HTMLInputElement;
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (input) {
      input.value = '';
      this.selectedFile = null;
      this.fileContent = '';
    } else {
      console.error('Input element not found.');
    }

    if (fileInput) {
      fileInput.value = '';   // Limpiar input type="file"
      this.selectedFile = null;
    } else {
      console.error('File input element not found.');
    }
    // Vaciar los elementos de arrayOutputFinal
    this.arrayOutputFinal = [];
    this.dataSource = new MatTableDataSource(this.arrayOutputFinal); // Reiniciar la tabla
    this.dataSource.paginator = this.paginator; // Reiniciar el paginador

  }

  processLines(): void {
    const lines = this.fileContent.split('\n');
    let arrayOutput: string[] = [];

    this.arrayOutputFinal = []; // Limpiar el array final antes de procesar nuevas líneas

    lines.forEach((line, index) => {
      const trimmedLine = line.trim();
      if(trimmedLine.trim()){
        const slashCount = (trimmedLine.match(/\//g) || []).length;
        const commaCount = (trimmedLine.match(/,/g) || []).length;
        const dashCount = (trimmedLine.match(/-/g) || []).length;

        if (slashCount >= 2 && commaCount >= 1 && dashCount >= 1) {
          // console.log(`✅ Línea ${index + 1} válida:`, trimmedLine);
          // Aquí haces lo que necesites con las líneas válidas
          arrayOutput.push(trimmedLine);
        } else {
          // console.log(`❌ Línea ${index + 1} inválida:`, trimmedLine);
          // Puedes ignorar o hacer otra cosa con las inválidas
          let temp = arrayOutput.pop();
          arrayOutput.push(temp + ' ' + trimmedLine);
        }
      }
      // console.log(`Línea ${index}:`, line.trim());
    });
    this.testDate();

    // this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // for(const line of arrayOutput) {
    //   console.log(line);
    //   // Aquí puedes hacer lo que quieras con cada línea individual
    // }

    // console.log(this.inputDateFormat);
    arrayOutput.forEach(item => {
      const datePart = item.split(',')[0]; // "20/3/2025"
      const parts = datePart.split('/'); // ["20", "3", "2025"]

      if (parts.length === 3) {
        const [day, month, year] = parts;
        const itemDateFormat = `${parseInt(month)}/${year}`; // formatear igual que inputDateFormat

        if (itemDateFormat === this.inputDateFormat) {
          // filteredArray.push(item);
          // console.log(item);
          //  agregar la linea item al textarea output-data
          const outputTextArea = document.getElementById('output-data') as HTMLTextAreaElement;
          if (outputTextArea) {
            outputTextArea.value += item + '\n'; // Agregar la línea al textarea
            this.arrayOutputFinal.push(this.transformLine(item));

          } else {
            console.error('Textarea element not found.');
          }
        }
      }
    });

    this.dataSource = new MatTableDataSource(this.arrayOutputFinal);
    // setTimeout(() => {
    // });
    this.dataSource.paginator = this.paginator;
    // this.dataSource.sort = this.sort;

    // this.arrayOutputFinal.forEach(item => {
    //   // 0, 1, 2
    //   // console.log(item[2]);

    //   // Aquí puedes hacer lo que quieras con cada línea individual
    // });


    // for (const line of lines) {
    //   const trimmedLine = line.trim();
    //   if (trimmedLine) {
    //     console.log('Línea:', trimmedLine);
    //     // Aquí puedes hacer lo que quieras con cada línea individual
    //   }
    // }

  }

  testDate(): void{
    // alert(this.formatMonthYear(this.inputDate));
    this.inputDateFormat = this.formatMonthYear(this.inputDate);
  }

  formatMonthYear(value: string): string {
    if (!value) {
      return '';
    }
    let [year, month] = value.split('-');
    if(month.charAt(0) === '0'){
      month = month.charAt(1);
      // return `${month.charAt(1)}/${year}`;
    }
    return `${month}/${year}`;
  }

  transformLine(line: string): string[] {
    const [dateTimePart, rest] = line.split(' - ', 2);
    if (!rest) return [line];

    const [sender, message] = rest.split(':', 2);
    if (!message) return [line];

    // return `${dateTimePart} ${sender.trim()} ${message.trim()}`;
    return [
      dateTimePart.trim(), // fecha y hora juntas
      sender.trim(),       // nombre o remitente
      message.trim()       // contenido del mensaje
    ];
  }

  // copyTable(): void{
  //   // copiar el contenido de la table con id table-information al portapapeles
  //   const table = document.getElementById('table-information') as HTMLTableElement;
  //   if (table) {
  //     const range = document.createRange();
  //     range.selectNode(table);
  //     window.getSelection()?.removeAllRanges(); // Clear current selection
  //     window.getSelection()?.addRange(range); // Select the table
  //     document.execCommand('copy'); // Copy to clipboard
  //     window.getSelection()?.removeAllRanges(); // Deselect the table
  //   }
  //   else {
  //     console.error('Table element not found.');
  //   }
  // }

  copyTable(): void {
    const table = document.getElementById('table-information') as HTMLTableElement;
    if (!table) {
      console.error('Table element not found.');
      return;
    }

    let plainText = '';

    for (const row of Array.from(table.rows)) {
      const cells = Array.from(row.cells).map(cell => cell.textContent?.trim() || '');
      plainText += cells.join('\t') + '\n'; // separa por tabulaciones para Excel
    }

    // Copiar al portapapeles como texto plano
    navigator.clipboard.writeText(plainText)
      .then(() => {
        console.log('Tabla copiada como texto plano')
        this.openSnackBar();
      })
      .catch(err => console.error('Error al copiar:', err));
  }


}

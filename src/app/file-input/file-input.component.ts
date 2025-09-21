import { Component, input, model, signal } from '@angular/core';
import * as XLSX from 'xlsx';
import { parseDate, toCamelCase } from '../utils';

@Component({
  selector: 'file-input',
  imports: [],
  templateUrl: './file-input.component.html',
})
export class FileInputComponent<T> {
  data = model.required<T[]>();
  hasErrors = model<boolean>(false);
  requiredColumns = input<string[]>([]);
  label = input<string>();
  additionalInformations = input<string>();
  errors = signal<string[]>([]);

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      if (e.target) {
        const workbook = XLSX.read(e.target.result, {type: 'binary'});
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawData: any[] = XLSX.utils.sheet_to_json(worksheet, {raw: true});
        const columns = Object.keys(rawData[0]);
        const data: T[] = rawData.map(row => this.formatData(row));
        this.data.set(data);
        this.checkColumns(columns);
      }
    };
    if (file) {
      reader.readAsArrayBuffer(file);
    }
  }

  formatData<T extends Record<string, any>>(obj: T): any {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [toCamelCase(key), parseDate(value)])
    );
  }

  checkColumns(columns: string[]) {
    const inputErrors: string[] = [];
    this.requiredColumns().forEach(requiredColumns => {
      if (!columns.includes(requiredColumns)) {
        inputErrors!.push(`La colonne ${requiredColumns} est manquante`);
      }
    })
    this.errors.set(inputErrors);
    this.hasErrors.set(inputErrors.length !== 0);
  }
}

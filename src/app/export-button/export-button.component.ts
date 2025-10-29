import { Component, ElementRef, Input, QueryList } from '@angular/core';
import { exportArrayToExcel, generatePdf } from '../utils';
import { PdfOptions } from '../app.model';

@Component({
  selector: 'export-button',
  imports: [],
  templateUrl: './export-button.component.html',
})
export class ExportButtonComponent {
  @Input({ required: true }) excelData!: any[];
  @Input() excelColumnNames: string[] | undefined;
  @Input({ required: true }) pdfTable!: QueryList<ElementRef<HTMLTableElement>>;
  @Input() pdfOptions: PdfOptions | undefined;
  @Input({ required: true }) fileName!: string;

  onExportPdf(): void {
    generatePdf(this.pdfTable, this.fileName, this.pdfOptions?.title ?? '', this.pdfOptions?.didParseCell, this.pdfOptions?.columnStyles, this.pdfOptions?.margin);
  }

  onExportExcel(): void {
    exportArrayToExcel(this.excelData, this.fileName, this.excelColumnNames);
  }
}

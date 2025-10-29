import moment from 'moment/moment';
import { jsPDF } from 'jspdf';
import { autoTable, CellHook, MarginPaddingInput, Styles } from 'jspdf-autotable';
import { ComponentRef, ElementRef, QueryList } from '@angular/core';
import { CellObject, CellStyle, utils, WorkBook, WorkSheet, writeFile } from 'xlsx-js-style';

export function parseValue(value: any): Date | null {
  if (value === '') {
    return null;
  }
  if (typeof value === 'string') {
    const stringToMoment = moment(value, 'DD/MM/YYYY', true);
    if (stringToMoment.isValid()) {
      return stringToMoment.toDate()
    }
  }
  return value;
}

export function toCamelCase(str: string): string {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[\s_-]+(.)?/g, (_, chr) => chr ? chr.toUpperCase() : "")
    .replace(/[^\w]/g, "");
}

export function generatePdf(tables: QueryList<ElementRef<HTMLTableElement>>, filename: string, title: string, didParseCell?: CellHook,
                            columnStyles?: { [key: string]: Partial<Styles> }, margin?: MarginPaddingInput) {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor('#1c398e');
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  let startY = 25;
  tables.forEach((table, index) => {
    autoTable(doc, {
      html: table.nativeElement,
      headStyles: { fillColor: '#1c398e', textColor: '#ffffff', fontStyle: 'bold', valign: 'middle', halign: 'center' },
      bodyStyles: { valign: 'middle', halign: 'center' },
      footStyles: { fillColor: '#1c398e', textColor: '#ffffff', fontStyle: 'bold', halign: 'center' },
      showFoot: 'lastPage',
      didParseCell: didParseCell,
      startY: index === 0 ? startY : undefined,
      columnStyles: columnStyles,
      margin: margin
    });
  });
  doc.save(`${filename}-${moment().format('DD-MM-YYYY')}.pdf`);
}

export function exportArrayToExcel(data: Record<string, string | CellObject>[], fileName: string, columnNames?: string[]) {
  const worksheet: WorkSheet = utils.json_to_sheet(data);

  worksheet['!rows'] = [];
  const range = utils.decode_range(worksheet['!ref'] || 'A1');
  const columnWidths: number[] = Array(range.e.c - range.s.c + 1).fill(0);
  for (let row = range.s.r; row <= range.e.r; ++row) {
    worksheet['!rows'][row] = { hpt: 18 };
    for (let column = range.s.c; column <= range.e.c; ++column) {
      const addr = utils.encode_cell({ r: row, c: column });
      const cell = worksheet[addr] as CellObject | undefined;
      if (!cell || typeof cell !== 'object') continue;
      if (columnNames && row === 0) {
        cell.v = columnNames[column];
      }
      cell.s = {
        ...(cell.s || {}),
        alignment: {
          horizontal: 'center',
          vertical: 'center',
          wrapText: true
        },
      } as CellStyle;
      if (row === 0) {
        cell.s = {
          ...cell.s,
          fill: { fgColor: { rgb: '1c398e' } },
          font: { bold: true, color: { rgb: 'ffffff' } }
        }
      }
      if (cell.t === 's') {
        const rawValue = 'v' in cell ? cell.v : '';
        const text = String(rawValue ?? '');
        columnWidths[column] = Math.max(columnWidths[column], text.length);
      }
    }
  }

  worksheet['!cols'] = columnWidths.map(w => ({ wch: w + 2 }));
  const sheets: { [p: string]: WorkSheet } = {};
  sheets[fileName] = worksheet;
  const workbook: WorkBook = {
    Sheets: { [fileName]: worksheet },
    SheetNames: [fileName]
  };
  writeFile(workbook, `${fileName}-${moment().format('DD-MM-YYYY')}.xlsx`, { cellStyles: true });
}

export function setInput<V>(componentRef: ComponentRef<any>, input: string, value: V) {
  componentRef.setInput(input, value);
}

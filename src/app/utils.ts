import moment from 'moment/moment';
import { jsPDF } from 'jspdf';
import { autoTable, CellHook } from 'jspdf-autotable';
import { ElementRef, QueryList } from '@angular/core';

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

export function generatePdf(tables: QueryList<ElementRef<HTMLTableElement>>, filename: string, title: string, didParseCell?: CellHook) {
  const doc = new jsPDF();

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor('#1c398e');
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });

  let startY = 25;
  tables.forEach(table => {
    autoTable(doc, {
      html: table.nativeElement,
      headStyles: { fillColor: '#1c398e', textColor: '#ffffff', fontStyle: 'bold', valign: 'middle', halign: 'center' },
      bodyStyles: { valign: 'middle', halign: 'center', overflow: "linebreak" },
      footStyles: { fillColor: '#1c398e', textColor: '#ffffff', fontStyle: 'bold' },
      showFoot: 'lastPage',
      didParseCell: didParseCell,
      startY: startY,
    });
  });
  doc.save(`${filename}-${moment().format('DD-MM-YYYY')}.pdf`);
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileInputComponent } from './file-input.component';
import { Sanction } from '../app.model';

describe('FileInputComponent', () => {
  let component: FileInputComponent<Sanction>;
  let fixture: ComponentFixture<FileInputComponent<Sanction>>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileInputComponent<Sanction>);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('requiredColumns', ['Nom, prénom personne', 'Compétition', 'Date d\'effet', 'Libellé décision', 'Libellé sous catégorie']);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display column error when missing required columns on sanctions or matches file', () => {
    const sanctionsInputColumns = ['Nom, prénom personne', 'Libellé décision', 'Libellé sous catégorie'];

    // WHEN
    component.checkColumns(sanctionsInputColumns);

    // THEN
    const sanctionErrors = component.errors();
    expect(sanctionErrors.length).toBe(2);
    expect(sanctionErrors[0]).toBe('La colonne Compétition est manquante');
    expect(sanctionErrors[1]).toBe('La colonne Date d\'effet est manquante');
    expect(component.hasErrors()).toBe(true);
  })
});

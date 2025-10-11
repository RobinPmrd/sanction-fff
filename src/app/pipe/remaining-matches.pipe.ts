import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'remainingMatches'
})
export class RemainingMatchesPipe implements PipeTransform {
  transform(remaining: number): string {
    if (remaining === 999) {
      return 'indéfiniment';
    }
    const label = remaining > 1 ? 'matchs restants' : 'match restant';
    return `${remaining} ${label}`;
  }
}

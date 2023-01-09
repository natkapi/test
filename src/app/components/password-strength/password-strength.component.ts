import { 
  Component, 
  EventEmitter, 
  Input, 
  OnChanges, 
  Output, 
  SimpleChange 
} from '@angular/core';

@Component({
  selector: 'app-password-strength',
  styleUrls: ['./password-strength.component.scss'],
  templateUrl: './password-strength.component.html',
})
export class PasswordStrengthComponent implements OnChanges {
  bar0!: string;
  bar1!: string;
  bar2!: string;

  @Input() public passwordToCheck!: string;

  @Output() passwordStrength = new EventEmitter<boolean>();

  private colors = ['red', 'yellow', 'green'];

  message!: string;
  messageColor!: string;

  checkStrength(password: string) {

    let count = 0;

    const regex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g;
    const letters = /[a-zA-Z]+/.test(password);
    const numbers = /[0-9]+/.test(password);
    const symbols = regex.test(password);
    const value = [letters, numbers, symbols];

    let match = 0;
    for (const flag of value) {
      match += flag === true ? 1 : 0;
    }

    count += 2 * password.length + (password.length >= 10 ? 1 : 0);
    count += match * 10;
    count = password.length <= 6 ? Math.min(count, 10) : count;
    count = match === 1 ? Math.min(count, 10) : count;
    count = match === 2 ? Math.min(count, 20) : count;
    count = match === 3 ? Math.min(count, 30) : count;

    return count;
  }

  ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
    const password = changes['passwordToCheck'].currentValue;

    this.setBarColors(3, '#DDD');

    if (password) {
      const color = this.getColor(this.checkStrength(password));
      this.setBarColors(color.index, color.color);

      const pwdStrength = this.checkStrength(password);
      pwdStrength === 30 ? this.passwordStrength.emit(true) : this.passwordStrength.emit(false);

      switch (pwdStrength) {
        case 10:
          this.message = 'Easy';
          break;
        case 20:
          this.message = 'Medium';
          break;
        case 30:
          this.message = 'Strong';
          break;
      }
    } else {
      this.message = '';
    }
  }

  private getColor(strength: number) {
    let index = 0;

    if (strength === 10) {
      index = 0;
    } else if (strength === 20) {
      index = 1;
    } else if (strength === 30) {
      index = 2;
    } else {
      index = 3;
    } 

    this.messageColor = this.colors[index];

    return {
      index: index + 1,
      color: this.colors[index],
    };
  }

  private setBarColors(count: number, color: string) {
    for (let i = 0; i < count; i++) {
      (this as any)['bar' + i] = color;
    }
  }
}
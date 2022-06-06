import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Subject} from 'rxjs';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})

export class ConfirmationComponent implements OnInit {

  @Input() yesText: string = 'Да';
  @Input() noText: string = 'Не';
  @Input() confirmationMessage: string = 'Да ли сте сигурни да желите да извршите операцију?';

  // tslint:disable-next-line:no-output-on-prefix
  @Output() onYesClick: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onNoClick: EventEmitter<any> = new EventEmitter();
  // tslint:disable-next-line:no-output-on-prefix
  @Output() onClose: EventEmitter<any> = new EventEmitter();

  onDestroy$: Subject<boolean> = new Subject<boolean>();

  constructor(public modalRef: NgbActiveModal) {
  }

  ngOnInit(): void {
  }

  emitYesEvent() {
    this.modalRef.close(true);
    this.onYesClick.emit(true);
  }

  emitNoEvent() {
    this.modalRef.close(false);
    this.onNoClick.emit(false);
  }
}

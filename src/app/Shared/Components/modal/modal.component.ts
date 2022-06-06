import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})

export class ModalComponent implements OnInit {

  @Input() modalRef: NgbModalRef;
  @Input() modalTitle: string = 'Modal Title';
  @Input() hasFooter: boolean = true;
  @Input() footerTemplate: TemplateRef<any> = null;

  constructor() {
  }

  ngOnInit(): void {
  }
}

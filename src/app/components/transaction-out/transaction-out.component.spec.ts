import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionOutComponent } from './transaction-out.component';

describe('TransactionOutComponent', () => {
  let component: TransactionOutComponent;
  let fixture: ComponentFixture<TransactionOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionOutComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

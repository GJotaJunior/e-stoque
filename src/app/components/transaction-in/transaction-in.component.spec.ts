import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionInComponent } from './transaction-in.component';

describe('TransactionInComponent', () => {
  let component: TransactionInComponent;
  let fixture: ComponentFixture<TransactionInComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionInComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionInComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TableauLogsComponent } from './logs-table.component';

describe('TableauLogsComponent', () => {
  let component: TableauLogsComponent;
  let fixture: ComponentFixture<TableauLogsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TableauLogsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TableauLogsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

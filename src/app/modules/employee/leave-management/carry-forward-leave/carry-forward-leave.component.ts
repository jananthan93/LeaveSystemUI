import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort } from '@angular/material';
import { CarryforwardLeaveRequestService } from '../../../../services/leave-management/carryforward-leave-request.service';
import { TokenStorageService } from '../../../../services/login/token-storage.service';
import { InteractionService } from '../../../../services/interaction.service';
import { CarryforwardRequestData } from '../../../../models/leave-management/carryforward-leave-request';


@Component({
  selector: 'app-carry-forward-leave',
  templateUrl: './carry-forward-leave.component.html',
  styleUrls: ['./carry-forward-leave.component.css']
})
export class CarryForwardLeaveComponent implements OnInit {

  displayedColumns: string[] = ['employeeid', 'employeename', 'carryforwarded', 'status'];
  carryforwardLeave: CarryforwardRequestData[];
  info: any;

  dataSource = new MatTableDataSource<CarryforwardRequestData>();
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private carryforwardLeaveRequestService: CarryforwardLeaveRequestService,
    private token: TokenStorageService,
    private interactionService: InteractionService) { }

  ngOnInit() {
    this.info = {
      token: this.token.getToken(),
      username: this.token.getUsername(),
      authorities: this.token.getAuthorities()
    };
    this.getPendingCarryforwardRequest();
    this.getSuccessMsg();
  }
  
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getPendingCarryforwardRequest() {
    this.carryforwardLeaveRequestService.getPendingCarryforwardLeaveRequest(this.info.username).subscribe(data => {
      this.carryforwardLeave = data;
      this.dataSource = new MatTableDataSource<CarryforwardRequestData>(this.carryforwardLeave);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }
    );
  }
  
  sendCarryforward(carryforward) {
    this.interactionService.sendCarryforward(carryforward);
  }
  getSuccessMsg() {
    this.interactionService.msgDataSource$.subscribe(data => {
      if (data == "CarryforwardRequestAccepted") {
        this.getPendingCarryforwardRequest();
        this.responseMsg = "success3";
        this.responseMsgTimeOut();
      }
      else if (data == "CarryforwardRequestRejected") {
        this.getPendingCarryforwardRequest();
        this.responseMsg = "success2";
        this.responseMsgTimeOut();
      }
    });
  }
  responseMsg: string;
  responseMsgTimeOut() {
    setTimeout(() => {
      this.responseMsg = null;
    }, 3000);
  }
}
      
  



 
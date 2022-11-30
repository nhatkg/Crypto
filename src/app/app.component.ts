import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'crypto';
  showData: any;
  DataSlice: any = [];
  userFilter: string = '';
  DataFilter: any;
  isLoading = false;
  filterControl = new Subject<string>();
  reverse: boolean = true;
  isDes:boolean = false;
  options = ['All', 10, 20, 50];
  numbers: any = [];
  selectedPage = 1;
  handlePage: number = 1;
  ArrayN: any = [];
  totalPage: number = 1;
  editPrev: boolean = false;
  editNext: boolean = false;
  totalRecord: any;
  newArray:any;
  constructor(private product: ProductService) {}
  ngOnInit(): void {
    this.getAll();
    this.filterSearchInput();
  }
  // begin lấy toàn bộ dữ liệu
  getAll() {
    this.isLoading = true;
    setTimeout(() => {
      this.product.getData().subscribe((res) => {
        this.showData = res;
        this.showData = this.showData.filter((item: any) => {
          let isItem = item.symbol.includes('USD') && item.volume != 0;
          return isItem;
        });

        this.showData.forEach((item: any, index: number) => {
          item.priceChange = (item.openPrice - item.lastPrice) / item.openPrice;
          item.index = index;
        });
        this.isLoading = false;
        this.DataSlice = this.showData;
        this.totalRecord = this.showData.length;
        this.handlePage = this.totalRecord
        this.numbers = [1];
        this.selectedPage = 1;
      });
    }, 2000);
  }
  // FilterSearch
  filterSearchInput() {
    this.filterControl.subscribe((value) => {
      this.numbers = [];

      this.userFilter = value.trim().toLowerCase();
      if (this.userFilter) {
        this.DataSlice = this.showData.filter((data: any) =>
          data.symbol.toString().toLowerCase().includes(this.userFilter)
        );
        this.totalRecord = this.DataSlice.length;
        this.changePage(1);
      } else {
        this.DataSlice = this.showData;
        this.totalRecord = this.DataSlice.length;
        this.changePage(1);

      }
    });
  }
  //selected handle
  onChange(event: any) {
    this.handlePage = Number(event.target.value);
    console.log('this.handlepage', this.handlePage);
    
    this.selectedPage = 1;
    if (event.target.value == 'All') {
      this.DataSlice = this.showData;
      this.totalRecord = this.showData.length;
      this.handlePage = this.totalRecord
      this.selectedPage = 1;
      this.createArrayPaginationArray(this.totalRecord);
      this.changePage(this.selectedPage);
    }else {
      this.createArrayPaginationArray(this.totalRecord);
      this.changePage(this.selectedPage);
    }
    

  }
  createArrayPaginationArray(totalRecord: any) {
    this.totalPage = Math.ceil(totalRecord / this.handlePage);
  

    switch (true) {
      case this.totalPage <= 7: {
        const arr = [];
        for (let i = 1; i < this.totalPage + 1; i++) {
          arr.push(i);
        }
        this.numbers = arr;
        break;
      }
      case this.totalPage > 7: {
        if (this.selectedPage == this.totalPage) {
          this.numbers = [1, '...', this.totalPage];
        }
         else if (this.selectedPage >= 4 && this.selectedPage < this.totalPage - 1) {
        
          this.numbers = [
            1,
            '...',
            Number(this.selectedPage - 1),
            Number(this.selectedPage),
            Number(this.selectedPage + 1),
            '...',
            this.totalPage,
          ];
        }else if(this.selectedPage == this.totalPage -1){
          this.numbers = [
            1,
            '...',
            Number(this.selectedPage - 1),
            Number(this.selectedPage),
            this.totalPage
          ];
        }else if (this.selectedPage >= 1 && this.selectedPage < 4) {
          this.numbers = [1, 2, 3, 4, '...', this.totalPage];
        }

        break;
      }
    }
  }

  //changePage handle
  changePage(page: number) {
    if (page == 1 && this.numbers.length == 1) {
      this.editPrev = true;
      this.editNext = true;
    } else if (page == 1) {
      this.editPrev = true;
      this.editNext = false;
    } else if (page == 1 && this.numbers.length > 1) {
      // truong hop pagination length
      this.editPrev = true;
    } else if (page == Math.ceil(this.showData.length / this.handlePage)) {
      this.editNext = true;
      this.editPrev = false;
    } else {
      this.editPrev = false;
      this.editNext = false;
    }

    this.selectedPage = page;
    let pageIndex = (page - 1) * this.handlePage;

    let endPageIndex = (page - 1) * this.handlePage + this.handlePage;
    this.createArrayPaginationArray(this.totalRecord);
    this.DataSlice = [];
    if (this.userFilter) {
      const dataSearch = this.showData.filter((data: any) =>
        data.symbol.toString().toLowerCase().includes(this.userFilter)
      );
      // this.totalRecord = this.DataSlice.length;
      this.DataSlice = dataSearch.slice(pageIndex, endPageIndex);
      if (page == Math.ceil(dataSearch.length / this.handlePage)) {
        this.editNext = true;
        this.editPrev = false;
      }
      this.createArrayPaginationArray(dataSearch.length);
      return;
    }
    
    this.DataSlice = this.showData.slice(pageIndex, endPageIndex);
    
  }


  // Prev page
  prevPage() {
    this.selectedPage = this.selectedPage - 1;
   if (this.selectedPage == 1 && this.numbers.length > 1) {
      this.editPrev = true;
      this.editNext = false
    }
      else  if (this.selectedPage == 1) {
      this.editPrev = true;
    }
     else {
      this.editPrev = false;
      this.editNext = false;
    }
    let pageIndex = (this.selectedPage - 1) * this.handlePage;

    let endPageIndex =
      (this.selectedPage - 1) * this.handlePage + this.handlePage;

    this.DataSlice = [];
    if (this.userFilter) {
      const dataSearch = this.showData.filter((data: any) =>
        data.symbol.toString().toLowerCase().includes(this.userFilter)
      );
       
      // this.totalRecord = this.DataSlice.length;
      this.DataSlice = dataSearch.slice(pageIndex, endPageIndex);
      this.createArrayPaginationArray(dataSearch.length);
      return;
    }
    this.DataSlice = this.showData.slice(pageIndex, endPageIndex);
    this.createArrayPaginationArray(this.totalRecord);
  }
  // Next page
  nextPage() {
    this.selectedPage = this.selectedPage + 1;

    if (
      this.selectedPage === Math.ceil(this.showData.length / this.handlePage)
    ) {
      this.editNext = true;
    } else {
      this.editNext = false;
      this.editPrev = false;
    }
    let pageIndex = (this.selectedPage - 1) * this.handlePage;

    let endPageIndex =
      (this.selectedPage - 1) * this.handlePage + this.handlePage;

    this.DataSlice = [];
    if (this.userFilter) {
      const dataSearch = this.showData.filter((data: any) =>
        data.symbol.toString().toLowerCase().includes(this.userFilter)
      );
      // this.totalRecord = this.DataSlice.length;
      this.DataSlice = dataSearch.slice(pageIndex, endPageIndex);
      if (
        this.selectedPage === Math.ceil(dataSearch.length / this.handlePage)
      ) {
        this.editNext = true;
      }
      this.createArrayPaginationArray(dataSearch.length);
      return;
    }
    this.DataSlice = this.showData.slice(pageIndex, endPageIndex);
    this.createArrayPaginationArray(this.totalRecord);
  }
  sortId() {
    if (this.reverse) {
     this.newArray = this.DataSlice.sort(
        (a: any, b: any) => b.index - a.index
      );
      this.reverse = !this.reverse;
    } else if (!this.reverse) {
      this.newArray = this.DataSlice.sort(
        (a: any, b: any) => a.index - b.index
      );
      this.reverse = !this.reverse;
    }
  }
  sortName(symbol:any){
    console.log(this.isDes);
    this.isDes = !this.isDes
    let direction = this.isDes ? 1 : -1
    this.DataSlice.sort(function(a:any,b:any){
     if(a[symbol] < b[symbol]){
          return -1 * direction
     }
     else if(a[symbol] > b[symbol]){
      return 1 * direction
     }
     else return 0
    })
  }
}

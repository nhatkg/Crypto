import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ProductService } from './product.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, OnChanges {
  title = 'crypto';
  showData: any;
  DataSlice: any;
  userFilter: string = '';
  DataFilter: any;
  isLoading = false;
  filterControl = new Subject<string>();
  array2: any;
  options = ['All', 10, 20, 50];
  numbers: any = [];
  selectedPage = 1;
  handlePage: number = 1;
  ArrayN: any = [];
  constructor(private product: ProductService) {}
  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }
  ngOnInit(): void {
    this.getAll();

    this.filterControl.subscribe((value) => {
      this.numbers = [];

      this.userFilter = value.trim().toLowerCase();
      if (this.userFilter === '') {
        this.DataSlice = this.array2;
        this.selectedPage = 1;
      } else if (this.userFilter) {
        this.DataSlice = this.array2.filter((data: any) =>
          data.symbol.toString().toLowerCase().includes(this.userFilter)
        );
        console.log(this.DataSlice)
        this.pageSize()
      }
    });
  }
  // lấy toàn bộ dữ liệu
  getAll() {
    this.isLoading = true;
    setTimeout(() => {
      this.product.getData().subscribe((res) => {
        this.showData = res;
        console.log(this.showData);

        this.array2 = this.showData.filter((item: any) => {
          let isItem = item.symbol.includes('USD') && item.volume != 0;
          return isItem;
        });

        this.array2.forEach((item: any, index: number) => {
          item.priceChange = (item.openPrice - item.lastPrice) / item.openPrice;
          item.index = index;
        });
        this.isLoading = false;
        this.DataSlice = this.array2;

        this.numbers = [1];
        this.selectedPage = 1;
      });
    }, 2000);
  }

  //selected handle
  onChange(event: any) {
    this.handlePage = Number(event.target.value);
    console.log('this.handlePage', this.handlePage );
    
    console.log(this.handlePage);

    this.numbers = [];
    if (this.userFilter == '') {
      event.target.value == this.options[0];
    }
    if (event.target.value == this.options[0]) {
      this.DataSlice = this.array2;
    } else {
      this.DataSlice = this.array2.slice(0, event.target.value);
    }

    this.pageSize();
  }
  pageSize() {
    for (
      let i = 1;
      i < Math.ceil(this.array2.length / this.DataSlice.length) + 1;
      i++
    ) {
      this.numbers.push(i);
    }
  }

  //changePage handle
  changePage(page: number) {
    this.selectedPage = page;
    let pageIndex = (page - 1) * this.handlePage;
    // console.log('pageIndex',pageIndex);

    let endPageIndex = (page - 1) * this.handlePage + this.handlePage;
    this.DataSlice = [];

    this.DataSlice = this.array2.slice(pageIndex, endPageIndex);
  }
  // Prev page
  prevPage() {
    this.selectedPage = this.selectedPage - 1;
    console.log(this.selectedPage);

    let pageIndex = (this.selectedPage - 1) * this.handlePage;
    console.log(pageIndex);

    let endPageIndex =
      (this.selectedPage - 1) * this.handlePage + this.handlePage;
    console.log(endPageIndex);

    this.DataSlice = [];
    this.DataSlice = this.array2.slice(pageIndex, endPageIndex);
    console.log(this.DataSlice);
  }
  // Next page
  nextPage() {
    this.selectedPage = this.selectedPage + 1;
    console.log(this.selectedPage);

    let pageIndex = (this.selectedPage - 1) * this.handlePage;
    console.log(pageIndex);

    let endPageIndex =
      (this.selectedPage - 1) * this.handlePage + this.handlePage;
    console.log(endPageIndex);

    this.DataSlice = [];
    this.DataSlice = this.array2.slice(pageIndex, endPageIndex);
    console.log(this.DataSlice);
  }
}

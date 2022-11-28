import { Pipe, PipeTransform } from '@angular/core';
import { Crypto } from './Crypto';
@Pipe({
  name: 'searchfilter'
})
export class SearchfilterPipe implements PipeTransform {

  transform(value: Crypto[], unit:string){
    if(unit === 'userFilter'){
      return value
    }else{
      return value.filter((item) =>{
       return item.symbol.toLowerCase() === unit.toLowerCase()
      })
    }
  }

}

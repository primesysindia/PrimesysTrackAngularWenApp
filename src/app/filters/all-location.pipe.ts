import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'allLocation'
})
export class AllLocationPipe implements PipeTransform {

  transform(items: any, sortType: string): any {
    // console.log("data", items)
    let userType = localStorage.getItem('userType')
    if(!sortType)
    {
      return items;
    }
    else{
      if(sortType == 'all'){
        return items
      }
      else if(sortType == 'currentOn'){
        for (var i=0; i<items.length; i++) {
        if(userType == 'Child') {
          return items.filter(value => {
            return items[i].lat != 0 && items[i].lan != 0 ? value.icon.includes('darkGreen-marker') == true : value.icon.includes('darkGreen-marker') == false
          })
        }
        else 
          return items.filter(value => {
            return value.icon.includes('GreenCar') == true
        })
      }
      }
      else if(sortType == 'todayOn'){
        for (var i=0; i<items.length; i++) {
          if(userType == 'Child')
            return items.filter(value => {
              return items.lat != 0 && items.lan != 0 ? value.icon.includes('orange-marker') == true : value.icon.includes('orange-marker') == false
            })
          else
            return items.filter(value => {
              return value.icon.includes('RedCar') == true
            })
          }
        }
      else if(sortType == 'todayOff'){
        for (var i=0; i<items.length; i++) {
        if(userType == 'Child')
          return items.filter(value => {
            return items.lat != 0 && items.lan != 0 ? value.icon.includes('red-marker') == true :  value.icon.includes('red-marker') == false
          })
        else
          return items.filter(value => {
            return value.icon.includes('RedCar') == true
          })
        }
      }
      else if(sortType == 'pastOff'){
        for (var i=0; i<items.length; i++) {
        if(userType == 'Child')
          return items.filter(value => {
            return items.lat != 0 && items.lan != 0 ? value.icon.includes('gray-marker') == true : value.icon.includes('gray-marker') == false
          })
        }
      }
      else if(sortType == 'stoppage'){
        return items.filter(value =>{
          return value.icon.includes('BlueCar') == true
        })
       }
      else{
        return items;
      }
    }
  }

}
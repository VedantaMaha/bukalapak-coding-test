import { Component, OnInit } from '@angular/core';
import { ItemsService } from './services/items.service';
import { ItemData } from './item.model'
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'bukalapak';

  items: ItemData[] = [];
  menus: ItemData[] = [];
  categoryItems = {};
  categoryKeys = [];
  selectedMenuId: number;

  searchControl = new FormControl('');

  constructor(private itemService: ItemsService) { }

  ngOnInit(): void {
    this.getInitialData();
    this.itemService.getItems().subscribe(resp => {
      if (resp && resp.categories) {
        this.items = resp.categories;
        console.log('item get :: ', this.items);

        this.getMenu();
        this.setSearch();
      }
    });
  }

  getInitialData() {
    this.itemService.getItems().subscribe(resp => {
      if (resp && resp.categories) {
        this.items = resp.categories;
        console.log('item get :: ', this.items);

        this.getMenu();
        this.setSearch();
      }
    });
  }

  getMenu() {
    this.menus = this.items.filter(item => !item.parent_id);
    if (this.menus.length) {
      this.getItemDetails(this.menus[0].id);
      console.log('menus get :: ', this.menus);
    }
  }

  getItemDetails(menuId: number) {
    // get all item that has parent id of menuId
    const itemsOfMenu = this.items.filter(item => item.parent_id === menuId);
    this.selectedMenuId = menuId;
    console.log('items of selected menu :: ', itemsOfMenu);

    // we group per title, so the title become item key
    // ex: Hobi: [Pancing, etc..]
    this.categoryItems = {};
    itemsOfMenu.forEach(item => {
      // get exisitng category data
      const categorydata = this.categoryItems[item.title] ? this.categoryItems[item.title] : [];
      this.categoryItems[item.title ? item.title : 'Lainnya'] = [...categorydata, item];
    })
    this.categoryKeys = Object.keys(this.categoryItems);
    console.log('category per item :: ', this.categoryItems);
  }

  setSearch() {
    this.searchControl.valueChanges.subscribe((searchtxt: string) => {
      this.items = this.items.filter(item => {
        return item.name && item.name.toLowerCase().includes(searchtxt.toLowerCase())
      });
      console.log('item after filter ', this.items);
      this.getItemDetails(this.selectedMenuId);
    })
  }

  resetData() {
    this.searchControl.setValue('');
    this.getInitialData();
  }
}

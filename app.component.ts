import { Component, ViewChild, OnInit } from '@angular/core';
import { orderDataSource } from './data';
import { ChangeEventArgs } from '@syncfusion/ej2-dropdowns';
import { GridComponent, FilterService, FilterType } from '@syncfusion/ej2-angular-grids';
import { DataManager, JsonAdaptor, Predicate } from '@syncfusion/ej2-data';
import {createElement} from '@syncfusion/ej2-base';
import { FilterSettingsModel, IFilter, Filter } from '@syncfusion/ej2-angular-grids';
import { InputObject, TextBox } from  '@syncfusion/ej2-inputs';

@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.css'],
    providers: [FilterService]
})
export class AppComponent {
    public data: DataManager;
    public ddldata: Object[];
    public pageSettings: Object;
    public filterSettings: Object;
    public ddlfields: Object = { text: 'type', value: 'Id' };
    public formatoptions: Object;
    public filter : IFilter;
    public dropInstance: TextBox;

    @ViewChild('grid')
    public grid: GridComponent;

    ngOnInit(): void {
         this.filter = {
            ui: {
                create: (args: { target: Element, column: Object }) => {
                    let db: Object = new DataManager(this.data);
                    let flValInput: HTMLElement = createElement('input', { className: 'flm-input' });
                    args.target.appendChild(flValInput);
                    this.dropInstance = new TextBox({
                        placeholder: 'Client',
                        floatLabelType: 'Auto'
                    });
                this.dropInstance.appendTo(flValInput);
              },
                write: (args: {
                    column: Object, target: Element, parent: any,
                    filteredValue: string}) => {
                        if(args.filteredValue){
                        this.dropInstace.value = args.filteredValue;
                }
             },
                read: (args: { target: Element, column: any, operator: string, fltrObj: Filter }) => {
                    args.fltrObj.filterByColumn(args.column.field, args.operator, this.dropInstance.value);

            }
         }
      }
        let data = [{
        "OrderID": 10248,
        "OrderDate": "1996-07-04T10:10:00.000Z",
        "ShippedDate": "1996-07-16T12:20:00.000Z",
        "Freight": 32.38,
        "ShipName": "Vins et alcools Chevalier",
        "ShipAddress": "59 rue de l\"Abbaye",
        "ShipCity": "Reims",
        "ShipRegion": null,
        "ShipCountry": "France",
        "Client": {
          "CustomerID": "VINET",
          "ShipCountry": "France",
        }
    },
    {
        "OrderID": 10249,
        "OrderDate": "1996-07-05T12:20:00.000Z",
        "ShippedDate": "1996-07-10T13:20:00.000Z",
        "Freight": 11.61,
        "ShipName": "Toms Spezialitäten",
        "ShipAddress": "Luisenstr. 48",
        "ShipCity": "Münster",
        "ShipRegion": null,
        "ShipCountry": "Germany",
         "Client": {
          "CustomerID": "TOMSP",
           "ShipCountry": "Germany",
        }
    },
    {
        "OrderID": 10250,
        "OrderDate": "1996-07-08T08:40:00.000Z",
        "ShippedDate": "1996-07-12T07:50:00.000Z",
        "Freight": 65.83,
        "ShipName": "Hanari Carnes",
        "ShipAddress": "Rua do Paço, 67",
        "ShipCity": "Rio de Janeiro",
        "ShipRegion": "RJ",
        "ShipCountry": "Brazil",
        "Client": {
          "CustomerID": "HANAR",
           "ShipCountry": "Brazil",
        }
    }];
        this.data = new DataManager({
            json: data,
            adaptor: new SerialNoAdaptor
        }); 
        this.pageSettings = { pageCount: 5 };
        this.filterSettings = { type: 'Menu' };
    }
}

class SerialNoAdaptor extends JsonAdaptor {
    onWhere(datamanger, e) {
        if (!datamanger || !datamanger.length) {
            return datamanger;
        }
        return datamanger.filter(function (obj) {
            if (e) {
                let field = e.isComplex ? e.predicates[0].field : e.field;
                console.log('let field', e);
                if (field === 'Client.CustomerID') {
                    console.log('selezione cliente con predicate', e.predicates);
                    
                    let dummy = new Predicate('Client.ShipCountry', e.predicates[0].operator , e.predicates ? e.predicates[0].value : e.value);
                    let final = e.validate(obj)|| dummy.validate(obj);
                    console.log('determina se corretto', final, dummy);
                    return final;
                } else {
                    return e.validate(obj);
                }
            }
        });
    }
}
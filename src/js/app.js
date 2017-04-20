import ko from 'knockout';
import RefugeeCampMap from 'js/RefugeeCampMap';
import refugeeCampAppHtml from 'js/refugeeCampAppHtml';

class ViewModel {
  constructor() {
    this.refugeeCampList = ko.observableArray();
    this.refugeeCampMap = new RefugeeCampMap('map');
    this.refugeeCampMap.init()
    .then((refugeeCampData) => {
      refugeeCampData.forEach((val) => {
        this.refugeeCampList.push(val);
      });
    });
    this.sortType = ko.observable('population');
    this.countryFilter = ko.observable('');
    this.orderReversed = ko.observable(false);
    this.mapType = ko.observable('markers');
    this.dataPanelCollapsed = ko.observable(false);
    this.mapType.subscribe((mapType) => {
      // this makes sure the map items get updated when the map type changes
      this.refugeeCampMap.updateMapItems(this.filteredRefugeeCampList(), mapType);
    });
    this.filteredRefugeeCampList = ko.pureComputed(() => {
      // this computes the refugee camp list to apply the filter with the typed text
      let list = [];

      list = ko.utils.arrayFilter(this.refugeeCampList(), (i) => {
        // this filters the list with the text input
        if (i.country.toLowerCase().includes(this.countryFilter().toLowerCase())) {
          return true;
        }
        return false;
      });

      if (this.refugeeCampMap.mapLoaded()) {
        this.refugeeCampMap.updateMapItems(list, this.mapType());
      }
      list = this.sortRefugeeCampList(list);

      if (this.orderReversed()) {
        list.reverse();
      }

      return list;
    });
  }

  toggleDataPanel() {
    if (this.dataPanelCollapsed()) {
      this.dataPanelCollapsed(false);
    } else {
      this.dataPanelCollapsed(true);
    }
  }

  sortRefugeeCampList(list) {
    switch (this.sortType()) {
      case 'country':
        list.sort((a, b) => {
          if (a[this.sortType()] === b[this.sortType()]) {
            return 0;
          }
          return a[this.sortType()] < b[this.sortType()] ? -1 : 1;
        });
        break;
      case 'population':
        list.sort((a, b) => b[this.sortType()] - a[this.sortType()]);
        break;
      default:
        break;
    }
    return list;
  }

  refugeeCampClicked(data) {
    this.refugeeCampMap.campClicked(data);
  }

  sortClicked(key) {
    if (this.sortType() !== key) {
      this.orderReversed(false);
      this.sortType(key);
    } else if (this.orderReversed()) {
      this.orderReversed(false);
    } else {
      this.orderReversed(true);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.body.innerHTML = refugeeCampAppHtml();
  ko.applyBindings(new ViewModel());
});

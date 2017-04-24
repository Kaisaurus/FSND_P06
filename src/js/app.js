import ko from 'knockout';
import RefugeeCampMap from 'js/RefugeeCampMap';
import refugeeCampAppHtml from 'js/refugeeCampAppHtml';

class ViewModel {
  constructor(refugeeCampMap) {
    this.refugeeCampMap = refugeeCampMap;
    this.mapItemType = ko.observable('marker');
    // Map Items are created here so the mapItemType observable can be passed
    this.refugeeCampList = ko.observableArray(this.refugeeCampMap.createMapItems(this.mapItemType));
    this.sortType = ko.observable('population');
    this.countryFilter = ko.observable('');
    this.orderReversed = ko.observable(false);
    this.dataPanelCollapsed = ko.observable(false);
    this.filteredRefugeeCampList = ko.pureComputed(() => {
      // this computes the refugee camp list to apply the filter with the typed text
      let list = [];

      list = ko.utils.arrayFilter(this.refugeeCampList(), (i) => {
        // this filters the list with the text input
        if (i._data.country.toLowerCase().includes(this.countryFilter().toLowerCase())) {
          i.updateVisibility(true);
          return true;
        }
        i.updateVisibility(false);
        return false;
      });

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
      case 'country' || 'location':
        list.sort((a, b) => {
          if (a._data[this.sortType()] === b._data[this.sortType()]) {
            return 0;
          }
          return a._data[this.sortType()] < b._data[this.sortType()] ? -1 : 1;
        });
        break;
      case 'population':
        list.sort((a, b) => b._data[this.sortType()] - a._data[this.sortType()]);
        break;
      default:
        break;
    }
    return list;
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
  new RefugeeCampMap('map').init()
  .then((refugeeCampMap) => {
    ko.applyBindings(new ViewModel(refugeeCampMap));
  })
  .then(() =>
    // this is not done through an observable because it needs to be hidden before applyBindings
    document.getElementsByClassName('data-block')[0].classList.remove('hide')
  );
});

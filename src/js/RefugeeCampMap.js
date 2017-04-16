import googleMapsApiLoader from 'google-maps-api-loader';
import { mapsStyle } from 'js/mapsStyle';
import RefugeeCampMapItems from 'js/RefugeeCampMapItems';
import Notification from 'js/Notification';

export default class RefugeeCampMap {
  constructor(mapElementId) {
    this._notification = new Notification();
    this._notification.init();
    this._mapId = mapElementId;
    this._mapLoaded = false;
    this._mapItemType = 'markers';
    this._markers = [];
    this._circles = [];
  }

// init fetches the data and builds the google map
// it waits for the fetch data to complete before it returns
  async init() {
    try {
      this.buildMap(this._mapId);
      await this.fetchData();
    } catch (error) {
      this._notification.logError(error, 'RefugeeCampMap.init()');
    } finally {
      return this._data;
    }
  }

// builds a google maps item on the page
  buildMap(mapElementId) {
    return googleMapsApiLoader({
      libraries: ['map'],
      apiKey: 'AIzaSyBnXIbS00ma7w9Ci5D7qW2qd9gB1irCbac',
    })
    .then((googleApi) => {
      this._googleApi = googleApi;
      this._map = new googleApi.maps.Map(document.getElementById(mapElementId), {
        zoom: 3,
        center: { lat: Number(this._data[0].latitude), lng: Number(this._data[0].longitude) },
        styles: mapsStyle,
      });
      this._mapLoaded = true;
      this._refugeeCampMapItems = new RefugeeCampMapItems(this._googleApi, this._map);
      this._refugeeCampMapItems.createMapItems(this._data, this._mapItemType);
    })
    .catch((error) => Notification.logError(error, 'RefugeeCampMap.buildMap'));
  }


  updateMapItems(list, type) {
    if (this._refugeeCampMapItems) {
      this._refugeeCampMapItems.updateMapItems(list, type);
    } else {
      this._notification.notify('Please wait for the map to load.');
    }
  }

// fetches data from unhr.org api
  fetchData() {
    const url = 'http://data.unhcr.org/api/population/regions.json';
    return fetch(url, {
      method: 'GET',
    })
    .then((resp) => resp.json())
    .then((json) => this.parseRefugeeData(json))
    .catch((error) => Notification.logError(error, 'RefugeeCampMap.fetchData'));
  }

  parseRefugeeData(jsonData) {
    this._data = [];
    for (let i = 0; i < jsonData.length; i++) {
      const dataObject = jsonData[i];
      let newestPopulationData = 0;
      jsonData[i].population.map((v) => { // this checks which is the newest population data
        if (newestPopulationData < new Date(v.updated_at)) {
          newestPopulationData = v;
        }
        return newestPopulationData;
        // returning value to prevent ESLint error
      });
      dataObject.population_date = newestPopulationData.updated_at;
      dataObject.population_url = newestPopulationData.url;
      dataObject.population = newestPopulationData.value;
      dataObject.visible = true; // setting a default visible property for filtering
      dataObject.id = i;
      this._data.push(dataObject);
    }
    return this._data;
  }

  campClicked(refugeeCamp) {
    if (this._mapLoaded) {
      this._refugeeCampMapItems.campClicked(refugeeCamp);
    } else {
      this._notification.notify(
        'Please wait for the map to load before we can show location data.');
    }
  }

  mapLoaded() {
    return this._mapLoaded;
  }

}

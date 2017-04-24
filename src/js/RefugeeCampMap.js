import googleMapsApiLoader from 'google-maps-api-loader';
import { mapsStyle } from 'js/mapsStyle';
import RefugeeCampMapItem from 'js/RefugeeCampMapItem';
import Notification from 'js/Notification';

export default class RefugeeCampMap {
  constructor(mapElementId, mapItemType) {
    this._notification = new Notification();
    this._notification.init();
    this._mapId = mapElementId;
    this._mapItemType = mapItemType;
    this._mapItems = [];
  }

// init fetches the data and builds the google map
// it waits for the fetch data to complete before it returns
  async init() {
    try {
      await this.fetchData();
      await this.buildMap(this._mapId);
    } catch (error) {
      this._notification.logError(error, 'RefugeeCampMap.init()');
    } finally {
      return this;
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
      this._infoWindow = new this._googleApi.maps.InfoWindow({
        content: 'Content loading ...',
      });
    })
    .catch((error) => this._notification.logError(error, 'RefugeeCampMap.buildMap'));
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
      dataObject.id = i;
      this._data.push(dataObject);
    }
    return this._data;
  }

  createMapItems(mapItemType) {
    this._refugeeCampMapItems = [];
    this._data.forEach((item) => {
      const refugeeCampMapItem = new RefugeeCampMapItem(
        this._googleApi,
        this._map,
        this._infoWindow,
        this._notification);
      refugeeCampMapItem.init(item, mapItemType);
      this._refugeeCampMapItems.push(refugeeCampMapItem);
    });
    return this._refugeeCampMapItems;
  }

}

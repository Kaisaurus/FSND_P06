export default class RefugeeCampMapItems {
  constructor(googleApi, map) {
    this._googleApi = googleApi;
    this._map = map;
    this.infoWindow = new this._googleApi.maps.InfoWindow({
      content: 'Content loading...',
    });
    this._markers = [];
    this._circles = [];
    this._mapItems = [];
    this._mapItemType = 'markers';
  }

// this is just a function to create circles later
  getCircle(population) {
    return {
      path: this._googleApi.maps.SymbolPath.CIRCLE,
      fillColor: 'red',
      fillOpacity: 0.2,
      scale: Math.pow(2, population) / 2,
      strokeColor: 'white',
      strokeWeight: 0.5,
    };
  }

  toggleMapItems(type, boolean) {
    this._mapItemType = type;
    this[`_${type}`].forEach((item) => {
      item.setVisible(boolean);
    });
  }

  updateMapItems(list, type) {
    this._mapItemType = type;
    const mapItemsList = this[`_${type}`];
    if (mapItemsList && mapItemsList.length !== 0) {
      this.toggleMapItems('markers', false);
      this.toggleMapItems('circles', false);
      list.forEach((item) => {
        const matchedItem = this[`_${type}`].find((i) => item.id === i._id);
        matchedItem.setVisible(item.visible);
      });
    }
  }

  createMapItems(list, type) {
    list.forEach((item) => {
      const contentString = `
        <div class="content">
        <h3 class="title">${item.name}</h3>
        <h4 class="subtitle">${item.country}</h4>
        <dl>
          <dt>Population:</dt>
          <dd>${item.population}</dd>
        </dl>
      </div>
        `;

      const latLng = { lat: Number(item.latitude), lng: Number(item.longitude) };

      const marker = new this._googleApi.maps.Marker({
        position: latLng,
        map: this._map,
        animation: this._googleApi.maps.Animation.DROP,
        title: item.name + item.population,
        visible: false,
      });

      marker._id = item.id; // ID's are used to identify markers for the filtering
      marker._infoWindowContent = contentString;

      marker.addListener('click', () => {
        this.infoWindow.setContent(contentString);
        this.infoWindow.open(this._map, marker);
      });

      this._markers.push(marker);

      const circle = new this._googleApi.maps.Circle({
        center: latLng,
        radius: Math.sqrt(Number(item.population)) * 550,
        strokeColor: '#ff0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#ff0000',
        fillOpacity: 0.4,
        map: this._map,
        visible: false,
      });

      circle._id = item.id; // ID's are used to identify markers for the filtering
      circle._infoWindowContent = contentString;

      circle.addListener('mouseover', () => {
        this.infoWindow.setPosition(circle.getCenter());
        this.infoWindow.setContent(contentString);
        this.infoWindow.open(this._map);
      });

      circle.addListener('mouseout', () => {
        this.infoWindow.close();
      });

      this._circles.push(circle);
    });

    this.toggleMapItems(type, true);
  }

  campClicked(refugeeCamp) {
    const matchedItem = this[`_${this._mapItemType}`].find((i) => refugeeCamp.id === i._id);
    this.infoWindow.setPosition(matchedItem.getCenter());
    this.infoWindow.setContent(matchedItem._infoWindowContent);
    this.infoWindow.open(this._map);
    if (this._mapItemType === 'markers') {
      matchedItem.setAnimation(this._googleApi.maps.Animation.BOUNCE);
      window.setTimeout(() => matchedItem.setAnimation(null), 2000);
    }
  }
}

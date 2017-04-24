export default class RefugeeCampMapItem {
  constructor(googleApi, map, infoWindow, notification) {
    this._googleApi = googleApi;
    this._map = map;
    this._infoWindow = infoWindow;
    this._notification = notification;
  }

  init(refugeeCamp, mapItemType) {
    this._mapItemType = mapItemType;
    this._visible = true;
    this._data = refugeeCamp;
    this._infoWindowContent = `
      <div class="content">
        <h3 class="title">${refugeeCamp.name}</h3>
        <h4 class="subtitle">${refugeeCamp.country}</h4>
        <dl>
          <dt>Population:</dt>
          <dd>${refugeeCamp.population}</dd>
          <dt>Population updated date:</dt>
          <dd>${refugeeCamp.population_date}</dd>
          <dt>
            <a href="${refugeeCamp.population_url}" target="_blank">
            Population source
            </a>
          </dt>
        </dl>
      </div>
    `;

    this._latLng = { lat: Number(refugeeCamp.latitude), lng: Number(refugeeCamp.longitude) };

    this._marker = new this._googleApi.maps.Marker({
      position: this._latLng,
      map: this._map,
      animation: this._googleApi.maps.Animation.DROP,
      title: refugeeCamp.name + refugeeCamp.population,
      visible: this._mapItemType() === 'marker',
    });

    this._marker.addListener('click', () => {
      this.openInfoWindow();
    });

    this._circle = new this._googleApi.maps.Circle({
      center: this._latLng,
      radius: Math.sqrt(Number(refugeeCamp.population)) * 550,
      strokeColor: '#ff0000',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: '#ff0000',
      fillOpacity: 0.4,
      map: this._map,
      visible: this._mapItemType() === 'circle',
    });

    this._circle.addListener('mouseover', () => {
      this.openInfoWindow();
    });

    this._circle.addListener('mouseout', () => {
      this._infoWindow.close();
    });

    this._mapItemType.subscribe(() => {
      // this makes sure the map items get updated when the map type changes
      this.updateVisibility();
    });
  }

  updateVisibility(visible = undefined) {
    if (visible !== undefined) {
      this._visible = visible;
    }
    this._marker.setVisible(false);
    this._circle.setVisible(false);
    if (this._visible) {
      this[`_${this._mapItemType()}`].setVisible(true);
    }
  }

  openInfoWindow() {
    this._infoWindow.setContent(this._infoWindowContent);
    switch (this._mapItemType()) {
      case 'marker':
        if (this._marker.visible === true) {
          this._marker.setAnimation(this._googleApi.maps.Animation.BOUNCE);
          window.setTimeout(() => this._marker.setAnimation(null), 2000);
        }
        this._infoWindow.open(this._map, this._marker);
        break;
      case 'circle':
        this._infoWindow.setPosition(this._circle.getCenter());
        this._infoWindow.open(this._map);
        break;
      default:
        this._notification.logError('error in switch statement in RefugeeCampMapItem',
          'RefugeeCampMapItem.openInfoWindow()');
    }
  }

}

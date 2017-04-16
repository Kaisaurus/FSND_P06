import 'styles/main';

export default () => `
<div class="data-block">
  <nav class="panel data-panel" data-bind="
    css: {'collapsed': dataPanelCollapsed }">
    <div class="dataform-block">
      <div class="panel-block">
        <p class="control has-icon">
          <input data-bind="textInput: countryFilter" class="input is-small"
            type="text" placeholder="Type to filter for 'Country'">
          <span class="icon is-small">
            <i class="fa fa-search"></i>
          </span>
        </p>
      </div>
    </div>
    <p class="panel-tabs">
      <a data-bind="click: () => mapType('markers'),
        css: {'is-active': mapType() == 'markers'}">Markers</a>
      <a data-bind="click: () => mapType('circles'),
        css: {'is-active': mapType() == 'circles'}">Circles</a>
    </p>
    <div class="datatable-block">
      <table class="table is-bordered is-striped is-narrow">
        <thead>
          <tr>
            <th> Location </th>
            <th><a data-bind="
              click: (data, event) => sortClicked('country'),
              css: {
                'arrow-down': sortType() == 'country' && !orderReversed(),
                'arrow-up': sortType() == 'country' && orderReversed()
              }">
              Country </a></th>
            <th><a data-bind="
              click: (data, event) => sortClicked('population'),
              css: {
                'arrow-down': sortType() == 'population' && !orderReversed(),
                'arrow-up': sortType() == 'population' && orderReversed()
              }">
              Population </a></th>
          </tr>
        <thead>
        <tbody data-bind="foreach: filteredRefugeeCampList">
          <tr class="clickable" data-bind="click: $parent.refugeeCampClicked.bind($parent)">
            <td data-bind="text: name">&nbsp;</td>
            <td data-bind="text: country">&nbsp;</td>
            <td data-bind="text: Number(population).toLocaleString()">&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </div>
  </nav>
  <a data-bind="click: toggleDataPanel,
    text: dataPanelCollapsed() ? '>>' : '<<'" class="collapse-btn button is-primary clickable">
    <<
  </a>
</div>

  <div id="map" class="map-block">
    <span class="icon container hero-body has-text-centered">
      Loading...
      <span class="button is-loading is-outlined">
      </span>
    </span>
  </div>

`;

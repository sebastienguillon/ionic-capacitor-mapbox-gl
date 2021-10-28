import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { parisBordeauxPoints, parisBordeauxAreas } from 'src/app/data';

// Mapbox GL
import {
  Map,
  MapboxOptions,
  LineLayer,
  SymbolLayer,
  GeoJSONSource,
  EventData,
} from 'mapbox-gl';
import { MapService } from '../core/map.service';

@Component({
  selector: 'app-data1',
  templateUrl: './data1.page.html',
  styleUrls: ['./data1.page.scss'],
})
export class Data1Page implements AfterViewInit, OnInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private map?: Map;

  constructor(
    private mapService: MapService,
  ) { }

  ngOnInit() {
    console.log(`Data1Page ngOnInit()`);
  }

  ngAfterViewInit() {
    this.initMap();
    console.log(`Data1Page ngAfterViewInit()`);
  }

  private initMap(): void {
    if (this.mapContainer) {
      const options: MapboxOptions = {
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA',
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
      };

      this.map = new Map(options);

      this.map.on('load', () => {
        console.log(`Map "load" event`);
        this.map?.resize();

        this.map?.fitBounds([
          {
            lat: 34.58165319547932,
            lng: -5.202923933292027,
          },
          {
            lat: 55.47611931257899,
            lng: 9.129934806925206,
          },
        ]);

        this.addRouteLayer();
        this.addAreasLayer();
      });

      this.map.on('resize', () => {
        console.log(`Map "resize" event`);
      });

      this.map.on('click', (ev) => {
        console.log(`Map "click" event`, ev);
      });

      this.map.on('error', (err) => {
        console.log(`Map "error" event`, err);
      });
    }
  }

  ngOnDestroy() {
    this.map?.remove();
    console.log(`Data1Page ngOnDestroy(), map removed`);
  }

  addAreasLayer() {
    if (this.map) {
      const images = this.mapService.extractUniqueImagesFromFeatureCollection(parisBordeauxAreas, 'imageUrl');

      this.mapService.referenceAllImages(this.map, images).then(() => {
        const sourceId = 'areas-source';

        this.map?.addSource(sourceId, {
          type: 'geojson',
          data: parisBordeauxAreas,
        });
        const defaultIconSize = 0.2;
        const layer: SymbolLayer = {
          id: 'areas',
          type: 'symbol',
          source: sourceId,
          layout: {
            'icon-allow-overlap': true,
            'icon-image': ['get', 'imageUrl'],
            'icon-size': defaultIconSize,
            /*'icon-size': [
              'interpolate',
              ['exponential', 1],
              ['zoom'],
              5,
              defaultIconSize / 2,
              10,
              defaultIconSize * 2,
            ],*/
            /*'icon-size': [
              'case',
              ['has', 'icon-size'],
              ['get', 'icon-size'],
              defaultIconSize
            ],*/
            'icon-anchor': [
              'case',
              ['has', 'icon-anchor'],
              ['get', 'icon-anchor'],
              'center',
            ],
            'symbol-sort-key': [
              'case',
              ['has', 'symbol-sort-key'],
              ['get', 'symbol-sort-key'],
              1
            ]
          }
        };

        this.map?.addLayer(layer);
        /*this.map?.on('click', layer.id, (ev: EventData) => {
          console.log(`"click" event on layer "${layer.id}"`, ev);

          const featureId = ev.features[0].properties.Id;
          const source = this.map?.getSource(sourceId);
          if (source) {
            parisBordeauxAreas.features.forEach(feature => {
              if (feature && feature.properties) {
                if (feature.properties.Id === featureId) {
                  feature.properties['icon-size'] = defaultIconSize * 1.5;
                  feature.properties['symbol-sort-key'] = 37;
                } else {
                  feature.properties['icon-size'] = defaultIconSize;
                  feature.properties['symbol-sort-key'] = 1;
                }
              }
            });
            (source as GeoJSONSource).setData(parisBordeauxAreas);
          }
        });*/
      });
    }
  }

  addRouteLayer() {
    this.map?.addSource('route-source', {
      type: 'geojson',
      data: {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: parisBordeauxPoints
        }
      }
    });

    const routeLayer: LineLayer = {
      id: 'route',
      type: 'line',
      source: 'route-source',
      paint: {
        'line-color': '#f08',
        'line-width': 6,
      }
    };

    const roadLabelLayer = 'road-label';
    if (this.map?.getLayer(roadLabelLayer)) {
      this.map?.addLayer(routeLayer, roadLabelLayer);
    } else {
      this.map?.addLayer(routeLayer);
    }
  }
}

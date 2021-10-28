import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';

import { parisBordeauxPoints, parisBordeauxAreas } from 'src/app/data';

// Mapbox GL
import {
  Map,
  MapboxOptions,
  LineLayer,
  SymbolLayer
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
    console.log(`MapPage ngOnInit()`);
    console.log(`parisBordeauxAreas`, parisBordeauxAreas);
  }

  ngAfterViewInit() {
    this.initMap();
    console.log(`MapPage ngAfterViewInit()`);
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

      this.map.on('error', (err) => {
        console.log(`Map "error" event`, err);
      });
    }
  }

  ngOnDestroy() {
    this.map?.remove();
    console.log(`MapPage ngOnDestroy(), map removed`);
  }

  addAreasLayer() {
    if (this.map) {
      const images = this.mapService.extractUniqueImagesFromFeatureCollection(parisBordeauxAreas, 'imageUrl');
      console.log(`images`, images);
      this.mapService.referenceAllImages(this.map, images).then(() => {
        console.log('images referenced');

        this.map?.addSource('areas-source', {
          type: 'geojson',
          data: parisBordeauxAreas,
        });

        const layer: SymbolLayer = {
          id: 'areas',
          type: 'symbol',
          source: 'areas-source',
          layout: {
            'icon-allow-overlap': true,
            'icon-image': ['get', 'imageUrl'],
            'icon-size': 0.25,
            ['icon-anchor']: [
              'case',
              ['has', 'icon-anchor'],
              ['get', 'icon-anchor'],
              'center',
            ],
          }
        };

        this.map?.addLayer(layer);
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

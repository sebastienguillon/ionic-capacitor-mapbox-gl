import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MapboxOptions } from 'mapbox-gl';
import { MapFeatureType, MapLayer, MapOptions, VaLoggerLevel, VaMap, VaMapboxPlugin, VaPlacemark, VaPlacemarkPoint } from '@va/plugin-mapbox';
import { parisBordeauxAreas, parisBordeauxPoints } from '../data';
import { MapService } from '../core/map.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-data2',
  templateUrl: './data2.page.html',
  styleUrls: ['./data2.page.scss'],
})
export class Data2Page implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private vaMap?: VaMap;
  private subscriptions = new Subscription();

  constructor(private mapService: MapService) { }

  ngOnInit() {
    console.log(`MapPage ngOnInit()`);
    console.log(`parisBordeauxAreas`, parisBordeauxAreas);
  }

  ngAfterViewInit() {
    this.initMap();
    console.log(`MapPage ngAfterViewInit()`);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
    if (this.vaMap?.mapInstance) {
      this.vaMap.mapInstance.remove();
    }
    console.log(`MapPage ngOnDestroy(), map removed`);
  }

  private initMap(): void {

    const bounds: mapboxgl.LngLatBoundsLike = [
      {
        lat: 34.58165319547932,
        lng: -5.202923933292027,
      },
      {
        lat: 55.47611931257899,
        lng: 9.129934806925206,
      },
    ];

    if (this.mapContainer) {
      VaMapboxPlugin.init({
        accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA',
        loggerLevel: VaLoggerLevel.Errors,
      });
  
      const options: MapboxOptions = {
        attributionControl: false,
        pitchWithRotate: false,
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        preserveDrawingBuffer: true,
        bounds: bounds,
      };
  
      this.vaMap = VaMapboxPlugin.createMap(options);

      if(this.vaMap) {
        this.vaMap.ready()
        .then(
          () => {
            this.vaMap?.mapResize();

            this.vaMap?.mapInstance?.fitBounds([
              {
                lat: 34.58165319547932,
                lng: -5.202923933292027,
              },
              {
                lat: 55.47611931257899,
                lng: 9.129934806925206,
              },
            ]);

            this.addAreasLayer();
            this.addRouteLayer();
          },
        );

        this.subscriptions.add(this.vaMap.mapClicked().subscribe((event) => {
          console.log(`Map "click" event`);
        }));

        this.subscriptions.add(this.vaMap.on('resize').subscribe((event) => {
          console.log(`Map "resize" event`);
        }));

        this.subscriptions.add(this.vaMap.on('error').subscribe((event) => {
          console.log(`Map "error" event`, event);
        }));
      }
    }
  }

  private addAreasLayer(): void {
    if (this.vaMap) {
      const images = this.mapService.extractUniqueImagesFromFeatureCollection(parisBordeauxAreas, 'imageUrl');
      console.log(`images`, images);
      for (const imageUrl of images) {
        this.vaMap.loadAndAddImage(imageUrl, imageUrl); 
      }
      console.log('images referenced');

      const areasLayer = this.vaMap.createLayer('areas', [MapFeatureType.Point], {
        pointAutoFocus: true,
        defaultPointIconSize: 0.25,
        selectedPointIconSize: 0.3,
        // pointIconSizeAnimation: { from: 1, to: 1.5, step: 0.06 },
        setSelectedFeatureProperty: true,
      });

      areasLayer.setFeatureStyle(MapFeatureType.Point, {
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
      });

      areasLayer.loadGeoJson(parisBordeauxAreas);

    }
  }


  private addRouteLayer(): void {
    if (this.vaMap) {
      const roadLabelLayerId = 'road-label';
      const roadLabelLayer = this.vaMap.mapInstance?.getLayer(roadLabelLayerId);
      const routeLayer = this.vaMap.createLayer('route', [MapFeatureType.LineString], undefined, roadLabelLayer ? roadLabelLayerId : undefined);

      routeLayer.setFeatureStyle(MapFeatureType.LineString, {
        paint: {
          'line-color': '#f08',
          'line-width': 6,
        }
      });

      routeLayer.loadGeoJson({
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: parisBordeauxPoints
        }
      });

    }
  }
}

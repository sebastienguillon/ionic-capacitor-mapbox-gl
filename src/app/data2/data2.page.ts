import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MapboxOptions } from 'mapbox-gl';
import { MapFeatureType, MapLayer, MapOptions, VaLoggerLevel, VaMap, VaMapboxPlugin, VaPlacemark, VaPlacemarkPoint } from '@va/plugin-mapbox';

@Component({
  selector: 'app-data2',
  templateUrl: './data2.page.html',
  styleUrls: ['./data2.page.scss'],
})
export class Data2Page implements OnInit, AfterViewInit {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private vaMap?: VaMap;

  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit() {
    this.initMap();
    console.log(`MapPage ngAfterViewInit()`);
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
          },
        );
      }
    }
  }

}

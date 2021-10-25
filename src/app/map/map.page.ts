import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

// Mapbox GL
import {
  LngLatLike,
  Map,
  MapboxOptions,
  Marker,
  NavigationControl,
} from 'mapbox-gl';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements AfterViewInit, OnInit {
  @ViewChild('mapContainer') mapContainer?: ElementRef<HTMLDivElement>;
  private map?: Map;

  constructor() { }

  ngOnInit() {
    console.log(`MapPage ngOnInit()`);
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
}

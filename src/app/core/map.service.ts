import { Injectable } from '@angular/core';

// GeoJSON
import { FeatureCollection } from 'geojson';

// Mapbox GL
import {
  Map,
  MapboxOptions,
} from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  constructor() { }

  async referenceAllImages(map: Map, urls: string[]) {
    try {
      const promises: Promise<void>[] = [];
      urls.forEach(url => {
        promises.push(this.loadAndAddImage(map, url));
      });
      await Promise.all(promises);
    } catch (err: unknown) {
      console.log(err);
    }
  }

  extractUniqueImagesFromFeatureCollection(featureCollection: FeatureCollection, key: string): string[] {
    const urls: string[] = [];
    featureCollection.features.forEach((feature) => {
      if (feature && feature.properties && feature.properties[key]) {
        urls.push(feature.properties[key]);
      }
    });
    return [...new Set(urls)];
  }

  // 'https://docs.mapbox.com/mapbox-gl-js/assets/custom_marker.png'
  loadImage(map: Map, url: string): Promise<HTMLImageElement | ImageBitmap> {
    return new Promise((resolve, reject) => {
      map.loadImage(url, (error, image) => {
        if (error || !image) {
          reject(new Error(`Unable to load ${url}`));
        } else {
          resolve(image);
        }
      });
    });
  }

  async loadAndAddImage(map: Map, url: string): Promise<void> {
    try {
      const image = await this.loadImage(map, url);
      return map.addImage(url, image);
    } catch (err: unknown) {
      throw err;
    }
  }
}

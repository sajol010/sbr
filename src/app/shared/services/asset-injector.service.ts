import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AssetInjectorService {
  private loadedScripts = new Set<string>();
  private loadedStyles = new Set<string>();

  constructor() {}

  injectStyles(urls: string[], targetElement: HTMLElement = document.head): void {
    urls.forEach(url => {
      if (!this.loadedStyles.has(url)) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = url;
        targetElement.appendChild(link);
        this.loadedStyles.add(url);
      }
    });
  }

  injectScripts(urls: string[], targetElement: HTMLElement = document.body): Promise<void> {
    return urls.reduce((promise, url) => {
      return promise.then(() => this.injectScript(url, targetElement));
    }, Promise.resolve());
  }

  private injectScript(url: string, targetElement: HTMLElement): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.loadedScripts.has(url)) {
        resolve(); // Already loaded
        return;
      }

      const script = document.createElement('script');
      script.src = url;
      script.type = 'text/javascript';
      script.onload = () => {
        this.loadedScripts.add(url);
        resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
      targetElement.appendChild(script);
    });
  }
}
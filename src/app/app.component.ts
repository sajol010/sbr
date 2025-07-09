import { Component, OnInit } from '@angular/core';
import { AssetInjectorService } from './shared/services/asset-injector.service';
import { LoaderService } from './shared/loader/loader.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'smart-bookr-cli';
  constructor( 
    public assetInjectorS: AssetInjectorService
    , public loaderService: LoaderService
  ) { }

  ngOnInit() {
    this.injectAsset();
  }

  injectAsset(){    
    // Inject multiple CSS
    this.assetInjectorS.injectStyles([
      'assets/css/bootstrap.min.css',
      'assets/vendors/css/vendors.min.css',
      'assets/vendors/css/daterangepicker.min.css',
      'assets/css/theme.min.css',
    ]);

    // Inject multiple JS into body
    this.assetInjectorS.injectScripts([
      'assets/vendors/js/vendors.min.js',
      'assets/vendors/js/daterangepicker.min.js',
      'assets/vendors/js/apexcharts.min.js',
      'assets/vendors/js/circle-progress.min.js',
      'assets/js/common-init.min.js',
      'assets/js/dashboard-init.min.js',
      'assets/js/theme-customizer-init.min.js'
    ]).then(() => {
      console.log('All scripts loaded!');
    }).catch(err => {
      console.error(err);
    });
  }


}

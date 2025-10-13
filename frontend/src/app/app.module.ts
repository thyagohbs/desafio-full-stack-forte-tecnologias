import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { EmployeeAssetsComponent } from './features/assets/pages/employee-assets/employee-assets.component';
import { AssetsComponent } from './features/assets/pages/assets/assets.component';
import { AssetFormComponent } from './features/assets/components/asset-form/asset-form.component';

@NgModule({
  declarations: [AppComponent, ConfirmationDialogComponent, EmployeeAssetsComponent, AssetsComponent, AssetFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

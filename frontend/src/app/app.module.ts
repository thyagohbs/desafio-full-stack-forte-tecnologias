import { AssetFormComponent } from './features/assets/components/asset-form/asset-form.component';
import { ConfirmationDialogComponent } from './shared/components/confirmation-dialog/confirmation-dialog.component';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { AssetsComponent } from './features/assets/pages/assets/assets.component';
import { AppRoutingModule } from './app-routing.module';
import { EmployeeAssetsComponent } from './features/assets/pages/employee-assets/employee-assets.component';
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ConfirmationDialogComponent,
    EmployeeAssetsComponent,
    AssetsComponent,
    AssetFormComponent,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { AlertController, Platform, ToastController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class ServiceWorkerService {
  private initFinished = false;

  private isNewVersionAvailableSubject$ = new BehaviorSubject<boolean>(false);
  public isNewVersionAvailable$ = this.isNewVersionAvailableSubject$.asObservable();

  private isOnlineSubject$ = new BehaviorSubject<boolean>(true);
  public isOnline$ = this.isOnlineSubject$.asObservable();

  private modalPwaPlatformsSubject$ = new BehaviorSubject<string[]>(null);
  public modalPwaPlatforms$ = this.modalPwaPlatformsSubject$.asObservable();

  private modalPwaEvent: any;

  constructor(
    private swUpdate: SwUpdate,
    private platform: Platform,
    private toastController: ToastController,
    private alertController: AlertController
  ) {

    if (!this.initFinished) {
      console.log('START SERVICE WORKER >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>');
      console.log(`SW_ENABLED=[${this.swUpdate.isEnabled}]`);

      if (this.swUpdate.isEnabled) {
        this.swUpdate.available.subscribe(() => {
          console.log(`SW_NEW_VERSION=[TRUE]`);
          this.showAppNewVersionPopUp();
        });
      }

      this.updateOnlineStatus();
      window.addEventListener('online', this.updateOnlineStatus.bind(this));
      window.addEventListener('offline', this.updateOnlineStatus.bind(this));

      this.loadModalPwa();
      this.initFinished = true;

      console.log('SERVICE WORKER END <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<');
    }
  }

  public async showPWAInstallMsg(): Promise<void> {
    this.loadModalPwa();
  }

  public async reloadApp(): Promise<void> {
    this.isNewVersionAvailableSubject$.next(false);
    window.location.reload();
  }

  public async showAppNewVersionPopUp(): Promise<void> {
    const alert = await this.alertController.create({
      header: "Актуализиране на приложението (препоръчително)",
      message: "Налична е нова версия на това приложение. Искате ли да заредите?",
      backdropDismiss: false,
      buttons: [
        {
          text: "По късно",
          role: 'cancel',
          handler: () => {
            this.isNewVersionAvailableSubject$.next(true);
          },
        },
        {
          text: "Заредете",
          role: 'confirm',
          handler: () => {
            this.reloadApp();
          },
        },
      ],
    });
    await alert.present();
  }

  private async updateOnlineStatus(): Promise<void> {
    console.info(`ONLINE=[${window.navigator.onLine}]`);
    this.isOnlineSubject$.next(window.navigator.onLine);

    const networkToast = await this.toastController.create({
      message: !this.initFinished && window.navigator.onLine ? "Установена е връзка" : window.navigator.onLine ? "Установена е връзка отново" : "Не може да се установи връзка. Приложението все още работи, някои функции може да бъдат засегнати.",
      duration: this.initFinished ? 4000 : 1000
    });
    networkToast.present();
  }

  private async loadModalPwa(): Promise<void> {
    console.log(`PLATFORMS=[${this.platform.platforms()}]`);
    this.modalPwaPlatformsSubject$.next(this.platform.platforms());

    if (this.platform.is('android')) {
      window.addEventListener('beforeinstallprompt', (event: any) => {
        event.preventDefault();
        this.modalPwaEvent = event;
        this.showInstallAlert('android');
      });
    } else if (this.platform.is('ios')) {
      const isInStandaloneMode = ('standalone' in window.navigator) && ((<any>window.navigator)['standalone']);
      if (!isInStandaloneMode) {
        this.showInstallAlert('ios');
      }
    } else {
      // OTHER PLATFORM
    }
  }

  private async showInstallAlert(platform: 'android' | 'ios'): Promise<void> {
    const message = platform === 'ios' ? `
              За да инсталирате това приложение на вашето устройство, докоснете бутона „Меню“. 
              <i class="fa-thin fa-arrow-up-from-square"></i>
              и тогава "Add to home screen" бутон <i class="fa-thin fa-plus"></i>
            ` : 'Добави към началния екран';

    const alert = await this.alertController.create({
      header: "Инсталирай приложението",
      message: message,
      buttons: [
        {
          text: platform === 'ios' ? 'Затвори' : 'Добави',
          role: platform === 'ios' ? 'cancel' : 'confirm',
          handler: () => {
            if (platform === 'android' && this.modalPwaEvent) {
              this.modalPwaEvent.prompt();
            }
          },
        },
      ],
    });
    await alert.present();
  }
}

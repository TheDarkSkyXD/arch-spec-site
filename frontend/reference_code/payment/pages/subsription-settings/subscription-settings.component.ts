import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageHeaderComponent } from '../../components/page-header/page-header.component';
import {
  SharedExitIconsComponent,
  SharedSettingsMenuComponent,
} from '@codefrost/shared-ui';
import { settingsMenus } from '../../journey/dashboard/settings/settings-content';
import { Router } from '@angular/router';
import { SettingsContent } from '@codefrost/shared-types';
import { SharedNgAuthService } from '@codefrost/ng-lib';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DeleteAccountModalComponent } from '../../components/delete-account-modal/delete-account-modal.component';

@Component({
    selector: 'app-subscription-settings',
    imports: [
        CommonModule,
        PageHeaderComponent,
        SharedSettingsMenuComponent,
        DeleteAccountModalComponent,
        SharedExitIconsComponent,
    ],
    templateUrl: './subscription-settings.component.html',
    styleUrl: './subscription-settings.component.sass'
})
export class SubscriptionSettingsComponent {
  @Output() accountDeletion = new EventEmitter<void>();
  settingsMenus = settingsMenus;
  @ViewChild('deleteAccountModal') deleteAccountModal!: NgbModal;

  constructor(
    private router: Router,
    private appAuthService: SharedNgAuthService,
    private ngbModal: NgbModal
  ) {
    this.settingsMenus.map((menu: SettingsContent) => {
      if (menu) {
        menu.isAvailable = menu.label === 'Logout';
      }
    });
  }

  async navigateRoute(link: string | null | undefined) {
    if (link === 'logout') {
      try {
        await this.appAuthService.logout();
        console.log('Logout successful');
      } catch (error) {
        console.error('Logout failed:', error);
      }
    } else if (link) {
      await this.router.navigate(['/settings-subscription' + link]);
    }
  }

  openDeleteAccountModal() {
    if (this.deleteAccountModal) {
      this.ngbModal.open(this.deleteAccountModal, {
        centered: true,
        size: 'md',
      });
    } else {
      console.error('Delete account modal not found');
    }
  }
}

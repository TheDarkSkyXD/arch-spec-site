import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { subscriptionContent } from './subscription-content';
import { FormsModule } from '@angular/forms';
import { AppSubscriptionService } from '../../_services/subscription/app-subscription.service';
import { ThAppService } from '../../_services/th-app.service';
import { LoaderComponent } from '../../loader/loader.component';
import { SubscriptionPlan, TrulyHappyUser } from '@codefrost/shared-types';
import { NavigationService } from '../../_services/navigation/navigation.service';
import { PlatformService } from '@codefrost/ng-lib';
import { ActivatedRoute } from '@angular/router';

declare global {
  interface Window {
    getDigitalGoodsService: (serviceId: string) => Promise<any>;
  }
}

@Component({
    selector: 'app-subscription',
    imports: [CommonModule, FormsModule, LoaderComponent],
    templateUrl: './subscription.component.html',
    styleUrl: './subscription.component.sass'
})
export class SubscriptionComponent implements OnInit {
  @Input() ctaLabel = 'Try free and subscribe';
  content = subscriptionContent;
  plans: SubscriptionPlan[] = [];
  bestValuePlan: SubscriptionPlan | undefined;
  bestValuePlanMonthlyPrice: string | undefined;
  selectedPlan: SubscriptionPlan | undefined;
  currentCustomer: any;
  isCreatingCheckoutUrl = false;
  currentUser: TrulyHappyUser | undefined;
  isForCheckout = false;

  constructor(
    private platformService: PlatformService,
    private subscriptionService: AppSubscriptionService,
    private appService: ThAppService,
    private navService: NavigationService,
    private route: ActivatedRoute
  ) {}

  async ngOnInit(): Promise<void> {
    if (this.platformService.isBrowser()) {
      this.populateSubscriptionPlans();
      const billingService = await this.verifyGooglePlayBillingAvailability();
      if (billingService) {
        alert('Google Play Billing is supported');
        this.handleQueryParams(); // TODO: Replace with Google Play Billing API
      } else {
        this.handleQueryParams();
      }
    }
  }

  private async verifyGooglePlayBillingAvailability() {
    console.log('Checking if Digital Goods API is supported...');
    if ('getDigitalGoodsService' in window) {
      console.log('Digital Goods API is supported!');
      try {
        const service = await window.getDigitalGoodsService(
          'https://play.google.com/billing'
        );
        if (service) {
          console.log('Google Play Billing is supported');

          const itemDetails = await service.getDetails([
            'trulyhappy_subscription',
          ]);
          console.log('Item Details:', itemDetails);

          return service;
        } else {
          console.error('Google Play Billing is not supported');
          return;
        }
      } catch (error) {
        console.error('Google Play Billing is not supported', error);
        return;
      }
    } else {
      console.log('Digital Goods API is not available');
    }
  }

  private handleQueryParams() {
    this.route.queryParams.subscribe((params) => {
      this.isForCheckout = params['isForCheckout'] === 'true';
      if (this.isForCheckout) {
        this.processUserSubscription();
      }
    });
  }

  private processUserSubscription() {
    this.appService.getUser().subscribe((user) => {
      if (user) {
        this.currentUser = user;
        this.getOrCreateCustomer(user);
        this.navigateToJourneyIfSubscribed(user);
      } else {
        this.appService.refreshUserCache();
      }
    });
  }

  private navigateToJourneyIfSubscribed(user: TrulyHappyUser) {
    this.subscriptionService
      .getCurrentCustomerSubscription(user.email)
      .subscribe({
        next: (subscription) => {
          if (subscription) {
            this.navService.goToDashboard();
          }
        },
        error: (error) => {
          console.error('Error getting subscription', error);
        },
      });
  }

  private getOrCreateCustomer(user: TrulyHappyUser) {
    this.subscriptionService
      .getCurrentCustomer(user.email)
      .subscribe((customer) => {
        if (!customer) {
          if (!user.email) {
            console.error('User has no email');
            return;
          }

          this.createCustomerSubscription(user);
        } else {
          this.currentCustomer = customer;
          console.log('Got existing customer', customer);
        }
      });
  }

  private createCustomerSubscription(user: TrulyHappyUser) {
    const name = this.getUserName(user);

    const result = this.subscriptionService
      .createCustomer(user.email, `${name}`)
      .subscribe({
        next: (newCustomer) => {
          this.currentCustomer = newCustomer;
          console.log('Created new customer', result);
        },
        error: (error) => {
          console.error('Error creating customer', error);
        },
      });
  }

  private getUserName(user: TrulyHappyUser) {
    let name = `${user.first_name} ${user.last_name}`;
    if (name.trim().length === 0) {
      name = user.email;
    }
    return name;
  }

  private populateSubscriptionPlans() {
    this.subscriptionService.listPlans().subscribe({
      next: (plans) => {
        if (plans) {
          this.plans = plans;
          this.setBestValuePlan();
        }
      },
      error: (error) => {
        console.error('Error getting subscription plans', error);
        this.navService.goToError();
      },
    });
  }

  private setBestValuePlan() {
    this.bestValuePlan = this.getBestValuePlan();
    if (this.bestValuePlan) {
      const bestValuePlanPerMonth =
        this.getBestValuePlanMonthlyPrice(this.bestValuePlan) / 100;
      this.bestValuePlanMonthlyPrice = `$${bestValuePlanPerMonth}/month`;

      // Set the default selected plan to the best value plan
      this.selectedPlan = this.bestValuePlan;
    }
  }

  private getBestValuePlan(): SubscriptionPlan | undefined {
    let lowestPricePerMonth = Infinity;
    let lowestPricePerMonthPlan: SubscriptionPlan | undefined;

    for (const plan of this.plans) {
      const pricePerMonth = this.getBestValuePlanMonthlyPrice(plan);

      if (pricePerMonth < lowestPricePerMonth) {
        lowestPricePerMonth = pricePerMonth;
        lowestPricePerMonthPlan = plan;
      }
    }

    return lowestPricePerMonthPlan;
  }

  private getBestValuePlanMonthlyPrice(plan: SubscriptionPlan): number {
    let pricePerMonth = plan.price / plan.interval_count;
    if (plan.interval === 'year') {
      pricePerMonth /= 12;
    }

    return pricePerMonth;
  }

  formatPlanDescription(plan: SubscriptionPlan): string {
    const pricePerMonth = plan.price / 100 / plan.interval_count;
    const formattedPrice = `$${pricePerMonth.toFixed(0)}/${plan.interval}`;
    const trialDays = plan.has_free_trial ? plan.trial_interval_count : 0;
    const trialText = trialDays > 0 ? ` after ${trialDays}-day trial` : '';
    return `${formattedPrice}${trialText}`;
  }

  subscribe() {
    if (!this.isForCheckout) {
      this.navService.goToSignUp();
      return;
    }

    if (!this.selectedPlan || !this.currentUser) {
      return;
    }
    this.isCreatingCheckoutUrl = true;
    this.subscriptionService
      .createCheckout(
        this.selectedPlan.id,
        this.currentUser.email,
        this.currentUser.id.toString()
      )
      .subscribe({
        next: this.navigateToCheckoutUrl,
        error: (error) => {
          this.isCreatingCheckoutUrl = false;
          console.error('Error creating checkout URL', error);
        },
      });
  }

  private navigateToCheckoutUrl(checkoutObject: {
    data: { data: { attributes: { url: string } } };
  }) {
    this.isCreatingCheckoutUrl = false;
    if (checkoutObject && checkoutObject.data && checkoutObject.data.data) {
      const checkoutUrl = checkoutObject.data.data.attributes.url;
      console.log('Checkout URL:', checkoutUrl);
      window.createLemonSqueezy();
      window.LemonSqueezy.Url.Open(checkoutUrl);
    } else {
      console.error('Error creating checkout URL');
    }
  }

  selectPlan(plan: SubscriptionPlan) {
    this.selectedPlan = plan;
    this.isCreatingCheckoutUrl = false;
  }

  openSettings() {
    this.navService.goToSubscriptionSettings();
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionSettingsComponent } from './subscription-settings.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import {
  BASE_API_URL,
  CONTENT_API_URL,
  INTERNAL_API_URL,
  INTERNAL_CONTENT_API_URL,
  POST_LOGIN_REDIRECT_URL,
  SharedNgAuthService,
} from '@codefrost/ng-lib';
import { LocalStorageService } from 'ngx-webstorage';
import {
  MockLocalforageService,
  MockLocalstorageService,
} from '@codefrost/mock-services';
import { LocalForageService } from '@codefrost/storage';
import { NavigationService } from '../../_services/navigation/navigation.service';

describe('SettingsComponent', () => {
  let component: SubscriptionSettingsComponent;
  let fixture: ComponentFixture<SubscriptionSettingsComponent>;
  let mockNavService: jest.Mocked<NavigationService>;
  let mockSharedNgAuthService: jest.Mocked<SharedNgAuthService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionSettingsComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: 'testId' }),
          },
        },
        { provide: BASE_API_URL, useValue: 'http://testing-mockup-url' },
        { provide: CONTENT_API_URL, useValue: 'http://testing-mockup-url' },
        {
          provide: INTERNAL_CONTENT_API_URL,
          useValue: 'http://testing-mockup-url',
        },
        { provide: INTERNAL_API_URL, useValue: 'http://testing-mockup-url' },
        { provide: POST_LOGIN_REDIRECT_URL, useValue: '/dashboard' },
        {
          provide: LocalStorageService,
          useClass: MockLocalstorageService,
        },
        {
          provide: LocalForageService,
          useClass: MockLocalforageService,
        },
        {
          provide: NavigationService,
          useValue: mockNavService,
        },
        {
          provide: SharedNgAuthService,
          useValue: mockSharedNgAuthService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

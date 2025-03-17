import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubscriptionComponent } from './subscription.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  BASE_API_URL,
  CONTENT_API_URL,
  CONTENT_SITE_ID,
  INTERNAL_API_URL,
  INTERNAL_CONTENT_API_URL,
} from '@codefrost/ng-lib';
import { LocalStorageService } from 'ngx-webstorage';
import {
  MockLocalforageService,
  MockLocalstorageService,
} from '@codefrost/mock-services';
import { LocalForageService } from '@codefrost/storage';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('SubscriptionComponent', () => {
  let component: SubscriptionComponent;
  let fixture: ComponentFixture<SubscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SubscriptionComponent, HttpClientTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { queryParams: of({}) },
        },
        { provide: CONTENT_SITE_ID, useValue: 'http://testing-mockup-url' },
        { provide: BASE_API_URL, useValue: 'http://testing-mockup-url' },
        { provide: CONTENT_API_URL, useValue: 'http://testing-mockup-url' },
        {
          provide: INTERNAL_CONTENT_API_URL,
          useValue: 'http://testing-mockup-url',
        },
        { provide: INTERNAL_API_URL, useValue: 'http://testing-mockup-url' },
        {
          provide: LocalStorageService,
          useClass: MockLocalstorageService,
        },
        {
          provide: LocalForageService,
          useClass: MockLocalforageService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

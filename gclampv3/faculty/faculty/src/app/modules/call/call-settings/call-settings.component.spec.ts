import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CallSettingsComponent } from './call-settings.component';

describe('CallSettingsComponent', () => {
  let component: CallSettingsComponent;
  let fixture: ComponentFixture<CallSettingsComponent>;

  const seleniumHelpers = require('../../../shared/drivers/webdriver.js');

  let driver;
  const path = '/src/content/devices/input-output/index.html';
  const url = `${process.env.BASEURL ? process.env.BASEURL : ('file://' + process.cwd())}${path}`;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CallSettingsComponent ]
    })
    .compileComponents();
    return driver.get(url);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CallSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('shows at least one audio input device', async () => {
    await driver.wait(driver.executeScript(() => {
      return document.getElementById('audioSource').childElementCount > 0;
    }));
  });

  it('shows at least one video input device', async () => {
    await driver.wait(driver.executeScript(() => {
      return document.getElementById('videoSource').childElementCount > 0;
    }));
  });

  it('shows at least one audio output device device', async function() {
    if (process.env.BROWSER === 'firefox') {
      this.skip();
    }
    await driver.wait(driver.executeScript(() => {
      return document.getElementById('audioOutput').childElementCount > 0;
    }));
  });
});

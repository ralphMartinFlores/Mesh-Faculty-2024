import { Injectable } from '@angular/core';
import { Theme, light, dark, green, orig} from "./theme";

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private active: Theme = green;
  private availableThemes: Theme[] = [light, dark, green];

  getAvailableThemes(): Theme[] {
    return this.availableThemes;
  }

  getActiveTheme(): Theme {
    return this.active;
  }

  isDarkTheme(): boolean {
    return this.active.name === dark.name;
  }

  isGreenTheme(): boolean {
    return this.active.name === green.name;
  }


  setGreenTheme(): void {
    localStorage.setItem('theme', JSON.stringify(green));
    this.setActiveTheme(green);
  }

  setDarkTheme(): void {
    localStorage.setItem('theme', JSON.stringify(dark));
    this.setActiveTheme(dark);
  }

  setLightTheme(): void {
    localStorage.setItem('theme', JSON.stringify(orig));
    this.setActiveTheme(orig);
  }

  setActiveTheme(theme: Theme): void {
    this.active = theme;

    Object.keys(this.active.properties).forEach(property => {
      document.documentElement.style.setProperty(
        property,
        this.active.properties[property]
      );
    });
  }
}

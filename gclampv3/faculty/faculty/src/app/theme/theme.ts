export interface Theme {
    name: string;
    properties: any;
  }

  export const orig: Theme = {
    name: "default",
    properties: {
      "--clr-primary": "#0166b3",
      "--clr-secondary": "#E4EFFA",
      "--clr-third": "#167ac7",
      "--clr-white": "ffffff",
      "--clr-bg": "f5f5f5",
      "--clr-neutral": "#222C2A",
      "--clr-light": "#7ec7ff"
    }
  };




  
  export const light: Theme = {
    name: "light",
    properties: {
      "--foreground-default": "#41474D",
      "--foreground-secondary": "#41474D",
      "--foreground-tertiary": "#797C80",
      "--foreground-quaternary": "#F4FAFF",
      "--foreground-light": "#41474D",
  
      "--background-default": "#f5f5f5",
      "--background-secondary": "#ffffff",
      "--background-tertiary": "#fff",
      "--background-light": "#FFFFFF",
      "--background-light-gray": "#f5f5f5",


      "--border-light-gray": "#c7c7c7",
      
  
      "--primary-default": "#5DFDCB",
      "--primary-dark": "#24B286",
      "--primary-light": "#B2FFE7",
  
      "--error-default": "#EF3E36",
      "--error-dark": "#800600",
      "--error-light": "#FFCECC",
  
      "--background-tertiary-shadow": "0 1px 3px 0 rgba(92, 125, 153, 0.5)"
    }
  };
  
  export let dark: Theme = {
    name: "dark",
    properties: {
      "--foreground-default": "#ffffff",
      "--foreground-secondary": "#404040",
      "--foreground-tertiary": "#383838",
      "--foreground-quaternary": "#E5E5E5",
      "--foreground-light": "#8A8A8A",
  
      "--background-default": "#121212",
      "--background-secondary": "#282828",
      "--background-tertiary": "#181818",
      "--background-light": "#404040",
      "--background-light-gray": "#404040",


      "--border-light-gray": "#404040",

  
      "--primary-default": "#5DFDCB",
      "--primary-dark": "#24B286",
      "--primary-light": "#B2FFE7",
  
      "--error-default": "#EF3E36",
      "--error-dark": "#800600",
      "--error-light": "#FFCECC",
  
      "--background-tertiary-shadow": "0 1px 3px 0 rgba(8, 9, 10, 0.5)"
    }
  };



  export let green: Theme = {
    name: "green",
    properties: {
      "--clr-primary": "green",
      "--clr-secondary": "green",
      "--clr-third": "#167ac7",
      "--clr-white": "ffffff",
      "--clr-bg": "f5f5f5",
      "--clr-neutral": "#222C2A",
      "--clr-light": "#7ec7ff",
    
    }
  };


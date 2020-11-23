export const setFontSize = (fontSize: number, options) => {
  if (!fontSize) {
    return options
  }
  const pt = Number(fontSize) * 3/4;
  const scale = pt/5;
  options.bondThickness = 0.6 * scale;
  options.bondLength = 15 * scale;
  options.bondSpacing = 0.18 * 15 * scale;
  options.fontSizeLarge = pt;
  options.fontSizeLargePx = fontSize;
  options.fontSizeSmall = 3 * scale;
  options.fontSizeSmallPx = (3 * scale) * 4/3;
  options.padding = 5 * scale;

  return options;
};

export const setDisableColors = (options, darkTextColor, lightTextColor) => {
  options.themes = {
    dark: {
      C:  darkTextColor,
      O:  darkTextColor,
      N:  darkTextColor,
      F:  darkTextColor,
      CL: darkTextColor,
      BR: darkTextColor,
      I:  darkTextColor,
      P:  darkTextColor,
      S:  darkTextColor,
      B:  darkTextColor,
      SI: darkTextColor,
      H:  darkTextColor,
      BACKGROUND: '#141414'
    },
    light: {
      C:  lightTextColor,
      O:  lightTextColor,
      N:  lightTextColor,
      F:  lightTextColor,
      CL: lightTextColor,
      BR: lightTextColor,
      I:  lightTextColor,
      P:  lightTextColor,
      S:  lightTextColor,
      B:  lightTextColor,
      SI: lightTextColor,
      H:  lightTextColor,
      BACKGROUND:  '#fff'
    }
  };
  return options;
};

export const setThemesByDefault = (options, darkTextColor, lightTextColor) => {
  options.themes = {
    dark: {
      C: darkTextColor,
      O: '#e74c3c',
      N: '#3498db',
      F: '#27ae60',
      CL: '#16a085',
      BR: '#d35400',
      I: '#8e44ad',
      P: '#d35400',
      S: '#f1c40f',
      B: '#e67e22',
      SI: '#e67e22',
      H: darkTextColor,
      BACKGROUND: '#141414'
    },
    light: {
      C: lightTextColor,
      O: '#e74c3c',
      N: '#3498db',
      F: '#27ae60',
      CL: '#16a085',
      BR: '#d35400',
      I: '#8e44ad',
      P: '#d35400',
      S: '#f1c40f',
      B: '#e67e22',
      SI: '#e67e22',
      H: lightTextColor,
      BACKGROUND: '#fff'
    }
  };
  return options;
};


export const getScale = (fontSize: number) => {
  if (!fontSize) {
    fontSize = 14;
  }
  const pt = Number(fontSize) * 3/4;
  const scale = pt/5;
  return scale;
};

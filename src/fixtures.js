const config = {
  fontSize: {
    label: 'Font Size',
    value: 20,
    step: 5,
    min: 5,
    max: 1000,
    type: 'number',
  },
  bTreshold: {
    label: 'Black Treshold',
    value: 20,
    step: 10,
    min: 0,
    max: 200,
    type: 'number',
  },
  xMargin: {
    label: 'X-Margin',
    value: 5,
    step: 5,
    min: 0,
    max: 100,
    type: 'number',
  },
  yMargin: {
    label: 'Y-Margin',
    value: 5,
    step: 5,
    min: 0,
    max: 100,
    type: 'number',
  },
  wTreshold: {
    label: 'White Treshold',
    value: 0,
    step: 5,
    min: 0,
    max: 255,
    type: 'number',
  },
  resolution: {
    label: 'Resolution',
    value: window.innerWidth < 800 ? 1200 : 2000,
    step: 250,
    min: 500,
    max: 3500,
    type: 'number',
  },
  contrast: {
    label: 'Contrast',
    value: 1,
    step: 0.5,
    min: 1,
    max: 5,
    type: 'number',
  },
  sepia: {
    label: 'Sepia',
    value: 0,
    step: 0.1,
    min: 0,
    max: 5,
    type: 'number',
  },
  text: {
    value: 'wash your hands',
    type: 'textarea',
  },
}

export { config }

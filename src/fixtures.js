const config = {
  fontSize: {
    label: 'Font Size',
    value: 20,
    step: 5,
    min: 5,
    max: 1000,
  },
  bTreshold: {
    label: 'Black Treshold',
    value: 20,
    step: 10,
    min: 0,
    max: 200,
  },
  xMargin: {
    label: 'X-Margin',
    value: 10,
    step: 5,
    min: 0,
    max: 100,
  },
  yMargin: {
    label: 'Y-Margin',
    value: 5,
    step: 5,
    min: 0,
    max: 100,
  },
  wTreshold: {
    label: 'White Treshold',
    value: 0,
    step: 5,
    min: 0,
    max: 255,
  },
  resolution: {
    label: 'Resolution',
    value: 2000,
    step: 250,
    min: 500,
    max: 3500,
  },
  contrast: {
    label: 'Contrast',
    value: 1,
    step: 0.5,
    min: 1,
    max: 5,
  },
  sepia: {
    label: 'Sepia',
    value: 0,
    step: 0.1,
    min: 0,
    max: 5,
  },
  text: {
    value: 'Wash your hands',
    type: 'textarea',
  },
}

export { config }

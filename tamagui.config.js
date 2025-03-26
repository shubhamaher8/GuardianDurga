import { createTamagui } from 'tamagui'
import { tokens, themes } from '@tamagui/themes'

export default createTamagui({
  themes,
  tokens,
  fonts: {
    body: {
      family: 'System',
      size: 16,
      lineHeight: 24,
      weight: '400',
    },
    heading: {
      family: 'System',
      size: 24,
      lineHeight: 32,
      weight: '700',
    },
  },
})
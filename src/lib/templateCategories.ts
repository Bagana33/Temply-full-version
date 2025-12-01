export const TEMPLATE_CATEGORIES = [
  'Нийгмийн сүлжээ',
  'Бизнес',
  'Боловсрол',
  'Маркетинг',
  'Эрүүл мэнд',
  'Хоол хүнс',
  'Аялал жуулчлал',
  'Технологи',
] as const

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number]

export const TEMPLATE_QUICK_FILTERS: { value: 'all' | TemplateCategory; label: string }[] = [
  { value: 'all', label: 'Бүх загвар' },
  { value: 'Нийгмийн сүлжээ', label: 'Сошиал' },
  { value: 'Бизнес', label: 'Бизнес' },
  { value: 'Боловсрол', label: 'Боловсрол' },
  { value: 'Маркетинг', label: 'Маркетинг' },
]



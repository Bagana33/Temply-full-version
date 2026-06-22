'use client'

import Link from 'next/link'
import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  Check,
  CircleDollarSign,
  Download,
  GraduationCap,
  Instagram,
  Layers3,
  MousePointerClick,
  Palette,
  Presentation,
  Search,
  Sparkles,
  TrendingUp,
  UtensilsCrossed,
  WandSparkles,
  Zap,
} from 'lucide-react'

const categories = [
  {
    name: 'Social media',
    description: 'Post, story, carousel',
    icon: Instagram,
    href: '/templates?category=Нийгмийн%20сүлжээ',
    gradient: 'linear-gradient(135deg, #6C5CE7 0%, #9B8CFF 100%)',
  },
  {
    name: 'Presentation',
    description: 'Pitch deck, тайлан, хичээл',
    icon: Presentation,
    href: '/templates?category=Боловсрол',
    gradient: 'linear-gradient(135deg, #00B8B3 0%, #00CEC9 100%)',
  },
  {
    name: 'Business',
    description: 'Proposal, menu, price list',
    icon: BriefcaseBusiness,
    href: '/templates?category=Бизнес',
    gradient: 'linear-gradient(135deg, #2D3436 0%, #596164 100%)',
  },
  {
    name: 'Education',
    description: 'Worksheet, certificate, slide',
    icon: GraduationCap,
    href: '/templates?category=Боловсрол',
    gradient: 'linear-gradient(135deg, #FF8A5B 0%, #FFB36B 100%)',
  },
  {
    name: 'Branding',
    description: 'Logo kit, brand guide, media kit',
    icon: Palette,
    href: '/templates?category=Маркетинг',
    gradient: 'linear-gradient(135deg, #E752A5 0%, #FF82BE 100%)',
  },
  {
    name: 'Food & menu',
    description: 'Menu, promo, delivery post',
    icon: UtensilsCrossed,
    href: '/templates?category=Хоол%20хүнс',
    gradient: 'linear-gradient(135deg, #5167F6 0%, #79A2FF 100%)',
  },
]

const steps = [
  {
    number: '01',
    title: 'Загвараа ол',
    description: 'Хэрэгцээ, салбар эсвэл форматаар хайж өөрт тохирох дизайнаа сонго.',
    icon: Search,
  },
  {
    number: '02',
    title: 'Canva дээр засварла',
    description: 'Текст, зураг, өнгөө солиод бренддээ тааруул. Дизайны програм сурах шаардлагагүй.',
    icon: WandSparkles,
  },
  {
    number: '03',
    title: 'Шууд ашигла',
    description: 'Файлаа татаж аваад social, print эсвэл presentation-д бэлэн ашигла.',
    icon: Download,
  },
]

const creatorBenefits = [
  'Борлуулалт бүрээс 70% хүртэл орлого',
  'Хязгааргүй template байршуулах боломж',
  'Монгол хэрэглэгчдэд шууд хүрэх суваг',
]

export default function Home() {
  const router = useRouter()
  const [query, setQuery] = useState('')

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const trimmedQuery = query.trim()
    router.push(trimmedQuery ? `/templates?search=${encodeURIComponent(trimmedQuery)}` : '/templates')
  }

  return (
    <div className="overflow-hidden bg-white text-[#2D3436]">
      <section className="relative isolate bg-[#0F1020] px-4 pb-20 pt-16 text-white sm:px-6 sm:pb-24 sm:pt-20 lg:px-8 lg:pb-28 lg:pt-24">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-80"
          style={{
            background:
              'radial-gradient(circle at 15% 20%, rgba(108,92,231,.32), transparent 30%), radial-gradient(circle at 88% 18%, rgba(0,206,201,.18), transparent 28%), radial-gradient(circle at 70% 85%, rgba(108,92,231,.16), transparent 30%)',
          }}
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.035)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:linear-gradient(to_bottom,black,transparent_88%)]" />

        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.06] px-4 py-2 text-sm text-white/80 backdrop-blur">
              <Sparkles className="h-4 w-4 text-[#00CEC9]" />
              Монголын Canva Template Marketplace
            </div>

            <h1 className="max-w-3xl text-5xl font-extrabold leading-[0.98] tracking-[-0.045em] sm:text-6xl lg:text-7xl">
              Бэлэн загвараас эхэл.
              <span className="mt-2 block bg-gradient-to-r from-[#A99FFF] via-white to-[#64E6E2] bg-clip-text text-transparent">
                Өөрийнхөөрөө бүтээ.
              </span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-white/65 sm:text-xl">
              Social post, presentation, branding, education-д зориулсан чанартай Canva загваруудыг сонгоод хэдхэн минутын дотор өөрийн дизайн болго.
            </p>

            <form onSubmit={handleSearch} className="mt-9 flex max-w-2xl flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.07] p-2.5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:flex-row">
              <div className="flex min-h-12 flex-1 items-center gap-3 px-3">
                <Search className="h-5 w-5 shrink-0 text-white/40" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Жишээ: Instagram post, menu, pitch deck..."
                  className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/35 sm:text-base"
                  aria-label="Загвар хайх"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#6C5CE7] px-6 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7B6CF0] hover:shadow-lg hover:shadow-[#6C5CE7]/30"
              >
                Загвар хайх
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/55">
              {['Canva-д шууд нээгдэнэ', 'Хэрэглэхэд амархан', 'Монгол дизайнеруудын бүтээл'].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-[#00CEC9]" />
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:mx-0">
            <div className="absolute -left-6 top-16 h-40 w-40 rounded-full bg-[#6C5CE7]/30 blur-3xl" />
            <div className="absolute -right-8 bottom-10 h-44 w-44 rounded-full bg-[#00CEC9]/20 blur-3xl" />

            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.07] p-3 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-4">
              <div className="overflow-hidden rounded-[22px] border border-white/10 bg-[#F7F7FA] text-[#2D3436]">
                <div className="flex items-center gap-2 border-b border-black/5 bg-white px-4 py-3">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FFD166]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#00CEC9]" />
                  <div className="ml-3 h-7 flex-1 rounded-full bg-[#F1F1F5]" />
                </div>

                <div className="grid min-h-[430px] grid-cols-[78px_1fr] sm:grid-cols-[120px_1fr]">
                  <div className="border-r border-black/5 bg-white p-3 sm:p-4">
                    <div className="mb-6 flex h-9 w-9 items-center justify-center rounded-xl bg-[#6C5CE7] text-sm font-bold text-white">T</div>
                    <div className="space-y-3">
                      {[72, 54, 64, 48].map((width, index) => (
                        <div key={index} className="h-2 rounded-full bg-[#E8E8EE]" style={{ width: `${width}%` }} />
                      ))}
                    </div>
                  </div>

                  <div className="p-4 sm:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                      <div>
                        <div className="h-3 w-32 rounded-full bg-[#2D3436] sm:w-44" />
                        <div className="mt-2 h-2 w-24 rounded-full bg-[#D8D8E1]" />
                      </div>
                      <div className="h-9 w-24 rounded-xl bg-[#6C5CE7]" />
                    </div>

                    <div className="grid grid-cols-2 gap-3 sm:gap-4">
                      <div className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#171827] p-4 text-white">
                        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-[#6C5CE7] blur-xl" />
                        <div className="relative text-[9px] uppercase tracking-[0.24em] text-white/50">Brand studio</div>
                        <div className="relative mt-4 text-xl font-extrabold leading-none sm:text-2xl">MAKE IT<br />MEMORABLE</div>
                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <div className="h-1.5 w-12 rounded-full bg-[#00CEC9]" />
                          <Sparkles className="h-5 w-5 text-[#A99FFF]" />
                        </div>
                      </div>

                      <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-[#F8DD5B] p-4 text-[#202124]">
                        <div className="text-[9px] font-semibold uppercase tracking-[0.2em]">Weekend menu</div>
                        <div className="mt-4 text-2xl font-black leading-[0.9] sm:text-3xl">GOOD<br />FOOD.</div>
                        <div className="absolute bottom-4 right-4 h-20 w-20 rounded-full border-[12px] border-[#FF7A59] bg-white/40" />
                      </div>

                      <div className="relative col-span-2 overflow-hidden rounded-2xl bg-gradient-to-r from-[#6C5CE7] to-[#8B7CF4] p-4 text-white sm:p-5">
                        <div className="grid grid-cols-[1fr_auto] items-center gap-4">
                          <div>
                            <div className="text-[9px] uppercase tracking-[0.22em] text-white/60">Pitch deck</div>
                            <div className="mt-2 text-lg font-bold sm:text-xl">Your big idea deserves a clear story.</div>
                          </div>
                          <div className="grid h-16 w-16 place-items-center rounded-2xl bg-white/15 backdrop-blur">
                            <TrendingUp className="h-7 w-7" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -left-5 bottom-16 hidden items-center gap-3 rounded-2xl border border-white/10 bg-[#18192A]/90 px-4 py-3 text-white shadow-xl backdrop-blur sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#00CEC9]/15 text-[#00CEC9]">
                <MousePointerClick className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-white/45">Нэг click-ээр</div>
                <div className="text-sm font-semibold">Canva дээр нээ</div>
              </div>
            </div>

            <div className="absolute -right-4 top-12 hidden items-center gap-3 rounded-2xl border border-white/10 bg-white px-4 py-3 text-[#2D3436] shadow-xl sm:flex">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
                <BadgeCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-xs text-[#7A7D84]">Curated</div>
                <div className="text-sm font-semibold">Чанартай загварууд</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
            <div>
              <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#6C5CE7]">Explore</div>
              <h2 className="max-w-2xl text-4xl font-extrabold tracking-[-0.035em] text-[#202124] sm:text-5xl">Өнөөдөр юу бүтээх вэ?</h2>
              <p className="mt-4 max-w-2xl text-lg leading-8 text-[#74777D]">Түгээмэл хэрэглээнээс шууд эхэл. Хэрэгтэй format чинь бэлэн.</p>
            </div>
            <Link href="/templates" className="inline-flex items-center gap-2 font-semibold text-[#6C5CE7] transition hover:gap-3">
              Бүх загварыг үзэх
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <Link
                  key={category.name}
                  href={category.href}
                  className="group relative min-h-60 overflow-hidden rounded-[26px] border border-black/[0.06] bg-[#F7F7FA] p-6 transition duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#2D3436]/10"
                >
                  <div className="absolute -right-14 -top-14 h-40 w-40 rounded-full opacity-15 blur-2xl transition duration-300 group-hover:scale-125 group-hover:opacity-25" style={{ background: category.gradient }} />
                  <div className="relative flex h-full flex-col justify-between">
                    <div className="flex items-start justify-between">
                      <div className="grid h-12 w-12 place-items-center rounded-2xl text-white shadow-lg" style={{ background: category.gradient }}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-5 w-5 text-[#B4B6BC] transition group-hover:translate-x-1 group-hover:text-[#6C5CE7]" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold tracking-[-0.025em] text-[#202124]">{category.name}</h3>
                      <p className="mt-2 text-sm text-[#7B7E84]">{category.description}</p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F7F7FA] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#00AFAA]">Simple workflow</div>
            <h2 className="text-4xl font-extrabold tracking-[-0.035em] text-[#202124] sm:text-5xl">Дизайн хийхийг хялбар болгоно.</h2>
            <p className="mt-4 text-lg leading-8 text-[#74777D]">Blank canvas-аас эхлэхгүй. Сайн суурь сонгоод өөрийн контентоо оруул.</p>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((step) => {
              const Icon = step.icon
              return (
                <div key={step.number} className="relative rounded-[26px] border border-black/[0.06] bg-white p-7 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-sm font-bold tracking-[0.16em] text-[#C6C7CC]">{step.number}</span>
                  </div>
                  <h3 className="mt-8 text-2xl font-bold tracking-[-0.025em] text-[#202124]">{step.title}</h3>
                  <p className="mt-3 leading-7 text-[#74777D]">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="relative overflow-hidden rounded-[32px] bg-[#171827] px-6 py-10 text-white sm:px-10 sm:py-14 lg:px-14 lg:py-16">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{
                background:
                  'radial-gradient(circle at 10% 10%, rgba(108,92,231,.35), transparent 34%), radial-gradient(circle at 90% 90%, rgba(0,206,201,.2), transparent 32%)',
              }}
            />
            <div className="relative grid items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/[0.07] px-4 py-2 text-sm text-white/70">
                  <CircleDollarSign className="h-4 w-4 text-[#00CEC9]" />
                  Creator program
                </div>
                <h2 className="max-w-2xl text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl">Сайн дизайн зөвхөн файл биш. Орлогын эх үүсвэр.</h2>
                <p className="mt-5 max-w-xl text-lg leading-8 text-white/60">Өөрийн Canva template-ээ Temply дээр байршуулж, бүтээлээ Монголын хэрэглэгчдэд хүргэ.</p>

                <div className="mt-8 space-y-4">
                  {creatorBenefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 text-white/80">
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#00CEC9]/15 text-[#00CEC9]">
                        <Check className="h-4 w-4" />
                      </div>
                      {benefit}
                    </div>
                  ))}
                </div>

                <Link href="/creator" className="mt-9 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-6 font-semibold text-[#171827] transition hover:-translate-y-0.5 hover:bg-[#F3F2FF]">
                  Дизайнер болох
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="relative mx-auto w-full max-w-lg">
                <div className="rounded-[26px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur">
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <div>
                      <div className="text-sm text-white/45">Creator dashboard</div>
                      <div className="mt-1 font-semibold">Орлогын тойм</div>
                    </div>
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#00CEC9]/15 text-[#00CEC9]">
                      <TrendingUp className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <div className="text-xs text-white/40">Таны хувь</div>
                      <div className="mt-2 text-3xl font-bold">70%</div>
                    </div>
                    <div className="rounded-2xl bg-white/[0.06] p-4">
                      <div className="text-xs text-white/40">Upload</div>
                      <div className="mt-2 text-3xl font-bold">∞</div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-2xl bg-white/[0.06] p-4">
                    <div className="flex h-32 items-end gap-2">
                      {[36, 54, 46, 72, 60, 90, 78, 100].map((height, index) => (
                        <div key={index} className="flex-1 rounded-t-md bg-gradient-to-t from-[#6C5CE7] to-[#00CEC9]" style={{ height: `${height}%`, opacity: 0.45 + index * 0.06 }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-black/[0.06] bg-[#FBFBFD] px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_auto]">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[#6C5CE7]">
              <Zap className="h-4 w-4" />
              Membership
            </div>
            <h2 className="mt-4 max-w-3xl text-4xl font-extrabold tracking-[-0.035em] text-[#202124] sm:text-5xl">Илүү олон загвар. Илүү бага хугацаа.</h2>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-[#74777D]">Тогтмол контент хийдэг бол membership-ээр шинэ template, гишүүний үнэ болон тусгай контент ашигла.</p>
          </div>
          <Link href="/pricing" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#6C5CE7] px-7 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#7B6CF0] hover:shadow-xl hover:shadow-[#6C5CE7]/20">
            Үнийн багц үзэх
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <section className="px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-5xl text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#6C5CE7]/10 text-[#6C5CE7]">
            <Layers3 className="h-6 w-6" />
          </div>
          <h2 className="mt-7 text-4xl font-extrabold tracking-[-0.04em] text-[#202124] sm:text-6xl">Blank page-ээс бүү эхэл.</h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-[#74777D]">Сайн дизайны сууриа Temply-ээс сонгоод хамгийн чухал зүйлдээ — өөрийн санаандаа — төвлөр.</p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Link href="/templates" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl bg-[#2D3436] px-7 font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#171A1B]">
              Загваруудыг үзэх
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/creator" className="inline-flex min-h-13 items-center justify-center gap-2 rounded-xl border border-black/10 bg-white px-7 font-semibold text-[#2D3436] transition hover:-translate-y-0.5 hover:border-[#6C5CE7]/30 hover:text-[#6C5CE7]">
              <Palette className="h-4 w-4" />
              Бүтээлээ зарах
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

import Link from 'next/link'
import { ArrowUpRight, Sparkles } from 'lucide-react'

const footerGroups = [
  {
    title: 'Marketplace',
    links: [
      { label: 'Бүх загвар', href: '/templates' },
      { label: 'Үнийн багц', href: '/pricing' },
      { label: 'Дизайнер болох', href: '/creator' },
    ],
  },
  {
    title: 'Temply',
    links: [
      { label: 'Бидний тухай', href: '/about' },
      { label: 'Тусламж', href: '/help' },
      { label: 'Холбогдох', href: '/contact' },
    ],
  },
  {
    title: 'Эрх зүй',
    links: [
      { label: 'Нууцлал', href: '/privacy' },
      { label: 'Үйлчилгээний нөхцөл', href: '/terms' },
    ],
  },
]

export function Footer() {
  return (
    <footer className="bg-[#11121D] text-white">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-12 lg:grid-cols-[1.25fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative grid h-10 w-10 place-items-center overflow-hidden rounded-xl bg-[#6C5CE7] text-sm font-extrabold text-white">
                <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-[#00CEC9]" />
                <span className="relative">T</span>
              </div>
              <span className="text-2xl font-extrabold tracking-[-0.04em]">Temply</span>
            </Link>

            <h2 className="mt-7 max-w-xl text-3xl font-extrabold tracking-[-0.035em] text-white sm:text-4xl">
              Бэлэн загвараас эхэл. Өөрийнхөөрөө бүтээ.
            </h2>
            <p className="mt-4 max-w-xl leading-7 text-white/55">
              Монгол дизайнеруудын бүтээсэн Canva template-үүдийг хурдан сонгож, өөрийн бренд болон контентод тохируулан ашигла.
            </p>

            <Link
              href="/templates"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#171827] transition hover:-translate-y-0.5 hover:bg-[#F3F2FF]"
            >
              Загваруудыг үзэх
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-white">{group.title}</h3>
                <ul className="mt-4 space-y-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-sm text-white/50 transition hover:text-white">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-sm text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Temply. Бүх эрх хуулиар хамгаалагдсан.</p>
          <div className="inline-flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#00CEC9]" />
            Монгол дизайнер, бизнесүүдэд зориулсан marketplace
          </div>
        </div>
      </div>
    </footer>
  )
}

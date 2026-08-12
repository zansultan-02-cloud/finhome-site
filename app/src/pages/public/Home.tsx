import { Link } from 'react-router-dom'
import { PublicLayout } from './PublicLayout'

export function Home() {
  return (
    <PublicLayout
      title="FinHome — ипотечный калькулятор"
      description="FinHome — удобный ипотечный калькулятор для предварительного расчета суммы займа, ставки, срока и ежемесячного платежа."
    >
      <section className="mx-auto max-w-[860px] px-6 pb-14 pt-22 text-center">
        <span className="inline-block rounded-full bg-[#ffe9ee] px-3 py-2 text-sm font-bold text-[#b0002d]">
          Ипотечный калькулятор
        </span>
        <h1 className="mx-auto my-5 max-w-[860px] text-[42px] leading-[1.05] tracking-tight sm:text-[64px]">
          Планируйте ипотеку проще с FinHome
        </h1>
        <p className="mx-auto max-w-[760px] text-lg leading-[1.5] text-[#6b6b73] sm:text-xl">
          Рассчитывайте параметры ипотеки, меняйте ставку, срок и ежемесячный платеж и сравнивайте
          разные сценарии перед покупкой жилья.
        </p>
        <Link
          to="/support"
          className="mt-7 inline-block rounded-2xl bg-[#ff3b5c] px-6 py-4 font-bold text-white"
        >
          Связаться с поддержкой
        </Link>
      </section>

      <section className="mx-auto grid max-w-[1080px] grid-cols-1 gap-4 px-6 pb-18 sm:grid-cols-3">
        {[
          { title: 'Быстрый расчет', text: 'Оцените сумму займа и параметры ипотеки за несколько секунд.' },
          { title: 'Гибкие настройки', text: 'Меняйте срок, процентную ставку и ежемесячный платеж.' },
          { title: 'Понятный интерфейс', text: 'Минималистичный дизайн без лишней сложности.' },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-[22px] border border-[#e7e7ea] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]"
          >
            <h3 className="mb-2 text-xl font-semibold">{card.title}</h3>
            <p className="text-[#6b6b73]">{card.text}</p>
          </div>
        ))}
      </section>

      <section className="mx-auto max-w-[1080px] px-6 pb-14">
        <div className="rounded-[22px] border border-[#e7e7ea] bg-white p-8 leading-[1.7]">
          <h2 className="mb-4 text-[32px] tracking-tight">Важно</h2>
          <p>
            Расчеты в FinHome являются предварительными и не являются официальным предложением
            банка. Итоговые условия кредитования зависят от выбранной программы, банка и оценки
            платежеспособности клиента.
          </p>
        </div>
      </section>
    </PublicLayout>
  )
}

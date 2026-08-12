import { PublicLayout } from './PublicLayout'

export function Support() {
  return (
    <PublicLayout title="Поддержка — FinHome">
      <div className="mx-auto max-w-[1080px] px-6 py-14">
        <div className="rounded-[22px] border border-[#e7e7ea] bg-white p-8 leading-[1.7]">
          <h1 className="mb-4 mt-0 text-[40px] sm:text-[48px]">Поддержка FinHome</h1>
          <p>Спасибо за использование FinHome.</p>
          <p>
            Если у вас возникли вопросы, предложения или вы обнаружили ошибку в приложении,
            свяжитесь с нами.
          </p>

          <h2 className="mt-7 text-2xl">Контакты</h2>
          <p>
            <strong>Email:</strong>{' '}
            <a href="mailto:zansultan-02@mail.ru" className="text-[#111111]">
              zansultan-02@mail.ru
            </a>
          </p>

          <h2 className="mt-7 text-2xl">Время ответа</h2>
          <p>Понедельник–Пятница, 09:00–18:00 (GMT+5).</p>
          <p className="text-sm text-[#6b6b73]">Мы постараемся ответить в течение 1–2 рабочих дней.</p>
        </div>
      </div>
    </PublicLayout>
  )
}

import { PublicLayout } from './PublicLayout'

export function Privacy() {
  return (
    <PublicLayout title="Политика конфиденциальности — FinHome">
      <div className="mx-auto max-w-[1080px] px-6 py-14">
        <div className="rounded-[22px] border border-[#e7e7ea] bg-white p-8 leading-[1.7]">
          <h1 className="mb-4 mt-0 text-[40px] sm:text-[48px]">Политика конфиденциальности</h1>
          <p className="text-sm text-[#6b6b73]">Последнее обновление: 11 августа 2026 г.</p>

          <p>FinHome уважает конфиденциальность пользователей.</p>

          <h2 className="mt-7 text-2xl">Какие данные мы собираем</h2>
          <p>В текущей версии приложения FinHome не собирает персональные данные пользователей.</p>

          <h2 className="mt-7 text-2xl">Использование данных</h2>
          <p>Приложение используется для предварительных ипотечных расчетов.</p>

          <h2 className="mt-7 text-2xl">Передача данных третьим лицам</h2>
          <p>FinHome не продает и не передает персональные данные третьим лицам.</p>

          <h2 className="mt-7 text-2xl">Безопасность</h2>
          <p>Мы принимаем разумные меры для защиты информации пользователей.</p>

          <h2 className="mt-7 text-2xl">Изменения политики</h2>
          <p>
            Мы можем обновлять настоящую Политику конфиденциальности. Новая версия будет
            опубликована на этой странице.
          </p>

          <h2 className="mt-7 text-2xl">Контакты</h2>
          <p>
            По вопросам конфиденциальности:{' '}
            <a href="mailto:zansultan-02@mail.ru" className="text-[#111111]">
              zansultan-02@mail.ru
            </a>
          </p>
        </div>
      </div>
    </PublicLayout>
  )
}

import { PrismaClient } from '@prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import 'dotenv/config';

const adapter = new PrismaLibSql({
    url: process.env.DATABASE_URL || 'file:./prisma/dev.db',
    authToken: process.env.DATABASE_AUTH_TOKEN,
})
const prisma = new PrismaClient({ adapter })

async function main() {
    const projects = await prisma.project.findMany({ select: { id: true, slug: true, title: true } });
    console.log(projects);

    // Update Faithly ROI
    await prisma.project.updateMany({
        where: { slug: 'faithly' },
        data: { clientBenefit: "📈 Удержание пользователей (Retention Day 30) выросло на 40%\n⚙️ Снижение нагрузки на администраторов церкви за счет автоматизации на 60%\n💰 Рост регулярных пожертвований внутри приложения на 25% в первые 3 месяца" }
    });

    // Update NorCal Deals ROI
    await prisma.project.updateMany({
        where: { slug: 'norcal-deal-engine' },
        data: { clientBenefit: "🚀 Ускорение поиска ликвидных объектов на рынке в 15 раз\n💼 Экономия более 40 часов ручного анализа сделок еженедельно\n💵 Увеличение ROI инвестиционного портфеля за счет точной предиктивной аналитики ИИ" }
    });
}
main().catch(console.error).finally(() => prisma.$disconnect());

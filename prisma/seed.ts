import { PrismaClient, AdminRole, AdminTitle, KaryaCategory, ContentType, MoodCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding for GrowthWithSero...");

  // 1. Create Superadmin
  const hashedPasswordSuper = await bcrypt.hash("superadmin123", 10);
  const superadmin = await prisma.admin.upsert({
    where: { username: "superadmin" },
    update: {},
    create: {
      username: "superadmin",
      password: hashedPasswordSuper,
      role: AdminRole.SUPERADMIN,
      title: AdminTitle.MIND_CAPTAIN,
      name: "Super Admin Sero",
      bio: "Pengelola utama sistem dan komunitas GrowthWithSero.",
      photoUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400&auto=format&fit=crop&q=80",
    },
  });

  // 2. Create Mind Captain, Co-Captain, and BA
  const hashedPassBA = await bcrypt.hash("password123", 10);

  const captain = await prisma.admin.upsert({
    where: { username: "mindcaptain" },
    update: {},
    create: {
      username: "mindcaptain",
      password: hashedPassBA,
      role: AdminRole.ADMIN,
      title: AdminTitle.MIND_CAPTAIN,
      name: "Rizky Mind Captain",
      bio: "Mind Captain Serotonin. Percaya bahwa setiap perasaan berhak didengar dan dirangkul.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
    },
  });

  const cocaptain = await prisma.admin.upsert({
    where: { username: "cocaptain" },
    update: {},
    create: {
      username: "cocaptain",
      password: hashedPassBA,
      role: AdminRole.ADMIN,
      title: AdminTitle.CO_CAPTAIN,
      name: "Nadia Co-Captain",
      bio: "Co-Captain pendengar setia. Menemani langkah kecilmu menuju ketenangan.",
      photoUrl: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
    },
  });

  const baSarah = await prisma.admin.upsert({
    where: { username: "ba_sarah" },
    update: {},
    create: {
      username: "ba_sarah",
      password: hashedPassBA,
      role: AdminRole.ADMIN,
      title: AdminTitle.BA,
      name: "Sarah Brand Ambassador",
      bio: "BA Serotonin. Suka bikin konten tentang self-love, healing journal, dan mindfulness.",
      photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80",
    },
  });

  // 3. Create Sample Karya BA
  const karyaData = [
    {
      title: "Belajar Menerima Emosi Tanpa Menghakimi Diri Sendiri",
      description: "Seringkali kita merasa bersalah saat sedih atau cemas. Padahal, emosi itu tamu yang ingin menyampaikan pesan. Yuk baca selengkapnya!",
      category: KaryaCategory.SELF_AWARENESS,
      linkPost: "https://www.instagram.com/p/C_growthwithsero1/",
      ownerId: captain.id,
    },
    {
      title: "5 Tanda Burnout Mental yang Sering Kamu Anggap Malas",
      description: "Capek terus walau udah tidur 8 jam? Bisa jadi itu bukan malas fisik, tapi kelelahan emosional. Simak panduannya di slide ini.",
      category: KaryaCategory.MENTAL_HEALTH,
      linkPost: "https://www.instagram.com/p/C_growthwithsero2/",
      ownerId: cocaptain.id,
    },
    {
      title: "Transformasi Pola Pikir: Dari 'Gagal' Jadi 'Belajar'",
      description: "Mengubah cara kita berbicara pada diri sendiri saat hal tidak berjalan sesuai rencana. Be kind to your mind! ✨",
      category: KaryaCategory.GROWTH,
      linkPost: "https://www.instagram.com/p/C_growthwithsero3/",
      ownerId: baSarah.id,
    },
    {
      title: "Membangun Deep Talk Sehat Tanpa Trauma Dumping",
      description: "Gimana caranya curhat tanpa bikin orang lain overwhelmed? Ini tips membuat safe space komunikasi dua arah.",
      category: KaryaCategory.CONNECTION,
      linkPost: "https://www.instagram.com/p/C_growthwithsero4/",
      ownerId: captain.id,
    },
    {
      title: "Serotonin Space: Komunitas Aman untuk Saling Mendukung",
      description: "Cerita tentang bagaimana komunitas kecil kita bertumbuh menjadi tempat pulang bagi mereka yang butuh rangkulan hangat.",
      category: KaryaCategory.COMMUNITY,
      linkPost: "https://www.instagram.com/p/C_growthwithsero5/",
      ownerId: cocaptain.id,
    },
    {
      title: "Menemukan Hening di Tengah Ramainya Notifikasi",
      description: "Digital detox sederhana selama 30 menit sehari untuk menyeimbangkan ritme dopamin dan kesehatan mentalmu.",
      category: KaryaCategory.OTHER,
      linkPost: "https://www.instagram.com/p/C_growthwithsero6/",
      ownerId: baSarah.id,
    },
  ];

  for (const k of karyaData) {
    const existing = await prisma.karya.findFirst({ where: { title: k.title } });
    if (!existing) {
      await prisma.karya.create({ data: k });
    }
  }

  // 4. Create Content Bank (Kalimat Penenang & Guided Prompts)
  const calmingSentences = [
    {
      tag: MoodCategory.SENANG,
      content: "Nikmati setiap detik kebahagiaan ini, rayakan pencapaian kecilmu hari ini! Kamu sangat layak berbahagia. ✨",
    },
    {
      tag: MoodCategory.SEDIH,
      content: "Gak apa-apa untuk gak baik-baik saja hari ini. Izinkan hatimu beristirahat, esok adalah lembaran baru. 💙",
    },
    {
      tag: MoodCategory.CEMAS,
      content: "Kekhawatiran hari ini belum tentu terjadi esok hari. Tarik nafas perlahan, saat ini kamu aman. 🌿",
    },
    {
      tag: MoodCategory.MARAH,
      content: "Rasa marahmu valid, tapi jangan biarkan ia merusak kedamaianmu. Hembuskan amarah itu perlahan bagai angin lalu. 🌊",
    },
    {
      tag: MoodCategory.LELAH,
      content: "Tubuh dan jiwamu sudah berjuang sangat hebat hari ini. Istirahatlah sejenak, kamu gak harus menyelesaikan segalanya sekarang. 🌙",
    },
    {
      tag: MoodCategory.TENANG,
      content: "Simpan rasa damai ini di lubuk hatimu. Biarkan ketenangan ini menjadi jangkar pelindungmu setiap hari. ☁️",
    },
    {
      tag: MoodCategory.BINGUNG,
      content: "Semuanya terasa overload ya? Gak perlu buru-buru mencari semua jawaban. Fokus saja pada satu langkah terkecil berikutnya. 🧩",
    },
  ];

  for (const item of calmingSentences) {
    const existing = await prisma.contentBank.findFirst({ where: { content: item.content } });
    if (!existing) {
      await prisma.contentBank.create({
        data: {
          type: ContentType.CALMING_SENTENCE,
          tag: item.tag,
          content: item.content,
          createdById: superadmin.id,
        },
      });
    }
  }

  const guidedPrompts = [
    {
      tag: MoodCategory.SENANG,
      content: "Apa satu hal kecil hari ini yang membuatmu tersenyum dan ingin kamu syukuri?",
    },
    {
      tag: MoodCategory.SEDIH,
      content: "Tuliskan apa yang membuat hatimu berat hari ini tanpa sensor, lalu katakan 'aku merangkul diriku'.",
    },
    {
      tag: MoodCategory.CEMAS,
      content: "Apa hal terburuk yang kamu takutkan, dan apa bukti nyata bahwa saat ini kamu sebenarnya masih baik-baik saja?",
    },
    {
      tag: MoodCategory.LELAH,
      content: "Jika tubuhmu bisa bicara sekarang, pesan apa yang ingin dia sampaikan padamu?",
    },
  ];

  for (const prompt of guidedPrompts) {
    const existing = await prisma.contentBank.findFirst({ where: { content: prompt.content } });
    if (!existing) {
      await prisma.contentBank.create({
        data: {
          type: ContentType.GUIDED_PROMPT,
          tag: prompt.tag,
          content: prompt.content,
          createdById: captain.id,
        },
      });
    }
  }

  // 5. Create Counselors (AwareMind)
  const counselors = [
    {
      name: "Dr. Amanda Permata, M.Psi, Psikolog Klinis",
      photoUrl: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Bima Prasetya, S.Psi, Konselor Mindfulness",
      photoUrl: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&auto=format&fit=crop&q=80",
    },
    {
      name: "Citra Anindya, M.Psi, Konselor Remaja & Dewasa Awal",
      photoUrl: "https://images.unsplash.com/photo-1594824813590-4c7b80a651a2?w=400&auto=format&fit=crop&q=80",
    },
  ];

  for (const c of counselors) {
    const existing = await prisma.counselor.findFirst({ where: { name: c.name } });
    if (!existing) {
      await prisma.counselor.create({ data: c });
    }
  }

  // 6. Create Events (Upcoming & Past)
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 7);

  const lastMonth = new Date();
  lastMonth.setDate(lastMonth.getDate() - 30);

  const events = [
    {
      title: "Webinar Serotonin: Seni Mengelola Overthinking & Ekspektasi",
      description: "Sesi interaktif bersama tim psikolog dan sharing santai bersama Mind Captain tentang strategi grounding saat pikiran terasa berisik.",
      eventDate: nextWeek,
      formLink: "https://forms.gle/growthwithserowebinar1",
    },
    {
      title: "Mindful Journaling & Art Therapy Class",
      description: "Belajar menuangkan perasaan melalui teknik journaling ekspresif dan coretan warna yang menenangkan jiwa.",
      eventDate: lastMonth,
      formLink: "https://forms.gle/growthwithserowebinar2",
    },
  ];

  for (const e of events) {
    const existing = await prisma.event.findFirst({ where: { title: e.title } });
    if (!existing) {
      await prisma.event.create({ data: e });
    }
  }

  console.log("✅ Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

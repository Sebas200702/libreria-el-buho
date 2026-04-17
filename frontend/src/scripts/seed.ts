/**
 * Seed Buho Books library with 14 fictitious titles and ensure an admin user exists.
 * Usage (from /app/frontend):
 *   yarn seed
 */
import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL;
const service = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !service) {
  console.error('Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
  process.exit(1);
}

const supabase = createClient(url, service, {
  auth: { persistSession: false, autoRefreshToken: false },
});

const BOOKS = [
  {
    slug: 'el-ritmo-de-las-cosas-rotas',
    title: 'El ritmo de las cosas rotas',
    author: 'Lucía Menéndez',
    description:
      'Una novela polifónica ambientada en el Mediterráneo contemporáneo donde cuatro desconocidos descubren que comparten el mismo diario perdido. Menéndez teje un retrato sobre la memoria y los objetos que sobreviven a los afectos.',
    genre: 'Ficción',
    category: 'Novela',
    price: 19.9,
    release_year: 2025,
    stock: 24,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'manual-de-tipografia-modesta',
    title: 'Manual de tipografía modesta',
    author: 'Héctor Arce',
    description:
      'Un ensayo visual sobre las tipografías que sostienen el día a día: señalización urbana, prospectos médicos, tickets de compra. Arce defiende la dignidad de lo funcional frente al gesto del diseño espectacular.',
    genre: 'Ensayo',
    category: 'Diseño',
    price: 24.5,
    release_year: 2024,
    stock: 18,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1531346878377-a5be20888e57?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'arquitectura-del-silencio',
    title: 'Arquitectura del silencio',
    author: 'Adelina Torres',
    description:
      'Diez conversaciones con arquitectas que han elegido proyectar espacios de recogimiento: capillas, hospicios, bibliotecas de barrio, refugios de montaña. Un libro para mirar los edificios con nuevos oídos.',
    genre: 'Ensayo',
    category: 'Arquitectura',
    price: 28.0,
    release_year: 2024,
    stock: 12,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'cartas-desde-el-hemisferio-sur',
    title: 'Cartas desde el hemisferio sur',
    author: 'Mariana Kohl',
    description:
      'Correspondencia cruzada entre dos escritoras en Buenos Aires y Ciudad del Cabo durante los años de pandemia. Literatura epistolar, ensayo político y diario íntimo se entrelazan.',
    genre: 'Ensayo',
    category: 'Memorias',
    price: 17.5,
    release_year: 2023,
    stock: 9,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'poemas-del-apagon',
    title: 'Poemas del apagón',
    author: 'Ilán Quispe',
    description:
      'Poemario escrito íntegramente durante los cortes de luz de 2024 en Lima. Versos breves, escritos a lápiz, que celebran la posibilidad de lo mínimo.',
    genre: 'Poesía',
    category: 'Poesía contemporánea',
    price: 14.0,
    release_year: 2025,
    stock: 30,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'algoritmos-para-ninos-curiosos',
    title: 'Algoritmos para niños curiosos',
    author: 'Gala Fontán',
    description:
      'Una introducción ilustrada al pensamiento computacional, sin ordenadores. Recetas, rituales, juegos de patio y rompecabezas que explican qué es un algoritmo sin código.',
    genre: 'Técnica',
    category: 'Infantil',
    price: 15.9,
    release_year: 2024,
    stock: 40,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1491841651911-c44c30c34548?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'refactorizar-la-vida',
    title: 'Refactorizar la vida',
    author: 'Santiago Vilar',
    description:
      'Un programador reflexiona sobre cómo los patrones del código limpio se aplican (y a veces rompen) cuando se intentan llevar a la ética cotidiana. Entre el ensayo filosófico y la crónica personal.',
    genre: 'Ensayo',
    category: 'Tecnología',
    price: 21.0,
    release_year: 2025,
    stock: 14,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'pequena-guia-de-hongos-urbanos',
    title: 'Pequeña guía de hongos urbanos',
    author: 'Rita Agüero',
    description:
      'Campo de estudio: las aceras, los parques descuidados, las juntas del asfalto. Agüero documenta decenas de especies fúngicas que sobreviven en las ciudades españolas.',
    genre: 'Técnica',
    category: 'Naturaleza',
    price: 22.0,
    release_year: 2023,
    stock: 8,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'como-perder-el-tiempo',
    title: 'Cómo perder el tiempo',
    author: 'Bruno Iparraguirre',
    description:
      'Contra la ideología de la productividad. Iparraguirre propone un plan de trabajo al revés: desobedecer la agenda para recuperar la atención y el aburrimiento creativo.',
    genre: 'Ensayo',
    category: 'Crítica cultural',
    price: 18.9,
    release_year: 2024,
    stock: 22,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1500930540546-25cd87bbb56f?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'la-biblioteca-del-faro',
    title: 'La biblioteca del faro',
    author: 'Dolors Canal',
    description:
      'Novela coral sobre una biblioteca instalada en un faro asturiano donde cada libro se presta por solo 72 horas. Un elogio de la lectura lenta frente al deseo de acumular.',
    genre: 'Ficción',
    category: 'Novela',
    price: 20.5,
    release_year: 2023,
    stock: 16,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'el-cuaderno-de-margarita',
    title: 'El cuaderno de Margarita',
    author: 'Enzo Bellagamba',
    description:
      'Biografía novelada de una matemática olvidada del siglo XX que resolvió, en soledad y sin publicar, uno de los problemas abiertos de la teoría de nudos.',
    genre: 'Ficción',
    category: 'Biografía',
    price: 19.0,
    release_year: 2024,
    stock: 11,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'infraestructuras-del-afecto',
    title: 'Infraestructuras del afecto',
    author: 'Paula Zelazny',
    description:
      'Ensayo sobre los cables, servidores, centros de datos y fibras ópticas que sostienen nuestras conversaciones cotidianas. Lo digital como geografía material.',
    genre: 'Ensayo',
    category: 'Tecnología',
    price: 23.9,
    release_year: 2025,
    stock: 6,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'canciones-para-regresar-a-casa',
    title: 'Canciones para regresar a casa',
    author: 'Yuna Park',
    description:
      'Poemas bilingües (castellano y coreano) sobre la diáspora, la nostalgia y las comidas que aprendemos a cocinar a distancia. Una voz emergente de la nueva lírica latinoamericana.',
    genre: 'Poesía',
    category: 'Poesía contemporánea',
    price: 13.5,
    release_year: 2025,
    stock: 28,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=800&q=80',
  },
  {
    slug: 'ensayo-sobre-la-luz-marzo',
    title: 'Ensayo sobre la luz de marzo',
    author: 'Teo Ferraioli',
    description:
      'Un diario meteorológico convertido en tratado poético. Ferraioli observa, durante 31 días consecutivos, la luz que entra en su estudio y escribe sobre ella con precisión botánica.',
    genre: 'Ensayo',
    category: 'Poesía',
    price: 16.9,
    release_year: 2022,
    stock: 4,
    published: true,
    cover_image_path:
      'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=800&q=80',
  },
];

async function seedBooks() {
  console.log('→ Seeding books…');
  for (const b of BOOKS) {
    const { error } = await supabase
      .from('books')
      .upsert(b, { onConflict: 'slug', ignoreDuplicates: false });
    if (error) {
      console.error(`✗ ${b.slug}:`, error.message);
    } else {
      console.log(`  ✓ ${b.slug}`);
    }
  }
}

async function ensureAdmin() {
  const email = 'admin@buhobooks.co';
  const password = 'BuhoBooks2026!';
  console.log('→ Ensuring admin user…');
  // Check if user exists
  const { data: existing } = await supabase.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  const found = existing?.users.find((u) => u.email === email);
  if (found) {
    console.log(`  ✓ admin exists: ${email}`);
    return { email, password: '(existing)' };
  }
  const { error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error) {
    console.error('✗ create admin failed:', error.message);
    return null;
  }
  console.log(`  ✓ admin created: ${email}`);
  return { email, password };
}

async function main() {
  await seedBooks();
  const creds = await ensureAdmin();
  console.log('\n✔ Seed complete.');
  if (creds) {
    console.log(`Admin login → ${creds.email} / ${creds.password}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

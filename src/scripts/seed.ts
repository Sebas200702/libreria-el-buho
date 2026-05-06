/**
 * Seed Librería del Búho with full catalog (~180 titles) and ensure admin user exists.
 * Pulls cover images from the public Google Books API (no key required).
 *
 * Usage (from /app/frontend):
 *   yarn seed
 */
import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const url = process.env.PUBLIC_SUPABASE_URL
const service = process.env.SUPABASE_SERVICE_ROLE_KEY
if (!url || !service) {
	console.error(
		'Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env',
	)
	process.exit(1)
}

const supabase = createClient(url, service, {
	auth: { persistSession: false, autoRefreshToken: false },
})

type Row = [
	title: string,
	author: string,
	price: number,
	genre: string,
	category?: string,
]

// [title, author, price_cop, genre, category?]
const BOOKS: Row[] = [
	['El principito', 'Antoine de Saint-Exupéry', 16000, 'Infantil', 'Fábula'],
	[
		'Cien años de soledad',
		'Gabriel García Márquez',
		16000,
		'Literatura colombiana',
		'Novela',
	],
	[
		'Harry Potter y la piedra filosofal',
		'J.K. Rowling',
		21000,
		'Fantasía',
		'Novela',
	],
	[
		'Harry Potter y el cáliz de fuego',
		'J.K. Rowling',
		23000,
		'Fantasía',
		'Novela',
	],
	[
		'Harry Potter y el prisionero de Azkabán',
		'J.K. Rowling',
		21000,
		'Fantasía',
		'Novela',
	],
	[
		'Crimen y castigo',
		'Fiódor Dostoievski',
		21000,
		'Literatura rusa',
		'Novela',
	],
	['El extranjero', 'Albert Camus', 18000, 'Ficción clásica', 'Novela'],
	['La metamorfosis', 'Franz Kafka', 18000, 'Ficción clásica', 'Novela'],
	['Romeo y Julieta', 'William Shakespeare', 18000, 'Teatro', 'Tragedia'],
	['Drácula', 'Bram Stoker', 21000, 'Ficción clásica', 'Novela gótica'],
	['Don Juan Tenorio', 'José Zorrilla', 15000, 'Teatro', 'Drama'],
	[
		'Rebelión en la granja',
		'George Orwell',
		18000,
		'Ficción clásica',
		'Novela',
	],
	[
		'Cómo ganar amigos e influir en los demás',
		'Dale Carnegie',
		18000,
		'Desarrollo personal',
	],
	[
		'El hombre más rico de Babilonia',
		'George S. Clason',
		18000,
		'Desarrollo personal',
	],
	['Dune', 'Frank Herbert', 23000, 'Fantasía', 'Ciencia ficción'],
	['Robinson Crusoe', 'Daniel Defoe', 21000, 'Ficción clásica', 'Aventura'],
	['Diario de Ana Frank', 'Ana Frank', 18000, 'Ensayo', 'Memorias'],
	['La Odisea', 'Homero', 21000, 'Ficción clásica', 'Épica'],
	['La Ilíada', 'Homero', 21000, 'Ficción clásica', 'Épica'],
	['El arte de la guerra', 'Sun Tzu', 23000, 'Filosofía', 'Estrategia'],
	['Demian', 'Hermann Hesse', 18000, 'Ficción clásica', 'Novela'],
	['El lobo estepario', 'Hermann Hesse', 18000, 'Ficción clásica', 'Novela'],
	['Moby Dick', 'Herman Melville', 23000, 'Ficción clásica', 'Novela'],
	['Las mil y una noches', 'Anónimo', 23000, 'Ficción clásica', 'Cuentos'],
	['Rayuela', 'Julio Cortázar', 21000, 'Literatura latinoamericana', 'Novela'],
	['La peste', 'Albert Camus', 18000, 'Ficción clásica', 'Novela'],
	[
		'Los hermanos Karamázov',
		'Fiódor Dostoievski',
		23000,
		'Literatura rusa',
		'Novela',
	],
	['El idiota', 'Fiódor Dostoievski', 21000, 'Literatura rusa', 'Novela'],
	[
		'Memorias del subsuelo',
		'Fiódor Dostoievski',
		21000,
		'Literatura rusa',
		'Novela',
	],
	['Fausto', 'Johann Wolfgang von Goethe', 21000, 'Teatro', 'Drama'],
	[
		'El llamado de la selva',
		'Jack London',
		18000,
		'Ficción clásica',
		'Aventura',
	],
	['Un mundo feliz', 'Aldous Huxley', 18000, 'Ficción clásica', 'Distopía'],
	[
		'Alicia en el país de las maravillas',
		'Lewis Carroll',
		16000,
		'Infantil',
		'Fantasía',
	],
	['El libro de la selva', 'Rudyard Kipling', 18000, 'Infantil', 'Aventura'],
	['Las aventuras de Tom Sawyer', 'Mark Twain', 18000, 'Infantil', 'Aventura'],
	[
		'La cabaña del tío Tom',
		'Harriet Beecher Stowe',
		21000,
		'Ficción clásica',
		'Novela',
	],
	['El maravilloso mago de Oz', 'L. Frank Baum', 18000, 'Infantil', 'Fantasía'],
	['Macbeth', 'William Shakespeare', 18000, 'Teatro', 'Tragedia'],
	['Otelo', 'William Shakespeare', 18000, 'Teatro', 'Tragedia'],
	['El profeta', 'Khalil Gibran', 15000, 'Poesía', 'Prosa poética'],
	['El loco y el vagabundo', 'Khalil Gibran', 15000, 'Poesía', 'Prosa poética'],
	['Así habló Zaratustra', 'Friedrich Nietzsche', 18000, 'Filosofía'],
	['El príncipe', 'Nicolás Maquiavelo', 18000, 'Filosofía', 'Política'],
	['La República', 'Platón', 21000, 'Filosofía'],
	['Hojas de hierba', 'Walt Whitman', 15000, 'Poesía'],
	['El cuervo y otros poemas', 'Edgar Allan Poe', 15000, 'Poesía'],
	['Meditaciones', 'Marco Aurelio', 18000, 'Filosofía'],
	['La riqueza de las naciones', 'Adam Smith', 23000, 'Ensayo', 'Economía'],
	['El capital', 'Karl Marx', 23000, 'Ensayo', 'Economía'],
	[
		'El contrato social',
		'Jean-Jacques Rousseau',
		18000,
		'Filosofía',
		'Política',
	],
	['Discurso del método', 'René Descartes', 15000, 'Filosofía'],
	['Utopía', 'Tomás Moro', 18000, 'Filosofía'],
	[
		'Los viajes de Gulliver',
		'Jonathan Swift',
		18000,
		'Ficción clásica',
		'Sátira',
	],
	[
		'La vuelta al mundo en 80 días',
		'Julio Verne',
		18000,
		'Ficción clásica',
		'Aventura',
	],
	[
		'De la Tierra a la Luna',
		'Julio Verne',
		17000,
		'Ficción clásica',
		'Ciencia ficción',
	],
	[
		'El capitán de quince años',
		'Julio Verne',
		17000,
		'Ficción clásica',
		'Aventura',
	],
	[
		'El faro del fin del mundo',
		'Julio Verne',
		17000,
		'Ficción clásica',
		'Aventura',
	],
	['La vida es sueño', 'Pedro Calderón de la Barca', 18000, 'Teatro', 'Drama'],
	['Popol Vuh', 'Anónimo', 21000, 'Literatura latinoamericana', 'Mito'],
	['Rimas y leyendas', 'Gustavo Adolfo Bécquer', 15000, 'Poesía'],
	['El arte de amar', 'Ovidio', 15000, 'Poesía'],
	[
		'Cartas al padre',
		'Franz Kafka',
		15000,
		'Ficción clásica',
		'Correspondencia',
	],
	['El castillo', 'Franz Kafka', 15000, 'Ficción clásica', 'Novela'],
	['Fenomenología del espíritu', 'G.W.F. Hegel', 23000, 'Filosofía'],
	['Meditaciones metafísicas', 'René Descartes', 15000, 'Filosofía'],
	['La conquista de la felicidad', 'Bertrand Russell', 15000, 'Filosofía'],
	[
		'El malestar en la cultura',
		'Sigmund Freud',
		18000,
		'Filosofía',
		'Psicoanálisis',
	],
	['La Eneida', 'Virgilio', 21000, 'Ficción clásica', 'Épica'],
	['El Ramayana', 'Valmiki', 23000, 'Ficción clásica', 'Épica'],
	['Decamerón', 'Giovanni Boccaccio', 23000, 'Ficción clásica', 'Cuentos'],
	['Voces de Chernóbil', 'Svetlana Aleksiévich', 18000, 'Ensayo', 'Crónica'],
	['El valor de educar', 'Fernando Savater', 18000, 'Ensayo'],
	['La rebelión de las masas', 'José Ortega y Gasset', 21000, 'Filosofía'],
	[
		'Del sentimiento trágico de la vida',
		'Miguel de Unamuno',
		15000,
		'Filosofía',
	],
	['Niebla', 'Miguel de Unamuno', 15000, 'Ficción clásica', 'Novela'],
	[
		'Ajuste de cuentas',
		'John Grisham',
		17000,
		'Ficción contemporánea',
		'Thriller',
	],
	[
		'Legítima defensa',
		'John Grisham',
		17000,
		'Ficción contemporánea',
		'Thriller',
	],
	['Causa justa', 'John Grisham', 17000, 'Ficción contemporánea', 'Thriller'],
	[
		'El símbolo perdido',
		'Dan Brown',
		18000,
		'Ficción contemporánea',
		'Thriller',
	],
	['El origen del hombre', 'Charles Darwin', 23000, 'Ensayo', 'Ciencia'],
	['Humano, demasiado humano', 'Friedrich Nietzsche', 18000, 'Filosofía'],
	['Crepúsculo de los ídolos', 'Friedrich Nietzsche', 18000, 'Filosofía'],
	[
		'Novelas ejemplares',
		'Miguel de Cervantes',
		18000,
		'Ficción clásica',
		'Cuentos',
	],
	[
		'Los cuadernos de don Rigoberto',
		'Mario Vargas Llosa',
		23000,
		'Literatura latinoamericana',
		'Novela',
	],
	[
		'El honor perdido de Katharina Blum',
		'Heinrich Böll',
		18000,
		'Ficción clásica',
		'Novela',
	],
	[
		'El enigmático Mr. Quin',
		'Agatha Christie',
		17000,
		'Ficción contemporánea',
		'Misterio',
	],
	['Casa de muñecas', 'Henrik Ibsen', 18000, 'Teatro'],
	['Los árboles mueren de pie', 'Alejandro Casona', 17000, 'Teatro'],
	['Ética a Nicómaco', 'Aristóteles', 18000, 'Filosofía'],
	['La Política', 'Aristóteles', 18000, 'Filosofía', 'Política'],
	['Sobre los deberes', 'Marco Tulio Cicerón', 15000, 'Filosofía'],
	['Ensayo sobre el entendimiento humano', 'John Locke', 21000, 'Filosofía'],
	['Teoría pura del derecho', 'Hans Kelsen', 18000, 'Ensayo', 'Derecho'],
	[
		'Qué es una Constitución',
		'Ferdinand Lassalle',
		15000,
		'Ensayo',
		'Política',
	],
	[
		'Los bienes terrenales del hombre',
		'Leo Huberman',
		17000,
		'Ensayo',
		'Economía',
	],
	['Elogio de la estupidez', 'Erasmo de Róterdam', 15000, 'Filosofía'],
	['Diccionario filosófico', 'Voltaire', 15000, 'Filosofía'],
	['Obras selectas', 'Rabindranath Tagore', 15000, 'Poesía'],
	['El jardinero', 'Rabindranath Tagore', 15000, 'Poesía'],
	[
		'La máquina del tiempo',
		'H.G. Wells',
		17000,
		'Ficción clásica',
		'Ciencia ficción',
	],
	[
		'El hombre invisible',
		'H.G. Wells',
		17000,
		'Ficción clásica',
		'Ciencia ficción',
	],
	['Azul', 'Rubén Darío', 15000, 'Poesía'],
	['Blue Period', 'Tsubasa Yamaguchi', 18000, 'Ficción contemporánea', 'Manga'],
	[
		'Los viajes de Marco Polo',
		'Marco Polo',
		15000,
		'Ensayo',
		'Crónica de viaje',
	],
	['El hombre mediocre', 'José Ingenieros', 18000, 'Ensayo'],
	[
		'Los de abajo',
		'Mariano Azuela',
		18000,
		'Literatura latinoamericana',
		'Novela',
	],
	['El libro egipcio de los muertos', 'Anónimo', 21000, 'Ensayo', 'Religión'],
	['Los cuatro libros', 'Confucio', 17000, 'Filosofía'],
	['El arte de la felicidad', 'Epicuro', 15000, 'Filosofía'],
	['Filosofía del budismo zen', 'Byung-Chul Han', 15000, 'Filosofía'],
	['Introducción a la filosofía', 'Manuel García Morente', 15000, 'Filosofía'],
	[
		'El amor, las mujeres y la muerte',
		'Arthur Schopenhauer',
		15000,
		'Filosofía',
	],
	['No violencia', 'Mark Kurlansky', 15000, 'Ensayo'],
	[
		'Frutos de mi tierra',
		'Tomás Carrasquilla',
		18000,
		'Literatura colombiana',
		'Novela',
	],
	[
		'La marquesa de Yolombó',
		'Tomás Carrasquilla',
		18000,
		'Literatura colombiana',
		'Novela',
	],
	['Cuentos', 'Tomás Carrasquilla', 15000, 'Literatura colombiana', 'Cuentos'],
	[
		'De sobremesa',
		'José Asunción Silva',
		18000,
		'Literatura colombiana',
		'Novela',
	],
	['Manuela', 'Eugenio Díaz Castro', 18000, 'Literatura colombiana', 'Novela'],
	[
		'El carnero',
		'Juan Rodríguez Freyle',
		18000,
		'Literatura colombiana',
		'Crónica',
	],
	['Cumandá', 'Juan León Mera', 17000, 'Literatura latinoamericana', 'Novela'],
	[
		'Sin tetas no hay paraíso',
		'Gustavo Bolívar',
		18000,
		'Literatura colombiana',
		'Novela',
	],
	['Las últimas horas de Diomedes Díaz', 'Varios', 12000, 'Ensayo', 'Crónica'],
	['Nadie mató a Colmenares', 'Varios', 12000, 'Ensayo', 'Crónica'],
	['Los hobbits en Tolkien', 'David Day', 17000, 'Ensayo', 'Literario'],
	[
		'Los monstruos y los críticos',
		'J.R.R. Tolkien',
		17000,
		'Ensayo',
		'Literario',
	],
	[
		'Una rosa para Emily y otros cuentos',
		'William Faulkner',
		17000,
		'Ficción clásica',
		'Cuentos',
	],
	[
		'Cuentos',
		'Alejo Carpentier',
		15000,
		'Literatura latinoamericana',
		'Cuentos',
	],
	['El avaro', 'Molière', 15000, 'Teatro', 'Comedia'],
	['El tartufo', 'Molière', 15000, 'Teatro', 'Comedia'],
	['Edipo Rey y Antígona', 'Sófocles', 17000, 'Teatro', 'Tragedia'],
	['Tragedias', 'Esquilo', 15000, 'Teatro', 'Tragedia'],
	['El burlador de Sevilla', 'Tirso de Molina', 17000, 'Teatro', 'Drama'],
	[
		'El alcalde de Zalamea',
		'Pedro Calderón de la Barca',
		17000,
		'Teatro',
		'Drama',
	],
	[
		'Historia de la vida del Buscón',
		'Francisco de Quevedo',
		17000,
		'Ficción clásica',
		'Novela',
	],
	[
		'El sombrero de tres picos',
		'Pedro Antonio de Alarcón',
		15000,
		'Ficción clásica',
		'Novela',
	],
	[
		'Cartas desde mi molino',
		'Alphonse Daudet',
		15000,
		'Ficción clásica',
		'Cuentos',
	],
	['El cementerio marino', 'Paul Valéry', 15000, 'Poesía'],
	['La Regenta', "Leopoldo Alas 'Clarín'", 21000, 'Ficción clásica', 'Novela'],
	['Cuentos', "Leopoldo Alas 'Clarín'", 15000, 'Ficción clásica', 'Cuentos'],
	['Obras escogidas', 'Benito Pérez Galdós', 12000, 'Ficción clásica'],
	[
		'Parménides y Heráclito: fragmentos',
		'Parménides / Heráclito',
		15000,
		'Filosofía',
	],
	['Los nibelungos', 'Anónimo', 21000, 'Ficción clásica', 'Épica'],
	['Teogonía', 'Hesíodo', 15000, 'Filosofía', 'Mito'],
	[
		'El imperialismo, fase superior del capitalismo',
		'Vladimir Lenin',
		15000,
		'Ensayo',
		'Política',
	],
	['La revolución industrial', 'Mijaílov', 14000, 'Ensayo', 'Historia'],
	['Economía política', 'Nikitin', 15000, 'Ensayo', 'Economía'],
	['Breve historia de la economía', 'Varios', 14000, 'Ensayo', 'Economía'],
	['La ciencia', 'Bonifati Kédrov', 14000, 'Ensayo', 'Ciencia'],
	['Ensayos', 'Robert Louis Stevenson', 14000, 'Ensayo'],
	['En el erial', 'D.H. Lawrence', 14000, 'Ficción clásica', 'Cuentos'],
	['La pistola', 'James Jones', 15000, 'Ficción contemporánea', 'Novela'],
	['Corazón', 'Edmondo de Amicis', 17000, 'Infantil', 'Novela'],
	[
		'Cómo el hombre llegó a ser grande',
		'Mijaíl Ilin',
		16000,
		'Ensayo',
		'Ciencia',
	],
	['Mi amigo el pintor', 'Lygia Bojunga', 16000, 'Infantil'],
	[
		'Antología de poetas colombianos',
		'Varios',
		12000,
		'Literatura colombiana',
		'Poesía',
	],
	['Poesía popular', 'Varios', 12000, 'Poesía'],
	['Cuentos hispanos', 'Varios', 12000, 'Ficción clásica', 'Cuentos'],
	['Antología de sabiduría persa', 'Varios', 12000, 'Filosofía'],
	['Ensayos fundamentales del vivir', 'Varios', 12000, 'Ensayo'],
	[
		'Los misterios de Alejandro Magno',
		'Paul Doherty',
		16000,
		'Ficción contemporánea',
		'Histórica',
	],
	[
		'La máscara de Ra',
		'Paul Doherty',
		16000,
		'Ficción contemporánea',
		'Histórica',
	],
	[
		'Osceola, el gran jefe de los seminolas',
		'Mayne Reid',
		16000,
		'Ficción clásica',
		'Aventura',
	],
	['Osceola', 'Mayne Reid', 16000, 'Ficción clásica', 'Aventura'],
	['Los buenos, los malos y los feos', 'Varios', 12000, 'Ficción clásica'],
	['Tránsito', 'Luis Silvestre', 16000, 'Literatura colombiana', 'Novela'],
	['Muerte entre poetas', 'Varios', 12000, 'Ficción clásica', 'Misterio'],
	['Mi diario en la Unión Soviética', 'Varios', 12000, 'Ensayo', 'Crónica'],
	['Las cadenas de la infamia', 'Varios', 12000, 'Ficción clásica'],
	['Cálida y dima', 'Varios', 12000, 'Ficción clásica'],
	[
		'El despertar de la gracia del mundo de carne',
		'Varios',
		12000,
		'Ficción clásica',
	],
	['Caravana de las almas', 'Varios', 12000, 'Ficción clásica'],
	['Ibis', 'Varios', 12000, 'Ficción clásica'],
	['Historias fantásticas', 'Varios', 12000, 'Fantasía', 'Cuentos'],
	['De mil bosques una bellota', 'Varios', 12000, 'Ensayo'],
	['Lejos del nido y fábulas clásicas', 'Varios', 12000, 'Infantil', 'Fábula'],
	['El moro', 'Varios', 12000, 'Ficción clásica'],
	[
		'La sangre de los inocentes',
		'Varios',
		12000,
		'Ficción contemporánea',
		'Thriller',
	],
	['Los intelectuales y las masas', 'Varios', 12000, 'Ensayo'],
	['Contribuciones a la civilización universal', 'Varios', 12000, 'Ensayo'],
	['Vivir peligrosamente en tiempos ordinarios', 'Varios', 12000, 'Ensayo'],
	[
		'El monasterio maldito',
		'Varios',
		12000,
		'Ficción contemporánea',
		'Misterio',
	],
	['Una boda en la frente', 'Varios', 12000, 'Ficción contemporánea'],
	['Amores sin tregua', 'Varios', 12000, 'Ficción contemporánea', 'Romance'],
	['El hombre de vientre de plomo', 'Varios', 12000, 'Ficción contemporánea'],
	['El buscador de guacas', 'Varios', 12000, 'Literatura colombiana'],
	[
		'El mundo, la carne y el padre Smith',
		'Bruce Marshall',
		16000,
		'Ficción clásica',
		'Novela',
	],
]

function slugify(s: string): string {
	return s
		.toLowerCase()
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.replace(/[^a-z0-9\s-]/g, '')
		.trim()
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
}

async function fetchCoverOpenLibrary(
	title: string,
	author: string,
): Promise<string | null> {
	try {
		const params = new URLSearchParams({
			title: title.split(':')[0],
			author: author.replace(/['"]/g, ''),
			limit: '1',
		})
		const r = await fetch(`https://openlibrary.org/search.json?${params}`, {
			headers: { 'User-Agent': 'LibreriaDelBuho/1.0' },
		})
		if (!r.ok) return null
		const data = (await r.json()) as {
			docs?: Array<{ cover_i?: number; cover_edition_key?: string }>
		}
		const doc = data.docs?.[0]
		if (!doc) return null
		if (doc.cover_i)
			return `https://covers.openlibrary.org/b/id/${doc.cover_i}-L.jpg`
		if (doc.cover_edition_key)
			return `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-L.jpg`
		return null
	} catch {
		return null
	}
}

async function fetchCoverGoogleBooks(
	title: string,
	author: string,
): Promise<string | null> {
	const q = encodeURIComponent(`${title.split(':')[0]} ${author.split(' ')[0]}`)
	const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${q}&maxResults=1&printType=books`
	try {
		const r = await fetch(apiUrl)
		if (!r.ok) return null
		const data = (await r.json()) as {
			items?: Array<{
				volumeInfo?: {
					imageLinks?: { thumbnail?: string; smallThumbnail?: string }
				}
			}>
		}
		const links = data.items?.[0]?.volumeInfo?.imageLinks
		const link = links?.thumbnail ?? links?.smallThumbnail
		if (!link) return null
		return link.replace(/^http:/, 'https:').replace('&edge=curl', '')
	} catch {
		return null
	}
}

async function fetchCover(
	title: string,
	author: string,
): Promise<string | null> {
	// OpenLibrary first — good for classics, no rate limit
	const ol = await fetchCoverOpenLibrary(title, author)
	if (ol) return ol
	// Fallback: Google Books (may rate-limit)
	return fetchCoverGoogleBooks(title, author)
}

async function seedBooks() {
	console.log(
		`→ Seeding ${BOOKS.length} books (pulling covers from Google Books)…`,
	)
	const seen = new Set<string>()
	let ok = 0
	let skipped = 0
	for (let i = 0; i < BOOKS.length; i++) {
		const [title, author, price, genre, category] = BOOKS[i]
		let slug = slugify(title)
		if (seen.has(slug)) {
			slug = `${slug}-${slugify(author).slice(0, 20)}`
		}
		seen.add(slug)

		const cover = await fetchCover(title, author)

		const payload = {
			slug,
			title,
			author,
			description: `${title}, de ${author}. Edición disponible en la Librería del Búho.`,
			genre,
			category: category ?? null,
			price,
			release_year: 2024,
			stock: 3 + (i % 4), // 3..6
			cover_image_path: cover,
			published: true,
		}

		const { error } = await supabase
			.from('books')
			.upsert(payload, { onConflict: 'slug', ignoreDuplicates: false })

		if (error) {
			console.error(`  ✗ [${i + 1}/${BOOKS.length}] ${slug}:`, error.message)
			skipped++
		} else {
			ok++
			const tag = cover ? '🖼' : '  '
			process.stdout.write(`  ${tag} [${i + 1}/${BOOKS.length}] ${slug}\n`)
		}
		// mild pacing to be gentle with APIs
		if (i % 5 === 4) await new Promise((r) => setTimeout(r, 350))
	}
	console.log(`\n  ${ok} ok · ${skipped} errored`)
}

async function wipeOldBooks() {
	// Remove prior placeholder books from the previous v1 seed, so the catalog is clean.
	const oldSlugs = [
		'el-ritmo-de-las-cosas-rotas',
		'manual-de-tipografia-modesta',
		'arquitectura-del-silencio',
		'cartas-desde-el-hemisferio-sur',
		'poemas-del-apagon',
		'algoritmos-para-ninos-curiosos',
		'refactorizar-la-vida',
		'pequena-guia-de-hongos-urbanos',
		'como-perder-el-tiempo',
		'la-biblioteca-del-faro',
		'el-cuaderno-de-margarita',
		'infraestructuras-del-afecto',
		'canciones-para-regresar-a-casa',
		'ensayo-sobre-la-luz-marzo',
	]
	const { error } = await supabase.from('books').delete().in('slug', oldSlugs)
	if (error) console.warn('wipe warning:', error.message)
	else
		console.log(
			`→ Cleared ${oldSlugs.length} placeholder books from previous seed.`,
		)
}

async function ensureAdmin() {
	const email = 'admin@buhobooks.co'
	const password = 'BuhoBooks2026!'
	console.log('→ Ensuring admin user…')
	const { data: existing } = await supabase.auth.admin.listUsers({
		page: 1,
		perPage: 200,
	})
	const found = existing?.users.find((u) => u.email === email)
	if (found) {
		console.log(`  ✓ admin exists: ${email}`)
		return { email, password: '(existing)' }
	}
	const { error } = await supabase.auth.admin.createUser({
		email,
		password,
		email_confirm: true,
	})
	if (error) {
		console.error('  ✗ create admin failed:', error.message)
		return null
	}
	console.log(`  ✓ admin created: ${email}`)
	return { email, password }
}

async function main() {
	await wipeOldBooks()
	await seedBooks()
	const creds = await ensureAdmin()
	console.log('\n✔ Seed complete.')
	if (creds) console.log(`Admin login → ${creds.email} / ${creds.password}`)
}

main().catch((e) => {
	console.error(e)
	process.exit(1)
})

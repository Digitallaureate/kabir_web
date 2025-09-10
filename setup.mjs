import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import "dotenv/config";

const serviceAccount = {
  "type": "service_account",
  "project_id": process.env.Firebase_Project_Id,
  "private_key_id": process.env.Firebase_Private_Key_Id,
  "private_key": process.env.Firebase_Private_Key,
  "client_email": process.env.Firebase_Client_Email,
  "client_id": process.env.Firebase_Client_Id,
  "auth_uri": process.env.Firebase_Auth_Url,
  "token_uri": process.env.Firebase_Token_Url,
  "auth_provider_x509_cert_url": process.env.Firebase_AuthProvider_Url,
  "client_x509_cert_url": process.env.Firebase_Client_Url,
  "universe_domain": process.env.Firebase_Universal_Domain
};

const firebaseConfig = {
  credential: cert(serviceAccount),
  projectId: process.env.Firebase_Project_Id
};

const firestoreRules = `
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /contactSubmissions/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if true;
    }
    
    match /contacts/{document=**} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if true;
    }
    
    match /blogPosts/{document=**} {
      allow read: if true;
      allow write: if true;
    }
    
    match /categories/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /monuments/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /routes/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /blogs/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /tags/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /cities/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /submonuments/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
`;

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const cities = [
  {
    id: "agra-001",
    name: "Agra",
    location: "Agra, Uttar Pradesh, India",
    description: "Home to the iconic Taj Mahal and rich Mughal heritage",
    latitude: 27.1767,
    longitude: 78.0081,
    zoom_level: 11,
    period: "1500s-1700s",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "mathura-001",
    name: "Mathura",
    location: "Mathura, Uttar Pradesh, India",
    description: "Birthplace of Lord Krishna and ancient religious center",
    latitude: 27.4924,
    longitude: 77.6737,
    zoom_level: 12,
    period: "Ancient-Present",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "vrindavan-001",
    name: "Vrindavan",
    location: "Vrindavan, Uttar Pradesh, India",
    description: "Sacred town associated with Lord Krishna's childhood",
    latitude: 27.5706,
    longitude: 77.7022,
    zoom_level: 13,
    period: "Ancient-Present",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "fatehpur-sikri-001",
    name: "Fatehpur Sikri",
    location: "Fatehpur Sikri, Uttar Pradesh, India",
    description: "Former Mughal capital with stunning red sandstone architecture",
    latitude: 27.0937,
    longitude: 77.6613,
    zoom_level: 14,
    period: "1571-1585",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "bharatpur-001",
    name: "Bharatpur",
    location: "Bharatpur, Rajasthan, India",
    description: "Famous for Keoladeo National Park and Lohagarh Fort",
    latitude: 27.2152,
    longitude: 77.4888,
    zoom_level: 12,
    period: "1733-Present",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const categories = [
  { id: "tomb", name: "Tomb", color: "#8B4513", icon: "monument" },
  { id: "fort", name: "Fort", color: "#DC143C", icon: "shield" },
  { id: "mosque", name: "Mosque", color: "#228B22", icon: "building" },
  { id: "palace", name: "Palace", color: "#FFD700", icon: "crown" },
  { id: "garden", name: "Garden", color: "#32CD32", icon: "tree" },
  { id: "temple", name: "Temple", color: "#FF6347", icon: "temple" },
  { id: "gateway", name: "Gateway", color: "#4682B4", icon: "door" }
];

const monuments = [
  {
    id: "taj-mahal-001",
    name: "Taj Mahal",
    city_id: "agra-001",
    category: "tomb",
    description: "An ivory-white marble mausoleum, symbol of eternal love built by Shah Jahan for his wife Mumtaz Mahal",
    latitude: 27.1751,
    longitude: 78.0421,
    address: "Dharmapuri, Forest Colony, Tajganj, Agra, Uttar Pradesh 282001",
    architect: "Ustad Ahmad Lahauri",
    year_built: "1632-1653",
    period: "Mughal Era",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Ftaj-mahal.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "agra-fort-001",
    name: "Agra Fort",
    city_id: "agra-001",
    category: "fort",
    description: "A historical fort that served as the main residence of the Mughal emperors until 1638",
    latitude: 27.1797,
    longitude: 78.0215,
    address: "Rakabganj, Agra, Uttar Pradesh 282003",
    architect: "Akbar the Great",
    year_built: "1565-1573",
    period: "Mughal Era",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Fagra-fort.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "fatehpur-sikri-complex-001",
    name: "Fatehpur Sikri Complex",
    city_id: "fatehpur-sikri-001",
    category: "palace",
    description: "A fortified city built by Mughal Emperor Akbar, showcasing Indo-Islamic architecture",
    latitude: 27.0937,
    longitude: 77.6613,
    address: "Fatehpur Sikri, Uttar Pradesh 283110",
    architect: "Akbar the Great",
    year_built: "1571-1585",
    period: "Mughal Era",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Ffatehpur-sikri.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "mehtab-bagh-001",
    name: "Mehtab Bagh",
    city_id: "agra-001",
    category: "garden",
    description: "A charbagh complex that offers stunning views of the Taj Mahal from across the Yamuna River",
    latitude: 27.1793,
    longitude: 78.0447,
    address: "Nagla Devjit, Uttar Pradesh 282007",
    architect: "Mughal Garden Designers",
    year_built: "1631-1635",
    period: "Mughal Era",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Fmehtab-bagh.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "krishna-janmabhoomi-001",
    name: "Krishna Janmabhoomi Temple",
    city_id: "mathura-001",
    category: "temple",
    description: "Sacred temple complex marking the birthplace of Lord Krishna",
    latitude: 27.5036,
    longitude: 77.6733,
    address: "Krishna Janmasthan, Mathura, Uttar Pradesh 281001",
    architect: "Various periods",
    year_built: "Ancient-Reconstructed",
    period: "Ancient-Present",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Fkrishna-janmabhoomi.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "banke-bihari-001",
    name: "Banke Bihari Temple",
    city_id: "vrindavan-001",
    category: "temple",
    description: "Famous temple dedicated to Lord Krishna in his child form",
    latitude: 27.5785,
    longitude: 77.7064,
    address: "Banke Bihari Gali, Vrindavan, Uttar Pradesh 281121",
    architect: "Swami Haridas followers",
    year_built: "1864",
    period: "19th Century",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Fbanke-bihari.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "lohagarh-fort-001",
    name: "Lohagarh Fort",
    city_id: "bharatpur-001",
    category: "fort",
    description: "Iron fort that was never conquered, built with iron and mud",
    latitude: 27.2174,
    longitude: 77.4963,
    address: "Lohagarh, Bharatpur, Rajasthan 321001",
    architect: "Maharaja Suraj Mal",
    year_built: "1733",
    period: "Jat Kingdom",
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/monuments%2Flohagarh-fort.jpg?alt=media",
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const subMonuments = [
  {
    id: "taj-main-dome-001",
    name: "Main Dome",
    parent_id: "taj-mahal-001",
    category: "architectural",
    title: "Taj Mahal: The Central Dome",
    description: "The magnificent central dome crowned with a finial",
    content: "The central dome of the Taj Mahal is its most iconic feature, rising majestically above the marble structure. The dome is double-layered with an inner dome and an outer dome, creating perfect acoustics and visual harmony.",
    latitude: 27.1751,
    longitude: 78.0421,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Ftaj-dome.jpg?alt=media",
    tags: ["Taj Mahal", "Dome", "Architecture", "Mughal"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "taj-minarets-001",
    name: "Four Minarets",
    parent_id: "taj-mahal-001",
    category: "architectural",
    title: "Taj Mahal: The Four Minarets",
    description: "Four elegant minarets flanking the main structure",
    content: "The four minarets of the Taj Mahal stand at each corner of the platform, each slightly tilted outward to prevent them from falling on the main tomb in case of an earthquake. They showcase intricate marble work and perfect symmetry.",
    latitude: 27.1752,
    longitude: 78.0420,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Ftaj-minarets.jpg?alt=media",
    tags: ["Taj Mahal", "Minarets", "Architecture", "Symmetry"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "diwan-i-am-001",
    name: "Diwan-i-Am",
    parent_id: "agra-fort-001",
    category: "palace",
    title: "Agra Fort: Hall of Public Audience",
    description: "The Hall of Public Audience where emperors met common people",
    content: "The Diwan-i-Am was where the Mughal emperor would hold court and listen to petitions from common people. This impressive structure features 40 pillars and demonstrates the Mughal emphasis on accessible leadership.",
    latitude: 27.1791,
    longitude: 78.0219,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fdiwan-i-am.jpg?alt=media",
    tags: ["Agra Fort", "Diwan-i-Am", "Public Audience", "Mughal"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "diwan-i-khas-001",
    name: "Diwan-i-Khas",
    parent_id: "agra-fort-001",
    category: "palace",
    title: "Agra Fort: Hall of Private Audience",
    description: "The Hall of Private Audience for important nobles and diplomats",
    content: "The Diwan-i-Khas was reserved for private audiences with important nobles, foreign diplomats, and high-ranking officials. The hall features exquisite marble work and the famous Peacock Throne replica.",
    latitude: 27.1795,
    longitude: 78.0217,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fdiwan-i-khas.jpg?alt=media",
    tags: ["Agra Fort", "Diwan-i-Khas", "Private Audience", "Throne"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "jahangir-mahal-001",
    name: "Jahangir Mahal",
    parent_id: "agra-fort-001",
    category: "palace",
    title: "Agra Fort: Jahangir's Palace",
    description: "Royal palace built for Emperor Jahangir",
    content: "Jahangir Mahal is a beautiful palace within the Agra Fort complex, showcasing a blend of Hindu and Islamic architectural styles. It served as the residence for Emperor Jahangir and features intricate stone carvings.",
    latitude: 27.1799,
    longitude: 78.0213,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fjahangir-mahal.jpg?alt=media",
    tags: ["Agra Fort", "Jahangir", "Palace", "Hybrid Architecture"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "buland-darwaza-001",
    name: "Buland Darwaza",
    parent_id: "fatehpur-sikri-complex-001",
    category: "gateway",
    title: "Fatehpur Sikri: Gate of Magnificence",
    description: "The magnificent gateway celebrating Akbar's victory",
    content: "Buland Darwaza, the 'Gate of Magnificence', stands 54 meters high and was built to commemorate Akbar's victory over Gujarat. It's one of the largest gateways in the world and showcases Indo-Islamic architecture.",
    latitude: 27.0939,
    longitude: 77.6611,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fbuland-darwaza.jpg?alt=media",
    tags: ["Fatehpur Sikri", "Gateway", "Victory", "Akbar"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "jama-masjid-fatehpur-001",
    name: "Jama Masjid",
    parent_id: "fatehpur-sikri-complex-001",
    category: "mosque",
    title: "Fatehpur Sikri: Grand Mosque",
    description: "The grand mosque of Fatehpur Sikri",
    content: "The Jama Masjid of Fatehpur Sikri is one of the largest mosques in India, built by Emperor Akbar. It houses the tomb of the Sufi saint Salim Chishti and features beautiful marble and red sandstone work.",
    latitude: 27.0935,
    longitude: 77.6615,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fjama-masjid-fatehpur.jpg?alt=media",
    tags: ["Fatehpur Sikri", "Mosque", "Salim Chishti", "Prayer"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "panch-mahal-001",
    name: "Panch Mahal",
    parent_id: "fatehpur-sikri-complex-001",
    category: "palace",
    title: "Fatehpur Sikri: Five-Story Palace",
    description: "A unique five-story palace with diminishing floors",
    content: "Panch Mahal is a five-story palace that served as a pleasure pavilion for the royal ladies. Each floor is smaller than the one below, creating a pyramid-like structure with 176 columns of varying designs.",
    latitude: 27.0941,
    longitude: 77.6609,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fpanch-mahal.jpg?alt=media",
    tags: ["Fatehpur Sikri", "Five Stories", "Palace", "Columns"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "govind-dev-temple-001",
    name: "Govind Dev Temple",
    parent_id: "vrindavan-001",
    category: "temple",
    title: "Vrindavan: Ancient Krishna Temple",
    description: "Historic temple dedicated to Lord Krishna",
    content: "Govind Dev Temple is one of the most important temples in Vrindavan, originally built in 1590. The temple houses the deity of Govind Dev Ji and is known for its spiritual significance and beautiful architecture.",
    latitude: 27.5798,
    longitude: 77.7051,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fgovind-dev.jpg?alt=media",
    tags: ["Vrindavan", "Krishna", "Temple", "Ancient"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "kishori-raman-temple-001",
    name: "Kishori Raman Temple",
    parent_id: "vrindavan-001",
    category: "temple",
    title: "Vrindavan: Modern Krishna Temple",
    description: "Beautiful modern temple with traditional architecture",
    content: "Kishori Raman Temple is a relatively modern temple that maintains traditional architectural elements while incorporating contemporary design. It's dedicated to Lord Krishna and Radha and is popular among devotees.",
    latitude: 27.5790,
    longitude: 77.7070,
    image_url: "https://firebasestorage.googleapis.com/v0/b/ecostory-site.appspot.com/o/submonuments%2Fkishori-raman.jpg?alt=media",
    tags: ["Vrindavan", "Krishna", "Radha", "Modern"],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

const routes = [
  {
    id: "golden-triangle-001",
    name: "Golden Triangle Heritage Route",
    description: "Explore the magnificent Mughal heritage from Agra to Fatehpur Sikri",
    type: "heritage",
    color: "#FFD700",
    distance: "40.2 km",
    estimated_time: "480",
    monument_ids: ["taj-mahal-001", "agra-fort-001", "fatehpur-sikri-complex-001"],
    order: ["taj-mahal-001", "agra-fort-001", "fatehpur-sikri-complex-001"],
    polyline: [
      { lat: 27.1751, lng: 78.0421 },
      { lat: 27.1756, lng: 78.0428 },
      { lat: 27.1763, lng: 78.0435 },
      { lat: 27.1775, lng: 78.0398 },
      { lat: 27.1797, lng: 78.0215 },
      { lat: 27.1805, lng: 78.0198 },
      { lat: 27.1820, lng: 78.0165 },
      { lat: 27.1850, lng: 78.0120 },
      { lat: 27.1900, lng: 78.0050 },
      { lat: 27.2000, lng: 77.9800 },
      { lat: 27.2200, lng: 77.9200 },
      { lat: 27.0937, lng: 77.6613 }
    ],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "spiritual-journey-001",
    name: "Krishna's Spiritual Journey",
    description: "Follow the divine path through Mathura and Vrindavan",
    type: "spiritual",
    color: "#FF6347",
    distance: "15.8 km",
    estimated_time: "300",
    monument_ids: ["krishna-janmabhoomi-001", "banke-bihari-001"],
    order: ["krishna-janmabhoomi-001", "banke-bihari-001"],
    polyline: [
      { lat: 27.5036, lng: 77.6733 },
      { lat: 27.5086, lng: 77.6783 },
      { lat: 27.5136, lng: 77.6833 },
      { lat: 27.5236, lng: 77.6883 },
      { lat: 27.5336, lng: 77.6933 },
      { lat: 27.5486, lng: 77.6983 },
      { lat: 27.5636, lng: 77.7033 },
      { lat: 27.5785, lng: 77.7064 }
    ],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "gardens-tour-001",
    name: "Mughal Gardens Tour",
    description: "Discover the beautiful gardens and landscapes of Mughal Agra",
    type: "nature",
    color: "#32CD32",
    distance: "8.5 km",
    estimated_time: "240",
    monument_ids: ["taj-mahal-001", "mehtab-bagh-001"],
    order: ["taj-mahal-001", "mehtab-bagh-001"],
    polyline: [
      { lat: 27.1751, lng: 78.0421 },
      { lat: 27.1756, lng: 78.0429 },
      { lat: 27.1773, lng: 78.0432 },
      { lat: 27.1777, lng: 78.0434 },
      { lat: 27.1784, lng: 78.0437 },
      { lat: 27.1793, lng: 78.0447 }
    ],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "fort-circuit-001",
    name: "Historic Forts Circuit",
    description: "Explore the mighty forts that shaped regional history",
    type: "military",
    color: "#DC143C",
    distance: "125.6 km",
    estimated_time: "600",
    monument_ids: ["agra-fort-001", "lohagarh-fort-001"],
    order: ["agra-fort-001", "lohagarh-fort-001"],
    polyline: [
      { lat: 27.1797, lng: 78.0215 },
      { lat: 27.1850, lng: 78.0100 },
      { lat: 27.1950, lng: 77.9800 },
      { lat: 27.2050, lng: 77.9200 },
      { lat: 27.2100, lng: 77.8500 },
      { lat: 27.2150, lng: 77.7500 },
      { lat: 27.2174, lng: 77.4963 }
    ],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: "complete-heritage-001",
    name: "Complete Heritage Experience",
    description: "The ultimate journey covering all major heritage sites",
    type: "comprehensive",
    color: "#4B0082",
    distance: "180.3 km",
    estimated_time: "720",
    monument_ids: ["taj-mahal-001", "agra-fort-001", "fatehpur-sikri-complex-001", "krishna-janmabhoomi-001", "banke-bihari-001"],
    order: ["taj-mahal-001", "agra-fort-001", "fatehpur-sikri-complex-001", "krishna-janmabhoomi-001", "banke-bihari-001"],
    polyline: [
      { lat: 27.1751, lng: 78.0421 },
      { lat: 27.1797, lng: 78.0215 },
      { lat: 27.0937, lng: 77.6613 },
      { lat: 27.5036, lng: 77.6733 },
      { lat: 27.5785, lng: 77.7064 }
    ],
    is_active: true,
    created_at: new Date(),
    updated_at: new Date()
  }
];

async function populateFirebase() {
  try {
    console.log('Starting to add cities...');
    for (const city of cities) {
      await db.collection('cities').doc(city.id).set(city);
      console.log(`City ${city.name} uploaded successfully`);
    }
    console.log('All cities uploaded successfully');

    console.log('Starting to add categories...');
    for (const category of categories) {
      await db.collection('categories').doc(category.id).set(category);
      console.log(`Category ${category.name} uploaded successfully`);
    }
    console.log('All categories uploaded successfully');

    console.log('Starting to add monuments...');
    for (const monument of monuments) {
      await db.collection('monuments').doc(monument.id).set(monument);
      console.log(`Monument ${monument.name} uploaded successfully`);
    }
    console.log('All monuments uploaded successfully');

    console.log('Starting to add sub-monuments...');
    for (const subMonument of subMonuments) {
      await db.collection('submonuments').doc(subMonument.id).set(subMonument);
      console.log(`Sub-monument ${subMonument.name} uploaded successfully`);
    }
    console.log('All sub-monuments uploaded successfully');

    console.log('Starting to add routes...');
    for (const route of routes) {
      await db.collection('routes').doc(route.id).set(route);
      console.log(`Route ${route.name} uploaded successfully`);
    }
    console.log('All routes uploaded successfully');

    console.log('All data has been successfully populated to Firebase!');
  } catch (error) {
    console.error('Error populating data:', error);
  }
}

populateFirebase();

export { cities, categories, monuments, subMonuments, routes, firestoreRules };
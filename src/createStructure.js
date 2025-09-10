import { promises as fs } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function createAdminMapStructure() {
  const baseDir = join(__dirname, 'admin', 'map');

  // Define the folder structure
  const structure = [
    'cities',
    'cities/add',
    'cities/edit/[id]',
    'monuments',
    'monuments/add',
    'monuments/edit/[id]',
    'submonuments',
    'submonuments/add',
    'submonuments/edit/[id]',
    'tours',
    'tours/add',
    'tours/edit/[id]',
    'routes',
    'routes/add',
    'routes/edit/[id]'
  ];

  // Define files for each directory
  const files = {
    '': 'index.astro',
    'cities': 'index.astro',
    'cities/add': 'index.astro',
    'cities/edit/[id]': 'index.astro',
    'monuments': 'index.astro',
    'monuments/add': 'index.astro',
    'monuments/edit/[id]': 'index.astro',
    'submonuments': 'index.astro',
    'submonuments/add': 'index.astro',
    'submonuments/edit/[id]': 'index.astro',
    'tours': 'index.astro',
    'tours/add': 'index.astro',
    'tours/edit/[id]': 'index.astro',
    'routes': 'index.astro',
    'routes/add': 'index.astro',
    'routes/edit/[id]': 'index.astro'
  };

  try {
    // Create base directory
    await fs.mkdir(baseDir, { recursive: true });

    // Create all directories
    for (const dir of structure) {
      await fs.mkdir(join(baseDir, dir), { recursive: true });
    }

    // Create index.astro files
    for (const [dir, file] of Object.entries(files)) {
      await fs.writeFile(join(baseDir, dir, file), '// Astro file content\n');
    }

    console.log('Folder structure created successfully!');
  } catch (error) {
    console.error('Error creating folder structure:', error);
  }
}

// Run the function
createAdminMapStructure();
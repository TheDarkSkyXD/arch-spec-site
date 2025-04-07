import { Technology, Database, ORM, Hosting } from '../types/techStack';

// Filter database systems based on selections
export const filterDatabaseSystems = (
  selectedType: string | undefined,
  selectedHosting: string | undefined,
  selectedOrm: string | undefined,
  allDatabases: Database[],
  allDatabaseHosting: Hosting[],
  allOrms: Technology[]
): Technology[] => {
  // If nothing selected, show all databases
  if (!selectedType && !selectedHosting && !selectedOrm) {
    return allDatabases;
  }

  // Start with all databases
  let filtered = [...allDatabases];

  // Filter by type if selected
  if (selectedType) {
    filtered = filtered.filter((db) => db.type === selectedType);
  }

  // Filter by hosting compatibility if selected
  if (selectedHosting) {
    const hostingOption = allDatabaseHosting.find((h) => h.id === selectedHosting);
    if (hostingOption?.compatibleWith?.database) {
      const compatibleDatabases = hostingOption.compatibleWith.database;
      filtered = filtered.filter((db) => compatibleDatabases.includes(db.id as string));
    }
  }

  // Filter by ORM compatibility if selected
  if (selectedOrm) {
    const ormOption = allOrms.find((o) => o.id === selectedOrm) as ORM;
    if (ormOption?.compatibleWith) {
      const compatibleDatabases = Array.isArray(ormOption.compatibleWith)
        ? ormOption.compatibleWith
        : Object.keys(ormOption.compatibleWith);
      filtered = filtered.filter((db) => compatibleDatabases.includes(db.id as string));
    }
  }

  return filtered;
};

// Filter database hosting options based on selections
export const filterDatabaseHosting = (
  selectedType: string | undefined,
  selectedSystem: string | undefined,
  selectedOrm: string | undefined,
  allDatabases: Database[],
  allDatabaseHosting: Hosting[],
  allOrms: Technology[]
): Technology[] => {
  // If nothing selected, show all hosting options
  if (!selectedType && !selectedSystem && !selectedOrm) {
    return allDatabaseHosting;
  }

  let compatibleHosting: string[] = [];

  // If database system is selected, get compatible hosting
  if (selectedSystem) {
    const system = allDatabases.find((db) => db.id === selectedSystem) as Database;
    if (system?.compatibleWith?.hosting) {
      compatibleHosting = system.compatibleWith.hosting;
    }
  }

  // Filter hosting options
  return allDatabaseHosting.filter((hosting) => {
    // If system selected, check if hosting is compatible
    if (selectedSystem && compatibleHosting.length > 0) {
      return compatibleHosting.includes(hosting.id as string);
    }

    // Filter by database type
    if (selectedType) {
      // Get databases of this type
      const typeDBs = allDatabases.filter((db) => db.type === selectedType);

      // Check if hosting is compatible with any of these databases
      return typeDBs.some((db) => {
        const dbOption = db as Database;
        return dbOption.compatibleWith?.hosting?.includes(hosting.id as string);
      });
    }

    // Filter by ORM compatibility
    if (selectedOrm) {
      const orm = allOrms.find((o) => o.id === selectedOrm);
      if (!orm) return true;

      // Find databases compatible with this ORM
      const ormCompatible = Array.isArray(orm.compatibleWith)
        ? orm.compatibleWith
        : Object.keys(orm.compatibleWith);

      // Check if hosting is compatible with any database that supports this ORM
      return allDatabases
        .filter((db) => ormCompatible.includes(db.id as string))
        .some((db) => {
          const dbOption = db as Database;
          return dbOption.compatibleWith?.hosting?.includes(hosting.id as string);
        });
    }

    return true;
  });
};

// Filter ORM options based on selections
export const filterOrmOptions = (
  selectedType: string | undefined,
  selectedSystem: string | undefined,
  selectedHosting: string | undefined,
  allDatabases: Database[],
  allDatabaseHosting: Hosting[],
  allOrms: Technology[]
): Technology[] => {
  // Only show ORMs for SQL databases
  if (selectedType === 'nosql') {
    return [];
  }

  // If nothing relevant selected, show all ORMs
  if (!selectedType && !selectedSystem && !selectedHosting) {
    return allOrms;
  }

  // Default to showing all ORMs if type is SQL or not specified
  let filtered = [...allOrms];

  // If database system is selected, filter by compatible ORMs
  if (selectedSystem) {
    const system = allDatabases.find((db) => db.id === selectedSystem) as Database;
    if (system?.compatibleWith?.orms) {
      const compatibleOrms = system.compatibleWith.orms;
      filtered = filtered.filter((orm) => compatibleOrms.includes(orm.id as string));
    }
  }

  // Filter by hosting compatibility if selected
  if (selectedHosting) {
    // Find databases compatible with this hosting
    const hostingOption = allDatabaseHosting.find((h) => h.id === selectedHosting);
    if (hostingOption?.compatibleWith?.database) {
      const compatibleDbs = hostingOption.compatibleWith.database;

      // Get all ORMs compatible with these databases
      const compatibleOrms = new Set<string>();

      allDatabases
        .filter((db) => compatibleDbs.includes(db.id as string))
        .forEach((db) => {
          const dbOption = db as Database;
          if (dbOption.compatibleWith?.orms) {
            dbOption.compatibleWith.orms.forEach((orm) => compatibleOrms.add(orm));
          }
        });

      if (compatibleOrms.size > 0) {
        filtered = filtered.filter((orm) => compatibleOrms.has(orm.id as string));
      }
    }
  }

  return filtered;
};

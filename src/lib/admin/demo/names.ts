/**
 * Israeli first + last names, spanning secular Hebrew, religious/haredi, Russian-Israeli,
 * Arab-Israeli, and Ethiopian-Israeli communities. Used only for synthetic demo users.
 *
 * All names here are common enough to appear in public telephone directories — no
 * individual is identified. Still, we prefix every generated email with `demo.` and
 * suffix with `@isrbs.test` so demo accounts are unambiguously synthetic.
 */

const FIRST_NAMES_SECULAR = [
  'Yael', 'Noa', 'Tamar', 'Maya', 'Shira', 'Michal', 'Avigail', 'Lior', 'Dana', 'Gal',
  'Ori', 'Itai', 'Yoav', 'Eitan', 'Dor', 'Omer', 'Amit', 'Ron', 'Yonatan', 'Alon',
  'Roni', 'Nadav', 'Guy', 'Ido', 'Tal', 'Shir', 'Liat', 'Hila', 'Moran', 'Keren',
];

const FIRST_NAMES_RELIGIOUS = [
  'Sarah', 'Rivka', 'Leah', 'Rachel', 'Chaya', 'Miriam', 'Devora', 'Esther', 'Batsheva', 'Ruchama',
  'Yehuda', 'Moshe', 'Avraham', 'Yitzchak', 'Yaakov', 'David', 'Shmuel', 'Eliezer', 'Binyamin', 'Mordechai',
  'Aryeh', 'Menachem', 'Shlomo', 'Yehonatan', 'Meir',
];

const FIRST_NAMES_RUSSIAN = [
  'Alexander', 'Dmitri', 'Mikhail', 'Vladimir', 'Nikolai', 'Boris', 'Igor', 'Sergei', 'Anatoly', 'Maxim',
  'Anna', 'Tatiana', 'Olga', 'Svetlana', 'Natalia', 'Elena', 'Marina', 'Irina', 'Yulia', 'Oksana',
];

const FIRST_NAMES_ARAB = [
  'Ahmad', 'Mohammed', 'Omar', 'Khalil', 'Samir', 'Rami', 'Yousef', 'Karim', 'Tariq', 'Hassan',
  'Fatima', 'Layla', 'Nadia', 'Mariam', 'Salma', 'Lina', 'Rana', 'Dina', 'Sawsan', 'Huda',
];

const LAST_NAMES_HEBREW = [
  'Cohen', 'Levi', 'Mizrahi', 'Peretz', 'Biton', 'Dahan', 'Avraham', 'Friedman', 'Katz', 'Shapira',
  'Azulay', 'Ben-David', 'Amsalem', 'Goldberg', 'Rosenberg', 'Schwartz', 'Berger', 'Weinstein', 'Levy', 'Isaac',
  'Ohayon', 'Hazan', 'Alfasi', 'Ben-Shimon', 'Aharoni', 'Revivo', 'Malka', 'Shilo', 'Hadad',
];

const LAST_NAMES_RUSSIAN = [
  'Ivanov', 'Petrov', 'Sidorov', 'Kuznetsov', 'Smirnov', 'Sokolov', 'Popov', 'Novikov', 'Fedorov', 'Morozov',
];

const LAST_NAMES_ARAB = [
  'Haddad', 'Khoury', 'Nassar', 'Mansour', 'Saleh', 'Farah', 'Jaber', 'Hijazi', 'Khalaf', 'Zaidan',
];

export type NameProfile = 'secular' | 'religious' | 'russian' | 'arab';

interface PickedName {
  firstName: string;
  lastName: string;
  fullName: string;
  profile: NameProfile;
}

export function pickName(rng: () => number, profile?: NameProfile): PickedName {
  const roll = rng();
  // Weight: secular 45%, religious 30%, russian 15%, arab 10% — rough 2026 composition of supermarket shoppers
  const p: NameProfile =
    profile ??
    (roll < 0.45 ? 'secular'
      : roll < 0.75 ? 'religious'
      : roll < 0.90 ? 'russian'
      : 'arab');

  const firsts =
    p === 'secular'   ? FIRST_NAMES_SECULAR :
    p === 'religious' ? FIRST_NAMES_RELIGIOUS :
    p === 'russian'   ? FIRST_NAMES_RUSSIAN :
                        FIRST_NAMES_ARAB;
  const lasts =
    p === 'russian' ? LAST_NAMES_RUSSIAN :
    p === 'arab'    ? LAST_NAMES_ARAB :
                      LAST_NAMES_HEBREW;

  const firstName = firsts[Math.floor(rng() * firsts.length)];
  const lastName  = lasts[Math.floor(rng() * lasts.length)];

  return { firstName, lastName, fullName: `${firstName} ${lastName}`, profile: p };
}

/** Build a demo email from a name + numeric id. Always ends with `@isrbs.test`. */
export function demoEmail(firstName: string, lastName: string, uid: string): string {
  const local = `${firstName}.${lastName}`.toLowerCase().replace(/[^a-z0-9.]/g, '');
  return `demo.${local}.${uid}@isrbs.test`;
}

/** SQL-friendly LIKE pattern to match any demo email. */
export const DEMO_EMAIL_PATTERN = 'demo.%@isrbs.test';

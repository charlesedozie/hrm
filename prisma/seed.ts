import { PrismaClient, EmploymentStatus, BeneficiaryType, RiskLevel, CaseStatus, CaseType, 
DisciplinaryStatus, DisciplinaryAction, GrievanceStatus, DonorType, Prisma, DepreciationMethod, AssetStatus, WorkflowModule, ProgramStatus, PayFrequency, PaymentMethod, InterventionStatus, CycleStatus } from '@prisma/client';
import { addMonths, startOfMonth, subYears, endOfMonth } from 'date-fns';

// ... rest of your code ...
import bcrypt from 'bcrypt';  
import { randomUUID } from 'crypto'; 

const prisma = new PrismaClient();
const SALT_ROUNDS = 12;  // 10–14 is good range in 2026 (higher = slower/more secure)
async function main() {
const plainPassword = 'admin2026';  // ← CHANGE THIS in real life
const hashedPassword = await bcrypt.hash(plainPassword, SALT_ROUNDS);

const benPassword = 'ben2026';  // ← CHANGE THIS in real life
const benhashedPassword = await bcrypt.hash(benPassword, SALT_ROUNDS);

const empPassword = 'emp2026';  // ← CHANGE THIS in real life
const emphashedPassword = await bcrypt.hash(empPassword, SALT_ROUNDS);

console.log('Hashed password example:', hashedPassword);
// ────────────────────────────────────────────────
// 1. Ensure an admin user exists (creator of records)
// ────────────────────────────────────────────────
const admin = await prisma.user.upsert({
where: { username: 'admin@local.local' }, 
update: {},
create: {
username: 'admin@local.local',
password: hashedPassword, // ← in real app: hash this with bcrypt!
role: 'SUPER_ADMIN',
},
});


await prisma.user.upsert({
where: { username: 'ben@local.local' }, 
update: {},
create: {
username: 'ben@local.local',
password: benhashedPassword, // ← in real app: hash this with bcrypt!
role: 'BENEFICIARY',
},
});

await prisma.user.upsert({
where: { username: 'emp@local.local' }, 
update: {},
create: {
username: 'emp@local.local',
password: emphashedPassword, // ← in real app: hash this with bcrypt!
role: 'EMPLOYEE',
},
});

const adminUserId = admin.id;
console.log(`Admin user ready (ID: ${adminUserId})`);


// === Seed Genders ===
const genders = [
{ name: 'Male', createdById: adminUserId },
{ name: 'Female', createdById: adminUserId },
{ name: 'Non-binary', createdById: adminUserId },
];

let checkRecordExists;
checkRecordExists = await prisma.gender.count();
if (checkRecordExists === 0) {
console.log('start seeding gender');
for (const gender of genders) {
await prisma.gender.upsert({
where: { name: gender.name },
update: {},
create: gender,
});  }
console.log('Genders seeded ');
}


checkRecordExists = await prisma.country.count();
if (checkRecordExists === 0) {
// === Seed Countries ===
// Using @unique on name prevents duplicates
const countries = [
{ name: 'Afghanistan' },
{ name: 'Albania'},
{ name: 'Algeria'},
{ name: 'United States'},
{ name: 'Andorra'},
{ name: 'Angola'},
{ name: 'Argentina'},
{ name: 'Armenia'},
{ name: 'Australia'},
{ name: 'Austria'},
{ name: 'Azerbaijan'},
{ name: 'Bahamas'},
{ name: 'Bahrain'},
{ name: 'Bangladesh'},
{ name: 'Barbados'},
{ name: 'Belgium'},
{ name: 'Brazil'},
{ name: 'United Kingdom'},
{ name: 'Bulgaria'},
{ name: 'Burkina Faso'},
{ name: 'Myanmar'},
{ name: 'Cambodia'},
{ name: 'Cameroon'},
{ name: 'Canada'},
{ name: 'Chile'},
{ name: 'China'},
{ name: 'Colombia'},
{ name: 'Congo'},
{ name: 'Costa Rica'},
{ name: 'Croatia'},
{ name: 'Cuba'},
{ name: 'Czech Republic'},
{ name: 'Denmark'},
{ name: 'Netherlands'},
{ name: 'Ecuador'},
{ name: 'Egypt'},
{ name: 'United Arab Emirates'},
{ name: 'Estonia'},
{ name: 'Ethiopia'},
{ name: 'Philippines'},
{ name: 'Finland'},
{ name: 'France'},
{ name: 'Gambia'},
{ name: 'Georgia'},
{ name: 'Germany'},
{ name: 'Ghana'},
{ name: 'Greece'},
{ name: 'Guatemala'},
{ name: 'Haiti'},
{ name: 'Honduras'},
{ name: 'Hungary'},
{ name: 'Iceland'},
{ name: 'India'},
{ name: 'Indonesia'},
{ name: 'Iran'},
{ name: 'Iraq'},
{ name: 'Ireland'},
{ name: 'Israel'},
{ name: 'Italy'},
{ name: 'Jamaica'},
{ name: 'Japan'},
{ name: 'Jordan'},
{ name: 'Kazakhstan'},
{ name: 'Kenya'},
{ name: 'South Korea'},
{ name: 'Kuwait'},
{ name: 'Latvia'},
{ name: 'Lebanon'},
{ name: 'Libya'},
{ name: 'Lithuania'},
{ name: 'Malaysia'},
{ name: 'Mexico'},
{ name: 'Morocco'},
{ name: 'Nepal'},
{ name: 'New Zealand'},
{ name: 'Nigeria'},
{ name: 'Norway'},
{ name: 'Oman'},
{ name: 'Pakistan'},
{ name: 'Panama'},
{ name: 'Peru'},
{ name: 'Poland'},
{ name: 'Portugal'},
{ name: 'Qatar'},
{ name: 'Romania'},
{ name: 'Russia'},
{ name: 'Saudi Arabia'},
{ name: 'Scotland'},
{ name: 'Senegal'},
{ name: 'Serbia'},
{ name: 'Singapore'},
{ name: 'Slovakia'},
{ name: 'Somalia'},
{ name: 'South Africa'},
{ name: 'Spain'},
{ name: 'Sri Lanka'},
{ name: 'Sudan'},
{ name: 'Sweden'},
{ name: 'Switzerland'},
{ name: 'Syria'},
{ name: 'Taiwan'},
{ name: 'Tanzania'},
{ name: 'Thailand'},
{ name: 'Tunisia'},
{ name: 'Turkey'},
{ name: 'Uganda'},
{ name: 'Ukraine'},
{ name: 'Uruguay'},
{ name: 'Venezuela'},
{ name: 'Vietnam'},
{ name: 'Wales'},
{ name: 'Yemen'},
{ name: 'Zambia'},
{ name: 'Zimbabwe'},
];

for (const country of countries) {
await prisma.country.upsert({
where: { name: country.name },
update: {},
create: country,
});
}
console.log('countries seeded ');
}

checkRecordExists = await prisma.nigeriaState.count();
if (checkRecordExists === 0) {
console.log('start seeding nigeriaState');

const statesAndLgas = [
  {
    name: 'FCT-Abuja',
    lgas: [
      'Abaji',
      'Abuja Municipal',
      'Bwari',
      'Gwagwalada',
      'Kuje',
      'Kwali',
    ],
  },
  
  {
    name: 'Imo',
    lgas: [
      'Aboh Mbaise',
      'Ahiazu Mbaise',
      'Ehime Mbano',
      'Ezinihitte',
      'Ideato North',
      'Ideato South',
      'Ihitte/Uboma',
      'Ikeduru',
      'Isiala Mbano',
      'Isu',
      'Mbaitoli',
      'Ngor Okpala',
      'Njaba',
      'Nkwerre',
      'Nwangele',
      'Obowo',
      'Oguta',
      'Ohaji/Egbema',
      'Okigwe',
      'Orlu',
      'Orsu',
      'Oru East',
      'Oru West',
      'Owerri Municipal',
      'Owerri North',
      'Owerri West',
      'Unuimo',
    ],
  },
  
  {
    name: 'Rivers',
    lgas: [
      'Abua/Odual',
      'Ahoada East',
      'Ahoada West',
      'Akuku Toru',
      'Andoni',
      'Asari Toru',
      'Bonny',
      'Degema',
      'Eleme',
      'Emohua',
      'Etche',
      'Gokana',
      'Ikwerre',
      'Khana',
      'Obio/Akpor',
      'Ogba/Egbema/Ndoni',
      'Ogu/Bolo',
      'Okrika',
      'Omuma',
      'Opobo/Nkoro',
      'Oyigbo',
      'Port Harcourt',
      'Tai',
    ],
  },
  /*
  {
    name: 'Abia',
    lgas: [
      'Aba North',
      'Aba South',
      'Arochukwu',
      'Bende',
      'Ikwuano',
      'Isiala Ngwa North',
      'Isiala Ngwa South',
      'Isuikwuato',
      'Obi Ngwa',
      'Ohafia',
      'Osisioma Ngwa',          // corrected/standardized from 'Osisioma'
      'Ugwunagbo',
      'Ukwa East',
      'Ukwa West',
      'Umuahia North',
      'Umuahia South',
      'Umu Nneochi',
    ],
  },
  {
    name: 'Adamawa',
    lgas: [
      'Demsa',
      'Fufore',                 // corrected from common typos like 'Fufure'
      'Ganye',
      'Girei',                  // corrected from 'Grie' or 'Gire'
      'Gombi',
      'Guyuk',
      'Hong',
      'Jada',
      'Lamurde',
      'Madagali',
      'Maiha',
      'Mayo Belwa',
      'Michika',
      'Mubi North',
      'Mubi South',
      'Numan',
      'Shelleng',
      'Song',
      'Toungo',
      'Yola North',
      'Yola South',
    ],
  },
  {
    name: 'Akwa Ibom',
    lgas: [
      'Abak',
      'Eastern Obolo',
      'Eket',
      'Esit Eket',
      'Essien Udim',
      'Etim Ekpo',
      'Etinan',
      'Ibeno',
      'Ibesikpo Asutan',
      'Ibiono Ibom',
      'Ika',
      'Ikono',
      'Ikot Abasi',
      'Ikot Ekpene',
      'Ini',
      'Itu',
      'Mbo',
      'Mkpat Enin',
      'Nsit Atai',
      'Nsit Ibom',
      'Nsit Ubium',
      'Obot Akara',
      'Okobo',
      'Onna',
      'Oron',
      'Oruk Anam',
      'Udung Uko',
      'Ukanafun',
      'Uruan',
      'Urue Offong/Oruko',
      'Uyo',
    ],
  },
  {
    name: 'Anambra',
    lgas: [
      'Aguata',
      'Anambra East',
      'Anambra West',
      'Anaocha',
      'Awka North',
      'Awka South',
      'Ayamelum',
      'Dunukofia',
      'Ekwusigo',
      'Idemili North',
      'Idemili South',
      'Ihiala',
      'Njikoka',
      'Nnewi North',
      'Nnewi South',
      'Ogbaru',
      'Onitsha North',
      'Onitsha South',
      'Orumba North',
      'Orumba South',
      'Oyi',
    ],
  },
  {
    name: 'Bauchi',
    lgas: [
      'Alkaleri',
      'Bauchi',
      'Bogoro',
      'Damban',
      'Darazo',
      'Dass',
      'Ganjuwa',                // standardized
      'Giade',
      'Itas/Gadau',
      'Jamaare',
      'Katagum',
      'Kirfi',
      'Misau',
      'Ningi',
      'Shira',
      'Tafawa Balewa',
      'Toro',
      'Warji',
      'Zaki',
    ],
  },
  {
    name: 'Bayelsa',
    lgas: [
      'Brass',
      'Ekeremor',
      'Kolokuma/Opokuma',
      'Nembe',
      'Ogbia',
      'Sagbama',
      'Southern Ijaw',
      'Yenagoa',
    ],
  },
  {
    name: 'Benue',
    lgas: [
      'Ado',
      'Agatu',
      'Apa',
      'Buruku',
      'Gboko',
      'Guma',
      'Gwer East',
      'Gwer West',
      'Katsina Ala',
      'Konshisha',
      'Kwande',
      'Logo',
      'Makurdi',
      'Obi',
      'Ogbadibo',
      'Oju',
      'Okpokwu',
      'Ohimini',
      'Oturkpo',
      'Tarka',
      'Ukum',
      'Ushongo',
      'Vandeikya',
    ],
  },
  {
    name: 'Borno',
    lgas: [
      'Abadam',
      'Askira/Uba',
      'Bama',
      'Bayo',
      'Biu',
      'Chibok',
      'Damboa',
      'Dikwa',
      'Gubio',
      'Guzamala',
      'Gwoza',
      'Hawul',
      'Jere',
      'Kaga',
      'Kala/Balge',
      'Konduga',
      'Kukawa',
      'Kwaya Kusar',
      'Mafa',
      'Magumeri',
      'Maiduguri',
      'Marte',
      'Mobbar',
      'Monguno',
      'Ngala',
      'Nganzai',
      'Shani',
    ],
  },
  {
    name: 'Cross River',
    lgas: [
      'Abi',
      'Akamkpa',
      'Akpabuyo',
      'Bakassi',
      'Bekwarra',
      'Biase',
      'Boki',
      'Calabar Municipal',
      'Calabar South',
      'Etung',
      'Ikom',
      'Obanliku',
      'Obubra',
      'Obudu',
      'Odukpani',
      'Ogoja',
      'Yakuur',
      'Yala',
    ],
  },
  {
    name: 'Delta',
    lgas: [
      'Aniocha North',
      'Aniocha South',
      'Bomadi',
      'Burutu',
      'Ethiope East',
      'Ethiope West',
      'Ika North East',
      'Ika South',
      'Isoko North',
      'Isoko South',
      'Ndokwa East',
      'Ndokwa West',
      'Okpe',
      'Oshimili North',
      'Oshimili South',
      'Patani',
      'Sapele',
      'Udu',
      'Ughelli North',
      'Ughelli South',
      'Ukwuani',
      'Uvwie',
      'Warri North',
      'Warri South',
      'Warri South West',
    ],
  },
  {
    name: 'Ebonyi',
    lgas: [
      'Abakaliki',
      'Afikpo North',
      'Afikpo South (Edda)',
      'Ebonyi',
      'Ezza North',
      'Ezza South',
      'Ikwo',
      'Ishielu',
      'Ivo',
      'Izzi',
      'Ohaozara',
      'Ohaukwu',
      'Onicha',
    ],
  },
  {
    name: 'Enugu',
    lgas: [
      'Aninri',
      'Awgu',
      'Enugu East',
      'Enugu North',
      'Enugu South',
      'Ezeagu',
      'Igbo Etiti',
      'Igbo Eze North',
      'Igbo Eze South',
      'Isi Uzo',
      'Nkanu East',
      'Nkanu West',
      'Nsukka',
      'Oji River',
      'Udenu',
      'Udi',
      'Uzo Uwani',
    ],
  },
  {
    name: 'Edo',
    lgas: [
      'Akoko Edo',
      'Egor',
      'Esan Central',
      'Esan North East',
      'Esan South East',
      'Esan West',
      'Etsako Central',
      'Etsako East',
      'Etsako West',
      'Igueben',
      'Ikpoba Okha',
      'Oredo',
      'Orhionmwon',
      'Ovia North East',
      'Ovia South West',
      'Owan East',
      'Owan West',
      'Uhunmwonde',
    ],
  },
  {
    name: 'Ekiti',
    lgas: [
      'Ado Ekiti',
      'Efon',
      'Ekiti East',
      'Ekiti South West',
      'Ekiti West',
      'Emure',
      'Gbonyin (Aiyekire)',
      'Ido Osi',
      'Ijero',
      'Ikare',
      'Ikole',
      'Ilejemeje',
      'Irepodun/Ifelodun',
      'Ise/Orun',
      'Moba',
      'Oye',
    ],
  },
  {
    name: 'Gombe',
    lgas: [
      'Akko',
      'Balanga',
      'Billiri',
      'Dukku',
      'Funakaye',
      'Gombe',
      'Kaltungo',
      'Kwami',
      'Nafada/Bajoga',
      'Shongom',
      'Yamaltu/Deba',
    ],
  },
  {
    name: 'Jigawa',
    lgas: [
      'Auyo',
      'Babura',
      'Biriniwa',
      'Birnin Kudu',
      'Buji',
      'Dutse',
      'Gagarawa',
      'Garki',
      'Gumel',
      'Guri',
      'Gwaram',
      'Gwiwa',
      'Hadejia',
      'Jahun',
      'Kafin Hausa',
      'Kaugama',
      'Kazaure',
      'Kiri Kasama',
      'Kiyawa',
      'Maigatari',
      'Malam Madori',
      'Miga',
      'Ringim',
      'Roni',
      'Sule Tankarkar',
      'Taura',
      'Yankwashi',
    ],
  },
  {
    name: 'Kaduna',
    lgas: [
      'Birnin Gwari',
      'Chikun',
      'Giwa',
      'Igabi',
      'Ikara',
      'Jaba',
      "Jema'a",
      'Kachia',
      'Kaduna North',
      'Kaduna South',
      'Kagarko',
      'Kajuru',
      'Kaura',
      'Kauru',
      'Kubau',
      'Kudan',
      'Lere',
      'Makarfi',
      'Sabon Gari',
      'Sanga',
      'Soba',
      'Zangon Kataf',
      'Zaria',
    ],
  },
  {
    name: 'Kano',
    lgas: [
      'Albasu',
      'Bagwai',
      'Bebeji',
      'Bichi',
      'Bunkure',
      'Dala',
      'Dambatta',
      'Dawakin Kudu',
      'Dawakin Tofa',
      'Doguwa',
      'Fagge',
      'Gabasawa',
      'Garko',
      'Garun Mallam',
      'Gaya',
      'Gezawa',
      'Gwale',
      'Gwarzo',
      'Kabo',
      'Kano Municipal',
      'Karaye',
      'Kibiya',
      'Kiru',
      'Kumbotso',
      'Kunchi',
      'Kura',
      'Madobi',
      'Makoda',
      'Malam Madori',
      'Minjibir',
      'Nasarawa',
      'Rano',
      'Rimin Gado',
      'Rogo',
      'Shanono',
      'Sumaila',
      'Takai',
      'Tarauni',
      'Tofa',
      'Tsanyawa',
      'Tudun Wada',
      'Ungogo',
      'Warawa',
      'Wudil',
    ],
  },
  {
    name: 'Katsina',
    lgas: [
      'Bakori',
      'Batagarawa',
      'Batsari',
      'Baure',
      'Bindawa',
      'Charanchi',
      'Dandume',
      'Danja',
      'Dan Musa',
      'Daura',
      'Dutsi',
      'Dutsin Ma',
      'Faskari',
      'Funtua',
      'Ingawa',
      'Jibia',
      'Kafur',
      'Kaita',
      'Kankara',
      'Kankia',
      'Katsina',
      'Kurfi',
      'Kusada',
      "Mai'Adua",
      'Malumfashi',
      'Mani',
      'Mashi',
      'Matazu',
      'Musawa',
      'Rimi',
      'Sabuwa',
      'Safana',
      'Sandamu',
      'Zango',
    ],
  },
  {
    name: 'Kebbi',
    lgas: [
      'Aleiro',
      'Arewa Dandi',
      'Argungu',
      'Augie',
      'Bagudo',
      'Birnin Kebbi',
      'Bunza',
      'Dandi',
      'Fakai',
      'Gwandu',
      'Jega',
      'Kalgo',
      'Koko/Besse',
      'Maiyama',
      'Ngaski',
      'Sakaba',
      'Shanga',
      'Suru',
      'Wasagu/Danko',
      'Yauri',
      'Zuru',
    ],
  },
  {
    name: 'Kogi',
    lgas: [
      'Adavi',
      'Ajaokuta',
      'Ankpa',
      'Bassa',
      'Dekina',
      'Ibaji',
      'Idah',
      'Igalamela Odolu',
      'Ijumu',
      'Kabba/Bunu',
      'Koton Karfe',
      'Lokoja',
      'Mopa Muro',
      'Ofu',
      'Ogori/Magongo',
      'Okehi',
      'Okene',
      'Olamaboro',
      'Omala',
      'Yagba East',
      'Yagba West',
    ],
  },
  {
    name: 'Kwara',
    lgas: [
      'Asa',
      'Baruten',
      'Edu',
      'Ekiti',
      'Ifelodun',
      'Ilorin East',
      'Ilorin South',
      'Ilorin West',
      'Irepodun',
      'Isin',
      'Kaiama',
      'Moro',
      'Offa',
      'Oke Ero',
      'Oyun',
      'Pategi',
    ],
  },
  {
    name: 'Lagos',
    lgas: [
      'Agege',
      'Ajeromi Ifelodun',
      'Alimosho',
      'Amuwo Odofin',
      'Apapa',
      'Badagry',
      'Epe',
      'Eti Osa',
      'Ibeju Lekki',
      'Ifako Ijaiye',
      'Ikeja',
      'Ikorodu',
      'Kosofe',
      'Lagos Island',
      'Lagos Mainland',
      'Mushin',
      'Ojo',
      'Oshodi Isolo',
      'Shomolu',
      'Surulere',
    ],
  },
  {
    name: 'Nasarawa',
    lgas: [
      'Awe',
      'Doma',
      'Karu',
      'Keana',
      'Keffi',
      'Kokona',
      'Lafia',
      'Nasarawa',
      'Nasarawa Egon',
      'Obi',
      'Toto',
      'Wamba',
    ],
  },
  {
    name: 'Niger',
    lgas: [
      'Agaie',
      'Agwara',
      'Bida',
      'Borgu',
      'Bosso',
      'Chanchaga',
      'Edati',
      'Gbako',
      'Gurara',
      'Katcha',
      'Kontagora',
      'Lapai',
      'Lavun',
      'Magama',
      'Mariga',
      'Mashegu',
      'Mokwa',
      'Muya',
      'Paikoro',
      'Rafi',
      'Rijau',
      'Shiroro',
      'Suleja',
      'Tafa',
      'Wushishi',
    ],
  },
  {
    name: 'Ogun',
    lgas: [
      'Abeokuta North',
      'Abeokuta South',
      'Ado Odo/Ota',
      'Ewekoro',
      'Ifo',
      'Ijebu East',
      'Ijebu North',
      'Ijebu North East',
      'Ijebu Ode',
      'Ikenne',
      'Imeko Afon',
      'Ipokia',
      'Obafemi Owode',
      'Odeda',
      'Odogbolu',
      'Ogun Waterside',
      'Remo North',
      'Sagamu',
      'Yewa North',
      'Yewa South',
    ],
  },
  {
    name: 'Ondo',
    lgas: [
      'Akoko North East',
      'Akoko North West',
      'Akoko South East',
      'Akoko South West',
      'Akure North',
      'Akure South',
      'Ese Odo',
      'Idanre',
      'Ifedore',
      'Ilaje',
      'Ile Oluji/Okeigbo',
      'Irele',
      'Odigbo',
      'Okitipupa',
      'Ondo East',
      'Ondo West',
      'Ose',
      'Owo',
    ],
  },
  {
    name: 'Osun',
    lgas: [
      'Atakunmosa East',
      'Atakunmosa West',
      'Aiyedaade',
      'Aiyedire',
      'Boluwaduro',
      'Boripe',
      'Ede North',
      'Ede South',
      'Egbedore',
      'Ejigbo',
      'Ife Central',
      'Ife East',
      'Ife North',
      'Ife South',
      'Ifedayo',
      'Ifelodun',
      'Ila',
      'Ilesa East',
      'Ilesa West',
      'Irepodun',
      'Irewole',
      'Isokan',
      'Iwo',
      'Obokun',
      'Odo Otin',
      'Ola Oluwa',
      'Olorunda',
      'Oriade',
      'Orolu',
      'Osogbo',
    ],
  },
  {
    name: 'Oyo',
    lgas: [
      'Akinyele',
      'Afijio',
      'Atiba',
      'Atisbo',
      'Egbeda',
      'Ibadan North',
      'Ibadan North East',
      'Ibadan North West',
      'Ibadan South East',
      'Ibadan South West',
      'Ibarapa Central',
      'Ibarapa East',
      'Ibarapa North',
      'Ido',
      'Irepo',
      'Iseyin',
      'Itesiwaju',
      'Iwajowa',
      'Kajola',
      'Lagelu',
      'Ogbomoso North',
      'Ogbomoso South',
      'Ogo Oluwa',
      'Olorunsogo',
      'Oluyole',
      'Ona Ara',
      'Orelope',
      'Ori Ire',
      'Oyo East',
      'Oyo West',
      'Saki East',
      'Saki West',
      'Surulere',
    ],
  },
  {
    name: 'Plateau',
    lgas: [
      'Barkin Ladi',
      'Bassa',
      'Bokkos',
      'Jos East',
      'Jos North',
      'Jos South',
      'Kanam',
      'Kanke',
      'Langtang North',
      'Langtang South',
      'Mangu',
      'Mikang',
      'Pankshin',
      'Qua’an Pan',
      'Riyom',
      'Shendam',
      'Wase',
    ],
  },
  {
    name: 'Sokoto',
    lgas: [
      'Binji',
      'Bodinga',
      'Dange Shuni',
      'Gada',
      'Goronyo',
      'Gudu',
      'Gwadabawa',
      'Illela',
      'Isa',
      'Kebbe',
      'Kware',
      'Rabah',
      'Sabon Birni',
      'Shagari',
      'Silame',
      'Sokoto North',
      'Sokoto South',
      'Tambuwal',
      'Tangaza',
      'Tureta',
      'Wamako',
      'Wurno',
      'Yabo',
    ],
  },
  {
    name: 'Taraba',
    lgas: [
      'Ardo Kola',
      'Bali',
      'Donga',
      'Gashaka',
      'Gassol',
      'Ibi',
      'Jalingo',
      'Karim Lamido',
      'Kumi',
      'Lau',
      'Sardauna',
      'Takum',
      'Ussa',
      'Wukari',
      'Yorro',
      'Zing',
    ],
  },
  {
    name: 'Yobe',
    lgas: [
      'Bursari',
      'Damaturu',
      'Fika',
      'Fune',
      'Geidam',
      'Gujba',
      'Gulani',
      'Jakusko',
      'Karasuwa',
      'Machina',
      'Nangere',
      'Nguru',
      'Potiskum',
      'Tarmuwa',
      'Yunusari',
      'Yusufari',
    ],
  },
  {
    name: 'Zamfara',
    lgas: [
      'Anka',
      'Bakura',
      'Birnin Magaji/Kiyaw',
      'Bukkuyum',
      'Bungudu',
      'Gummi',
      'Gusau',
      'Kaura Namoda',
      'Maradun',
      'Maru',
      'Namoda',
      'Shinkafi',
      'Talata Mafara',
      'Tsafe',
      'Zurmi',
    ],
  },
  */
];

  for (const stateData of statesAndLgas) {
    // Upsert state (create if not exists)
    const state = await prisma.nigeriaState.upsert({
      where: { name: stateData.name },
      update: {},
      create: { name: stateData.name },
    });

    // Create LGAs for this state
    for (const lgaName of stateData.lgas) {
      await prisma.lga.upsert({
        where: {
          stateId_name: {
            stateId: state.id,
            name: lgaName,
          },
        },
        update: {},
        create: {
          name: lgaName,
          stateId: state.id,
        },
      });
    }
  }

console.log('✅ Nigeria states seeded successfully!');
console.log('lga seeded ');
}

checkRecordExists = await prisma.nationality.count();
if (checkRecordExists === 0) {
console.log('start nationality gender');

// === Seed Nationalities ===
// A reasonable starter list (common ones; expand as needed)
// Using @unique on name prevents duplicates
const nationalities = [
{ name: 'Afghan'},
{ name: 'Albanian'},
{ name: 'Algerian'},
{ name: 'American'},
{ name: 'Andorran'},
{ name: 'Angolan'},
{ name: 'Argentine'},
{ name: 'Armenian'},
{ name: 'Australian'},
{ name: 'Austrian'},
{ name: 'Azerbaijani'},
{ name: 'Bahamian'},
{ name: 'Bahraini'},
{ name: 'Bangladeshi'},
{ name: 'Barbadian'},
{ name: 'Belgian'},
{ name: 'Brazilian'},
{ name: 'British'},
{ name: 'Bulgarian'},
{ name: 'Burkinabe'},
{ name: 'Burmese'},
{ name: 'Cambodian'},
{ name: 'Cameroonian'},
{ name: 'Canadian'},
{ name: 'Chilean'},
{ name: 'Chinese'},
{ name: 'Colombian'},
{ name: 'Congolese'},
{ name: 'Costa Rican'},
{ name: 'Croatian'},
{ name: 'Cuban'},
{ name: 'Czech'},
{ name: 'Danish'},
{ name: 'Dutch'},
{ name: 'Ecuadorian'},
{ name: 'Egyptian'},
{ name: 'Emirati'},
{ name: 'English'}, // or British
{ name: 'Estonian'},
{ name: 'Ethiopian'},
{ name: 'Filipino'},
{ name: 'Finnish'},
{ name: 'French'},
{ name: 'Gambian'},
{ name: 'Georgian'},
{ name: 'German'},
{ name: 'Ghanaian'},
{ name: 'Greek'},
{ name: 'Guatemalan'},
{ name: 'Haitian'},
{ name: 'Honduran'},
{ name: 'Hungarian'},
{ name: 'Icelandic'},
{ name: 'Indian'},
{ name: 'Indonesian'},
{ name: 'Iranian'},
{ name: 'Iraqi'},
{ name: 'Irish'},
{ name: 'Israeli'},
{ name: 'Italian'},
{ name: 'Jamaican'},
{ name: 'Japanese'},
{ name: 'Jordanian'},
{ name: 'Kazakh'},
{ name: 'Kenyan'},
{ name: 'Korean'},
{ name: 'Kuwaiti'},
{ name: 'Latvian'},
{ name: 'Lebanese'},
{ name: 'Libyan'},
{ name: 'Lithuanian'},
{ name: 'Malaysian'},
{ name: 'Mexican'},
{ name: 'Moroccan'},
{ name: 'Nepalese'},
{ name: 'New Zealander'},
{ name: 'Nigerian'},
{ name: 'Norwegian'},
{ name: 'Omani'},
{ name: 'Pakistani'},
{ name: 'Panamanian'},
{ name: 'Peruvian'},
{ name: 'Polish'},
{ name: 'Portuguese'},
{ name: 'Qatari'},
{ name: 'Romanian'},
{ name: 'Russian'},
{ name: 'Saudi'},
{ name: 'Scottish'},
{ name: 'Senegalese'},
{ name: 'Serbian'},
{ name: 'Singaporean'},
{ name: 'Slovak'},
{ name: 'Somali'},
{ name: 'South African'},
{ name: 'Spanish'},
{ name: 'Sri Lankan'},
{ name: 'Sudanese'},
{ name: 'Swedish'},
{ name: 'Swiss'},
{ name: 'Syrian'},
{ name: 'Taiwanese'},
{ name: 'Tanzanian'},
{ name: 'Thai'},
{ name: 'Tunisian'},
{ name: 'Turkish'},
{ name: 'Ugandan'},
{ name: 'Ukrainian'},
{ name: 'Uruguayan'},
{ name: 'Venezuelan'},
{ name: 'Vietnamese'},
{ name: 'Welsh'},
{ name: 'Yemeni'},
{ name: 'Zambian'},
{ name: 'Zimbabwean'},
];

for (const nat of nationalities) {
await prisma.nationality.upsert({
where: { name: nat.name },
update: {},
create: nat,
});
}
console.log('Nationalities seeded ✅');
}

/*
checkRecordExists = await prisma.beneficiary.count();
if (checkRecordExists === 0) {
console.log('start seeding beneficiary');

console.log("Seeding Beneficiaries...");

const gendersB = await prisma.gender.findMany({ select: { id: true, name: true } });
const states = await prisma.nigeriaState.findMany({ select: { id: true, name: true } });

console.log("Checking Beneficiaries table...");

const existingBeneficiaries = await prisma.beneficiary.count();

if (existingBeneficiaries > 0) {
console.log(`→ Found ${existingBeneficiaries} existing beneficiary records. Skipping beneficiary seeding.`);
// Do NOT exit — just continue to the next part of your seed script
// You can return here if this is inside an async function, or just let it fall through
} else {
console.log('🌱 Seeding 25 Beneficiaries...');

const genders = await prisma.gender.findMany();
// Filter states to only Abuja, Imo, Rivers
const states = await prisma.nigeriaState.findMany({
where: { name: { in: ['FCT', 'Imo', 'Rivers'] } },
});
const adminUser = await prisma.user.findFirst();

if (!genders.length || !states.length) {
throw new Error('Gender table or allowed states are empty');
}

for (let i = 1; i <= 25; i++) {
const firstName = randomItem(firstNames);
const lastName = randomItem(lastNames);
const gender = randomItem(genders);
const state = randomItem(states);

await prisma.beneficiary.upsert({
where: { benId: `BEN-${String(i).padStart(4, '0')}` },
update: {},
create: {
benId: `BEN-${String(i).padStart(4, '0')}`,
name: `${firstName} ${lastName}`,
phone: randomPhone(i),
address: `${Math.floor(Math.random() * 200)} Main Street`,
city: state.name,
dob: randomDate(),

genderId: gender.id,
stateId: state.id,
avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 61) + 30}`,

beneficiaryType: randomItem([
BeneficiaryType.WIDOW,
BeneficiaryType.ORPHAN,
BeneficiaryType.HOUSEHOLD,
]),

createdById: adminUser?.id,
},
});
}

console.log('✅ 25 Beneficiaries seeded successfully (Abuja, Imo, Rivers only)');
}

console.log('beneficiary seeded ');
}
*/

/*
checkRecordExists = await prisma.vacancy.count();
if (checkRecordExists === 0) {
console.log('start seeding vacancy');

// ────────────────────────────────────────────────
// Seed Vacancies
// ────────────────────────────────────────────────
await prisma.vacancy.createMany({
data: [
{
name: "Default Vacancy",
createdById: adminUserId,
startDate: new Date("2025-12-01"),
endDate: new Date("2026-12-01"),
requirements:
"Default placeholder vacancy for testing and onboarding.",
createdAt: new Date("2025-12-01"),
},
{
name: "Senior Software Engineer (Backend)",
createdById: adminUserId,
startDate: new Date("2026-01-15"),
endDate: new Date("2026-04-15"),
requirements:
"Strong experience with Node.js, TypeScript, Prisma, and NestJS. Experience building scalable APIs required.",
createdAt: new Date("2026-01-15"),
},
{
name: "Financial Analyst",
createdById: adminUserId,
startDate: new Date("2026-02-01"),
endDate: new Date("2026-05-01"),
requirements:
"Financial modelling expertise, advanced Excel skills, and CFA qualification preferred.",
createdAt: new Date("2026-02-01"),
},
{
name: "Digital Marketing Specialist",
createdById: adminUserId,
startDate: new Date("2025-11-20"),
endDate: new Date("2026-02-20"),
requirements:
"Experience in SEO, Google Ads, analytics, and social media strategy execution.",
createdAt: new Date("2025-11-20"),
},
],
skipDuplicates: true,
});

console.log('vacancy seeded ');
}

*/
checkRecordExists = await prisma.jobLevel.count();
if (checkRecordExists === 0) {
console.log('Seeding jobLevels...');
const gradeLevels = await Promise.all([
prisma.jobLevel.create({
data: {
code: "GL-03",
name: "Officer",
}
}),
prisma.jobLevel.create({
data: {
code: "GL-06",
name: "Senior Officer",
}
}),
prisma.jobLevel.create({
data: {
code: "GL-09",
name: "Manager",
}
}),
prisma.jobLevel.create({
data: {
code: "GL-12",
name: "Director",
}
})
]);

console.log('Job Levels seeded successfully.');
}

checkRecordExists = await prisma.marritalStatus.count();
if (checkRecordExists === 0) {
console.log('start seeding marritalStatus');

console.log('✅ Beggining seeding of marrital status.')

// ✅ Skip if already seeded
const existingMarritalCount = await prisma.marritalStatus.count()
if (existingMarritalCount === 0) {

const statuses = [
{ name: 'Single' },
{ name: 'Married' },
{ name: 'Divorced' },
{ name: 'Separated' },
{ name: 'Widowed' },
{ name: 'Engaged' },
{ name: 'Prefer Not to Say' }
]

await prisma.marritalStatus.createMany({
data: statuses.map(status => ({
...status,
createdById: adminUserId
}))
})
}
console.log('✅ Marrital statuses seeded successfully.')
console.log('marritalStatus seeded ');
}

/*
checkRecordExists = await prisma.applicationform.count();
if (checkRecordExists === 0) {
console.log('start seeding applicationform');

console.log('Seeding Application Forms...');
// 1. Check if we already have records
const existingCount = await prisma.applicationform.count();
if (existingCount === 0) {
// Fetch required related records
const gendersApp = await prisma.gender.findMany({ select: { id: true, name: true }, take: 3 });
const maritalStatuses = await prisma.marritalStatus.findMany({ select: { id: true, name: true }, take: 4 });
const statesApp = await prisma.nigeriaState.findMany({ select: { id: true, name: true }, take: 6 });
const vacancies = await prisma.vacancy.findMany({ select: { id: true, name: true }, take: 6 });

if (gendersApp.length === 0 || maritalStatuses.length === 0 || statesApp.length === 0 || vacancies.length === 0) {
console.warn(
'Cannot seed Applicationform: missing required related data (Gender, MarritalStatus, NigeriaState, Vacancy)'
);
return;
} else {

const randomFrom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];

const firstNamesMale = [
'Adebayo', 'Chukwuma', 'Oluwaseun', 'Ibrahim', 'Tunde', 'Emeka', 'Yusuf', 'Kehinde', 'Bolaji', 'Taiwo',
];
const firstNamesFemale = [
'Aisha', 'Fatima', 'Oluwatoyin', 'Chioma', 'Aminat', 'Yetunde', 'Zainab', 'Adesola', 'Funmilayo', 'Ngozi',
];
const lastNames = [
'Adeyemi', 'Okeke', 'Ogunleye', 'Abdullahi', 'Lawal', 'Eze', 'Afolabi', 'Ibrahim', 'Ojo', 'Akinola',
];
const middleNames = ['Oluwafemi', 'Chidinma', 'Babatunde', 'Aishat', 'Olumide', null, null, null];

const applications = Array.from({ length: 20 }, (_, i) => {
const index = i + 1;
const isMale = i % 2 === 0;
const gender = randomFrom(gendersApp);
const marital = randomFrom(maritalStatuses);
const state = randomFrom(statesApp);
const vacancy = randomFrom(vacancies);

const fname = isMale
? randomFrom(firstNamesMale)
: randomFrom(firstNamesFemale);

const lname = randomFrom(lastNames);
const mname = randomFrom(middleNames);

const fullNameForLogging = [fname, mname, lname].filter(Boolean).join(' ');

return {
fname,
lname,
mname: mname || null,

status: EmploymentStatus.JOB_APPLICANT,

vacancyId: vacancy.id,

title: isMale ? 'Mr.' : 'Ms.',
dateOfBirth: new Date(1988 + Math.floor(Math.random() * 18), Math.floor(Math.random() * 12) + 1, 5),

genderId: gender.id,
marritalStatusId: marital.id,
stateId: state.id,

nationality: 'Nigerian',
email: `applicant${index}@example.com`,
phoneNumber: `0803${(2000000 + i * 123).toString().padStart(7, '0')}`,
alternatePhone: `0708${(3000000 + i * 147).toString().padStart(7, '0')}`,

address: `${12 + i} Allen Avenue`,
city: 'Lagos',
country: 'Nigeria',
postalCode: '100271',

nin: `22${(400000000 + i * 11111).toString().padStart(9, '0')}`,
passportNumber: `A${(500000 + i).toString().padStart(6, '0')}`,

positionApplied: vacancy.name || `Role ${index}`,
availableStartDate: new Date(2026, Math.floor(Math.random() * 8) + 2, 10),
expectedSalary: 280000 + Math.floor(Math.random() * 720000),
willingToRelocate: ['Yes', 'Yes', 'No', 'Depends'][Math.floor(Math.random() * 4)],

technicalSkills: [
'Excel Advanced', 'Power BI', 'Node.js', 'TypeScript', 'PostgreSQL',
'Financial Modelling', 'SEO', 'Google Ads', 'Project Management', 'Data Analysis'
].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 4)).join(', '),

softSkills: [
'Communication', 'Teamwork', 'Problem Solving', 'Adaptability', 'Leadership'
].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3)).join(', '),

computerSkills: [
'MS Office Suite', 'Google Workspace', 'Git', 'VS Code', 'QuickBooks', 'SAP'
].sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 3)).join(', '),

hasDisability: Math.random() < 0.12,
disabilityDetails: Math.random() < 0.12 ? 'Mild visual impairment (uses glasses)' : null,

// JSON fields
education: [
{
institution: randomFrom([
'University of Lagos',
'University of Ibadan',
'Covenant University',
'Lagos State University',
'Ahmadu Bello University',
]),
degree: randomFrom([
'BSc Computer Science',
'BSc Accounting',
'BSc Business Administration',
'BSc Marketing',
'BEng Electrical Engineering',
]),
startYear: 2008 + Math.floor(Math.random() * 8),
endYear: 2012 + Math.floor(Math.random() * 8),
},
{
institution: randomFrom([
'AltSchool Africa',
'Google Career Certificates',
'ICAN',
'Project Management Institute',
'Coursera',
]),
degree: randomFrom([
'Full-Stack Development Bootcamp',
'Professional Accounting Certification',
'Digital Marketing Certificate',
'PMP Certification',
'Data Analysis Professional',
]),
startYear: 2020 + Math.floor(Math.random() * 4),
endYear: 2022 + Math.floor(Math.random() * 3),
},
],

certifications: [
{ name: 'Google Data Analytics', year: 2022 + Math.floor(Math.random() * 3) },
{ name: randomFrom(['PMP', 'ICAN', 'AWS Cloud Practitioner', 'Scrum Master']), year: 2023 + Math.floor(Math.random() * 2) },
],

workExperience: [
{
company: randomFrom([
'Andela',
'KPMG Nigeria',
'Deloitte',
'Interswitch',
'Paystack',
]),
position: randomFrom([
'Software Engineer',
'Financial Analyst',
'Audit Associate',
'Product Manager',
'Marketing Executive',
]),
startDate: '2019-03-01',
endDate: '2022-08-31',
},
{
company: randomFrom([
'Flutterwave',
'Access Bank',
'MTN Nigeria',
'Stanbic IBTC',
'Current Employer',
]),
position: randomFrom([
'Senior Backend Engineer',
'Finance Officer',
'Digital Marketing Specialist',
'Programme Manager',
]),
startDate: '2022-09-01',
endDate: null,
},
],

languages: [
{ language: 'English', proficiency: 'Fluent' },
{ language: 'Yoruba', proficiency: randomFrom(['Native', 'Fluent', 'Intermediate']) },
{ language: randomFrom(['Igbo', 'Hausa']), proficiency: randomFrom(['Basic', 'Intermediate']) },
].filter(() => Math.random() > 0.4),

references: [
{
name: randomFrom([
'Mr. Adewale Johnson',
'Mrs. Chinyere Okonkwo',
'Dr. Fatima Ibrahim',
'Engr. Musa Bello',
]),
relationship: randomFrom(['Former Supervisor', 'HR Manager', 'Colleague', 'Mentor']),
phone: `080${(30000000 + i * 23456).toString().padStart(8, '0')}`,
},
],

cvUrl: 'https://example.com/cv/sample-cv.pdf',
coverLetterUrl: 'https://example.com/cover/sample-cover.pdf',
certificatesUrls: [
'https://example.com/cert/google-data-analytics.pdf',
'https://example.com/cert/pmp-2023.pdf',
],
idDocumentUrl: 'https://example.com/id/nin-sample.pdf',

confirmAccuracy: true,
consentDataProcessing: true,
};
});

await prisma.applicationform.createMany({
data: applications,
skipDuplicates: true,
});

console.log(`→ Successfully seeded ${applications.length} application forms.`);
}}

console.log('applicationform seeded ');
}
*/

checkRecordExists = await prisma.payrollCalendar.count();
if (checkRecordExists === 0) {
console.log("SEEDing  payroll calendar")
await prisma.payrollCalendar.createMany({
  data: [
    {
      name: "Daily Payroll",
      frequency: "DAILY",
      payDay: null,
      description: "Used for day labourers and temporary staff paid daily"
    },
    {
      name: "Weekly Payroll (Friday)",
      frequency: "WEEKLY",
      payDay: 5,
      description: "Employees are paid every Friday"
    },
    {
      name: "Weekly Payroll (Monday)",
      frequency: "WEEKLY",
      payDay: 1,
      description: "Employees are paid every Monday"
    },
    {
      name: "Bi-Weekly Payroll",
      frequency: "BI_WEEKLY",
      payDay: 5,
      description: "Employees are paid every two weeks"
    },
    {
      name: "Semi-Monthly Payroll",
      frequency: "SEMI_MONTHLY",
      payDay: 15,
      description: "Employees are paid twice a month (15th and last day)"
    },
    {
      name: "Monthly Payroll (25th)",
      frequency: "MONTHLY",
      payDay: 25,
      description: "Standard monthly payroll paid on the 25th"
    },
    {
      name: "Monthly Payroll (End of Month)",
      frequency: "MONTHLY",
      payDay: 30,
      description: "Employees are paid on the last day of the month"
    },
    {
      name: "Quarterly Payroll",
      frequency: "QUARTERLY",
      payDay: null,
      description: "Payroll processed every quarter"
    },
    {
      name: "Annual Payroll",
      frequency: "ANNUALLY",
      payDay: null,
      description: "Annual compensation or bonus payments"
    }
  ]
});

console.log("SEEDED payroll calendar")
}


checkRecordExists = await prisma.payrollPeriod.count();
if (checkRecordExists === 0) {
console.log('Seeding payroll periods...');
// 1️⃣ Payroll Periods: Jan - Mar 2026
const periodsData = [
{ name: 'January 2026', start: '2026-01-01', end: '2026-01-31', frequency: 'MONTHLY' },
{ name: 'February 2026', start: '2026-02-01', end: '2026-02-28', frequency: 'MONTHLY' },
{ name: 'March 2026', start: '2026-03-01', end: '2026-03-31', frequency: 'MONTHLY' },
];


const payrollPeriods = [];
// Fetch the calendars once
const calendars = await prisma.payrollCalendar.findMany();

for (const p of periodsData) {
// Example: select a calendar based on a condition or just pick the first one
const calendar = calendars.find((c: any) => c.frequency === p.frequency) ?? calendars[0];
const period = await prisma.payrollPeriod.create({
data: {
name: p.name,
startDate: new Date(p.start),
endDate: new Date(p.end),
// Connect to the selected calendar
calendar: { connect: { id: calendar.id } },
},
});

payrollPeriods.push(period);
}
}

checkRecordExists = await prisma.payrollPeriod.count();
if (checkRecordExists === 0) {
console.log('Seeding payroll periods...');
// 1️⃣ Payroll Periods: Jan - Mar 2026
const periodsData = [
{ name: 'January 2026', start: '2026-01-01', end: '2026-01-31', frequency: 'MONTHLY' },
{ name: 'February 2026', start: '2026-02-01', end: '2026-02-28', frequency: 'MONTHLY' },
{ name: 'March 2026', start: '2026-03-01', end: '2026-03-31', frequency: 'MONTHLY' },
];


const payrollPeriods = [];
// Fetch the calendars once
const calendars = await prisma.payrollCalendar.findMany();

for (const p of periodsData) {
// Example: select a calendar based on a condition or just pick the first one
const calendar = calendars.find((c: any) => c.frequency === p.frequency) ?? calendars[0];
const period = await prisma.payrollPeriod.create({
data: {
name: p.name,
startDate: new Date(p.start),
endDate: new Date(p.end),
// Connect to the selected calendar
calendar: { connect: { id: calendar.id } },
},
});

payrollPeriods.push(period);
}


console.log('Seeded payroll periods...');

console.log('start seeding employee');
const empIds = [
'E001', 'E002', 'E003', null, 'E005', 'E006', 'E007', null,
'E009', 'E010', 'E011', null, 'E013', 'E014', 'E015', null,
'E017', 'E018', 'E019', 'E020', null, 'E022', 'E023', 'E024',
'E025', 'E026',
];

for (let i = 0; i < 26; i++) {
let status: EmploymentStatus = 'ACTIVE';
if (Math.random() < 0.12) status = 'TERMINATED';
else if (Math.random() < 0.18) status = 'ON_LEAVE';

const hireDate = new Date();
const monthsBack = 3 + Math.floor(Math.random() * 78);
hireDate.setMonth(hireDate.getMonth() - monthsBack);

let terminationDate: Date | null = null;
if (status === 'TERMINATED' || status === 'ON_LEAVE') {
const durationYears = 0.4 + Math.random() * 4.5;
terminationDate = new Date(hireDate.getTime() + 1000 * 60 * 60 * 24 * 365 * durationYears);
}


// Names (same lists as before)
const firstNames = ["Chidi", "Aisha", "Tunde", "Fatima", "Emeka", "Zainab", "Mohammed", "John" /* ... your full list */];
const lastNames = ["Okeke", "Mohammed", "Adeyemi", "Ibrahim", "Okafor", "Azuka", "Abure" /* ... your full list */];

const fname = firstNames[i % firstNames.length];
const lname = lastNames[i % lastNames.length];
const mname = Math.random() < 0.12 ? "" : null;

const targetEmpId = empIds[i];

try {
// Optional: skip if this empId already exists (prevents P2002)
/*
if (targetEmpId !== null) {
const existing = await prisma.employee.findUnique({
where: { empId: targetEmpId },
});
if (existing) {
console.log(`Skipping employee ${i + 1} — empId ${targetEmpId} already exists`);
continue;
}}

const basicSalary = 150000 + Math.floor(Math.random() * 200000); // ₦150k - ₦350k
const allowances = Math.floor(basicSalary * (0.3 + Math.random() * 0.2)); // 30%-50% of basic
const overtimeRate = 1000 + Math.floor(Math.random() * 2000); // ₦1k - ₦3k per hour
const defaultJobLevel = await prisma.jobLevel.findFirst({ select: { id: true, name: true } });
const salaryBand = await prisma.salaryBand.findFirst({ select: { id: true } });
/*
const newEmployee = await prisma.employee.create({
data: {
createdById: adminUserId,
empId: targetEmpId,        
fname,
lname,
mname,
status,
hireDate,
terminationDate,
// PayrollProfile creation
payrollProfile: {
create: {
basicSalary,
allowances,
overtimeRate,
pensionPercentage: 8,
nhfPercentage: 2.5,
nhisPercentage: 1.5,
taxExemptions: 0,

jobLevelId: defaultJobLevel?.id || (await prisma.jobLevel.findFirst({ select: { id: true } }))?.id || '',
salaryBandId: salaryBand?.id || (await prisma.salaryBand.findFirst({ select: { id: true } }))?.id || '',
stepNumber: 1,
},
},
// personId is now optional in your latest schema — if you want to link it, add it here
// personId: someUserIdArray[i], // ← only if you have matching users ready
},
});
*/

// ────────────────────────────────────────────────
// Seed Shift patterns (if not already present)
// ────────────────────────────────────────────────
checkRecordExists = await prisma.shift.count();
if (checkRecordExists === 0) {
console.log('Seeding sample shifts...');

const shifts = [
{
name: 'Morning Shift',
startTime: new Date(0, 0, 0, 7, 0),   // 07:00
endTime:   new Date(0, 0, 0, 15, 0),  // 15:00
description: 'Standard day shift - office & field',
},
{
name: 'Afternoon Shift',
startTime: new Date(0, 0, 0, 13, 0),  // 13:00
endTime:   new Date(0, 0, 0, 21, 0),  // 21:00
},
{
name: 'Night Shift',
startTime: new Date(0, 0, 0, 21, 0),  // 21:00
endTime:   new Date(0, 0, 0, 7, 0, 0, 1), // next day 07:00
},
{
name: '12-Hour Day',
startTime: new Date(0, 0, 0, 7, 0),
endTime:   new Date(0, 0, 0, 19, 0),
},
];

/*
const createdShifts = await prisma.shift.createMany({
data: shifts.map(s => ({
...s,
createdById: adminUserId,
})),
skipDuplicates: true,
});
*/
// Assign ~60% of employees to a shift (random)
const employees = await prisma.employee.findMany({ select: { id: true } });
const shiftRecords = [];

for (const emp of employees) {
if (Math.random() > 0.4) {  // 60% get a shift
const shift = shifts[Math.floor(Math.random() * shifts.length)];
const dbShift = await prisma.shift.findFirst({ where: { name: shift.name } });
if (dbShift) {
shiftRecords.push({
employeeId: emp.id,
shiftId: dbShift.id,
effectiveFrom: new Date('2025-12-01'),
createdById: adminUserId,
});
}
}
}

/*
if (shiftRecords.length > 0) {
await prisma.shiftEmployee.createMany({
data: shiftRecords,
skipDuplicates: true,
});
}
*/
console.log(`Seeded ${shifts.length} shift patterns + ${shiftRecords.length} assignments`);
}


console.log(`seed attandane`);
// 3️⃣ Create AttendanceSummary for each period
for (const period of payrollPeriods) {
const workingDays = 22;
const absentDays = Math.floor(Math.random() * 3); // 0-2
const overtimeHours = Math.floor(Math.random() * 6); // 0-5

/*
const employees = await prisma.employee.findMany();
await prisma.attendanceSummary.create({
data: {
employeeId: randomItem(employees).id,
periodStart: period.startDate,
periodEnd: period.endDate,
workingDays,
presentDays: workingDays - absentDays,
absentDays,
overtimeHours,
unpaidLeaveDays: 0,
},
});
*/
}
console.log(`seed attandane completed`);

} catch (err: any) {
if (err.code === 'P2002') {
console.warn(`Skipped duplicate empId: ${targetEmpId || 'null'}`);
} else {
console.error(`Error creating employee ${i + 1}:`, err);
// Optionally re-throw or continue
}
}
}

console.log('\nSeeding finished — attempted 26 employees.');

console.log('employee seeded ');
}


checkRecordExists = await prisma.personalInfo.count();
if (checkRecordExists === 0) {
console.log('start seeding personalInfo');
const employees = await prisma.employee.findMany({
select: {
id: true,
empId: true,
},
orderBy: { createdAt: 'asc' },
});

const gendersInfo = await prisma.gender.findMany({ select: { id: true, name: true } });
const nationalitiesInfo = await prisma.nationality.findMany({ select: { id: true, name: true } });

// ... genderId, nationalityId logic same as before ...
let count = 0;
console.log(`Found ${employees.length} employees to seed PersonalInfo for`);


// Fetch real gender & nationality IDs

const maleId = gendersInfo.find(g => g.name.toLowerCase().includes('male'))?.id || gendersInfo[0]?.id;
const femaleId = gendersInfo.find(g => g.name.toLowerCase().includes('female'))?.id || gendersInfo[0]?.id;
const nigerianId = nationalitiesInfo.find(n => n.name.toLowerCase().includes('nigerian') || n.name.toLowerCase().includes('nigeria'))?.id
|| nationalitiesInfo[0]?.id;

// Names (same lists as before)
const firstNames = ["Chidi", "Aisha", "Tunde", "Fatima", "Emeka", "Zainab", /* ... your full list */];
const lastNames = ["Okeke", "Mohammed", "Adeyemi", "Ibrahim", "Okafor", /* ... your full list */];

for (let i = 0; i < employees.length; i++) {   // only as many as employees created
const isMale = Math.random() > 0.48;

const fname = firstNames[i % firstNames.length];
const lname = lastNames[i % lastNames.length];
const mname = Math.random() < 0.12 ? "Chukwuma" : null;

// DOB: ~23–55 years old
const dob = new Date();
dob.setFullYear(dob.getFullYear() - (23 + Math.floor(Math.random() * 33)));
dob.setMonth(Math.floor(Math.random() * 12));
dob.setDate(1 + Math.floor(Math.random() * 28));

const genderId = isMale ? maleId : femaleId;
const nationalityId = Math.random() < 0.88 ? nigerianId : nationalitiesInfo[Math.floor(Math.random() * nationalitiesInfo.length)].id;

const avatar = `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 61) + 30}`;
try {
  /*
await prisma.personalInfo.create({
data: {
employeeId: employees[i].id,   // ← key change: employee's ID
createdById: adminUserId,
dob,
genderId,
nationalityId,
avatar,
},
});
*/
} catch (err: any) {
console.error(`Error creating PersonalInfo for employee index ${i}:`, err.message);
}
console.log(`PersonalInfo seeding done — ${employees.length} records created.`);
}
console.log('personalInfo seeded ');


console.log('start seeding contactInfo');

const existingContact = await prisma.contactInfo.count();
if (existingContact === 0) {
// Realistic Nigerian-style cities (mostly Lagos area + variety)
console.log(`Conatct Info seeding done — ${employees.length} records created.`);

const cities = [
"Lagos", "Ikeja", "Abuja", "Port Harcourt", "Benin City", "Warri",
"Ibadan", "Kano", "Enugu", "Owerri", "Kaduna", "Aba", "Jos", "Calabar",
"Uyo", "Maiduguri", "Sokoto", "Ilorin", "Abeokuta", "Akure",
"Ogbomosho", "Onitsha", "Asaba", "Yenagoa", "Makurdi", "Minna"
];

// Common Nigerian addresses (street style)
const streetPrefixes = [
"No. ", "", "Plot ", "Block ", "House "
];

const streets = [
"Adeola Odeku", "Ozumba Mbadiwe", "Ahmadu Bello Way", "Awolowo Road",
"Allen Avenue", "Ladipo Street", "Bourdillon Road", "Akin Adesola",
"Bishop Aboyade Cole", "Saka Tinubu", "Idowu Taylor", "Aromire",
"Toyin Street", "Opebi Link Road", "Kudirat Abiola Way", "Isaac John",
"Adeniyi Jones", "Ajao Estate", "Maryland", "Gbagada Expressway"
];

for (let i = 0; i < employees.length; i++) {
const employeeId = employees[i].id;

// Generate realistic address components
const streetNum = Math.floor(Math.random() * 150) + 1;
const prefix = streetPrefixes[Math.floor(Math.random() * streetPrefixes.length)];
const street = streets[Math.floor(Math.random() * streets.length)];
const address = `${prefix}${streetNum} ${street} Street`;

const apartment = Math.random() < 0.35 ? `Apt ${Math.floor(Math.random() * 48) + 1}` : null;

const city = cities[i % cities.length]; // cycle through list

// Zip/postal code — simplified Nigerian format (real ones are 6 digits)
const zipcode = `10${String(1000 + Math.floor(Math.random() * 9000)).padStart(4, '0')}`;

// Emails — professional style
const email = `contact.${employeeId.slice(0,8)}@company.local`.toLowerCase();

// Phone numbers — Nigerian format
const mobile = `0803${Math.floor(1000000 + Math.random() * 9000000)}`;
const phone = Math.random() < 0.7 ? `01${Math.floor(2000000 + Math.random() * 8000000)}` : null;

try {
  /*
await prisma.contactInfo.create({
data: {
createdById: adminUserId,         // ← same as Employee.id
employeeId: employeeId,           // ← same as Employee.id
address,
zipcode,
apartment,
email,
mobile,
phone,
city,
// stateId: null,             // intentionally omitted as requested
// countryId: null,           // intentionally omitted as requested

// Optional: track who created this record
// createdById: adminUserId,
},
});
*/
} catch (err: any) {
if (err.code === 'P2002') {
console.warn(`Skipped duplicate/conflict for userId ${employeeId.slice(0,8)}...`);
} else {
console.error(`Error creating ContactInfo for index ${i}:`, err.message);
}
}
}
console.log(`ContactInfo seeding completed — attempted ${employees.length} records.`);
}
console.log('contactInfo seeded ');
}



checkRecordExists = await prisma.department.count();
if (checkRecordExists === 0) {
console.log('Seeding department...');
const departments = [
// Core Program Units
{ name: 'Programs' },
{ name: 'Monitoring, Evaluation, Accountability & Learning (MEAL)' },
{ name: 'Research & Policy' },
{ name: 'Project Management Office (PMO)' },
{ name: 'Community Engagement' },
{ name: 'Partnerships & Grants' },

// Operations
{ name: 'Finance & Accounts' },
{ name: 'Procurement & Supply Chain' },
{ name: 'Human Resources' },
{ name: 'Administration' },
{ name: 'Information Technology (IT)' },
{ name: 'Logistics' },

// Governance & Strategy
{ name: 'Executive Office' },
{ name: 'Strategy & Innovation' },
{ name: 'Communications & Advocacy' },
{ name: 'Resource Mobilization & Fundraising' },
{ name: 'Risk & Compliance' },
{ name: 'Safeguarding & Protection' },
];

for (const dept of departments) {
await prisma.department.upsert({
where: { name: dept.name },
update: {},
create: {
name: dept.name,
createdById: adminUserId,
},
});
}

console.log('NGO Departments seeded successfully.');
}

checkRecordExists = await prisma.department.count();
const checkRecordUnitsExists = await prisma.unit.count();
if (checkRecordExists > 0 && checkRecordUnitsExists === 0) { console.log('seeding units')
const unitsData = [
{
departmentName: "Safeguarding & Protection",
units: [
"Child Protection",
"Gender-Based Violence (GBV)",
"Case Management"
]
},
{
departmentName: "Risk & Compliance",
units: [
"Internal Audit",
"Policy Compliance",
"Risk Assessment"
]
},
{
departmentName: "Resource Mobilization & Fundraising",
units: [
"Grant Writing",
"Donor Relations",
"Proposal Development"
]
},
{
departmentName: "Communications & Advocacy",
units: [
"Media & PR",
"Digital Communications",
"Advocacy Campaigns"
]
},
{
departmentName: "Strategy & Innovation",
units: [
"Research & Learning",
"Digital Transformation",
"Impact Measurement"
]
},
{
departmentName: "Executive Office",
units: [
"Office of the ED",
"Board Secretariat",
"Strategic Partnerships"
]
},
{
departmentName: "Logistics",
units: [
"Fleet Management",
"Inventory & Stores",
"Procurement Support"
]
},
{
departmentName: "Information Technology (IT)",
units: [
"Infrastructure",
"Software Development",
"IT Support / Helpdesk"
]
},
{
departmentName: "Administration",
units: [
"Facility Management",
"General Services",
"Front Desk"
]
}
]

for (const dept of unitsData) {

const department = await prisma.department.findUnique({
where: { name: dept.departmentName }
})

if (!department) {
console.warn(`⚠️ Department not found: ${dept.departmentName}`)
continue
}

for (const unitName of dept.units) {
await prisma.unit.upsert({
where: {
name_departmentId: {
name: unitName,
departmentId: department.id
}
},
update: {},
create: {
name: unitName,
departmentId: department.id
}
})
}

console.log(`✅ Units seeded for ${dept.departmentName}`)
}

}

checkRecordExists = await prisma.officeLocation.count();
if (checkRecordExists === 0) {
console.log('start seeding location');
const statesToSeed = ['Imo', 'FCT', 'Rivers'];
const officeNames = [
'Head Office - Abuja',
'Lagos Regional Office',
'Port Harcourt Branch',
'Owerri Field Office',
'Garki Coordination Centre',
'GRA Office',
'Central Business District',
];

const createdLocations: any[] = [];
for (const stateName of statesToSeed) {
const state = await prisma.nigeriaState.findFirst({
where: { name: { equals: stateName, mode: 'insensitive' } },
});

if (!state) {
console.warn(`State not found: ${stateName} — skipping locations for this state`);
continue;
}

for (const name of officeNames) {
// Optional: only create if it doesn't exist
const existing = await prisma.officeLocation.findFirst({
where: { name },
});

if (existing) {
createdLocations.push(existing);
continue;
}

/*
const location = await prisma.officeLocation.create({
data: {
name,
stateId: state.id,
createdById: adminUserId,
},
});

createdLocations.push(location);
*/
}
}
console.log('office locatiob seeded ');
}


checkRecordExists = await prisma.employmentHistory.count();
if (checkRecordExists === 0) {
console.log('start seeding employmentHistory');
console.log('seed history now')
const careerPaths = [
// Tech/Engineering path
[
{ type: "Probation", position: "Junior Software Developer (Probation)", months: 6 },
{ type: "Full-time", position: "Software Developer", months: 18 },
{ type: "Promotion", position: "Senior Software Developer", months: 24 },
{ type: "Current", position: "Lead Backend Engineer", months: 0 }
],
// Finance/Admin path
[
{ type: "Probation", position: "Finance Assistant (Probation)", months: 6 },
{ type: "Full-time", position: "Finance Officer", months: 24 },
{ type: "Promotion", position: "Senior Finance Officer", months: 18 },
{ type: "Current", position: "Finance & Grants Manager", months: 0 }
],
// Programs/M&E path
[
{ type: "Volunteer/Intern", position: "Program Intern", months: 6 },
{ type: "Probation", position: "Monitoring & Evaluation Assistant (Probation)", months: 6 },
{ type: "Full-time", position: "M&E Officer", months: 24 },
{ type: "Promotion", position: "Senior M&E Specialist", months: 0 }
],
// General/HR path
[
{ type: "Probation", position: "Admin Assistant (Probation)", months: 6 },
{ type: "Full-time", position: "Human Resources Officer", months: 20 },
{ type: "Promotion", position: "HR & Admin Coordinator", months: 0 }
],
// Mixed / short path
[
{ type: "Probation", position: "Project Support Officer (Probation)", months: 6 },
{ type: "Full-time", position: "Project Officer", months: 36 },
{ type: "Current", position: "Programme Manager", months: 0 }
]
];

const employees = await prisma.employee.findMany({
select: {
id: true,
empId: true,
},
orderBy: { createdAt: 'asc' },
});




for (let empIndex = 0; empIndex < employees.length; empIndex++) {
const employeeId = employees[empIndex].id;

// Pick a random career path for variety
const pathTemplate = careerPaths[Math.floor(Math.random() * careerPaths.length)];

let currentDate = new Date();
let sequence = [...pathTemplate].reverse(); // start from oldest

for (let step of sequence) {
const durationMonths = step.months;

const endDate = step.type === "Current" ? null : new Date(currentDate);
const startDate = new Date(currentDate);

if (durationMonths > 0) {
startDate.setMonth(startDate.getMonth() - durationMonths);
}

// Shift time window backward for next (older) entry
currentDate = new Date(startDate);

const isCurrent = step.type === "Current";
// ─── Pick random office location ───────────────────────
let locationId: string | undefined = undefined;


const positionsToSeed = [
"Chief Executive Officer",
"Chief Operating Officer",
"Chief Financial Officer",
"Chief Information Officer",
"Chief Marketing Officer",
"Chief Human Resources Officer",
"Vice President",
"Director",
"Senior Manager",
"Manager",
"Team Lead",
"Senior Specialist",
"Specialist",
"Analyst",
"Senior Analyst",
"Accountant",
"Finance Officer",
"Marketing Officer",
"HR Officer",
"IT Officer",
"Project Coordinator",
"Administrative Assistant",
"Executive Assistant",
"Office Administrator",
"Receptionist",
];




for (const name of positionsToSeed) {
try {
// Upsert → safe to run multiple times
/*
await prisma.officePosition.upsert({
where: { name },
update: {}, // nothing to update if exists
create: {
name,
createdById: adminUserId,
// createdAt / updatedAt auto-handled by Prisma
},
});
*/
} catch (err) {
console.error(`Failed to seed position "${name}":`, err);
}
}

console.log(`Office positions seeding complete (${positionsToSeed.length} items)`);


const positions = await prisma.officePosition.findMany();
const departments = await prisma.department.findMany();
const employeeNames = await prisma.employee.findMany();
const officeLocation = await prisma.officeLocation.findMany();
if (!positions.length) { throw new Error('No positions found in database'); }

function randomItem<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
const randomPosition = randomItem(positions);
const randomEmp = randomItem(employeeNames);
const randomLocation = randomItem(officeLocation);
const randomdepartments = randomItem(departments);

try {
  /*
await prisma.employmentHistory.create({
data: {
createdById: adminUserId,         // ← same as Employee.id
employeeId: employeeId,   
startDate: startDate,
locationId: randomLocation.id,
positionId: randomPosition.id,
supervisorId: randomEmp.id,
departmentId: randomdepartments.id,
endDate: endDate,
isCurrent: isCurrent,
employmentType: step.type === "Probation" ? "Probation" :
step.type === "Volunteer/Intern" ? "Volunteer" :
"Full-time",
reasonForChange: isCurrent ? null :
step.type === "Promotion" ? "Promotion" :
step.type === "Full-time" ? "Successful probation completion" :
null,
notes: isCurrent ? "Current role – leading key initiatives" : null,
},
});
*/
console.log(
`Created job history for employee ${empIndex + 1} → ${step.position} (${step.type})${isCurrent ? " [Current]" : ""}`
);
} catch (err: any) {
console.error(`Error creating history entry for employee ${empIndex + 1}:`, err.message);
}
}
}
console.log('employmentHistory seeded ');
}

checkRecordExists = await prisma.emergencyContact.count();
if (checkRecordExists === 0) {
console.log('start seeding emergencyContact');
/*
const employees = await prisma.employee.findMany({
select: {
id: true,
empId: true,
},
orderBy: { createdAt: 'asc' },
});
*/







// ────────────────────────────────────────────────
// Seed EmergencyContact — one per employee
// using the same userId as Employee.id
// ────────────────────────────────────────────────
console.log("\nStarting EmergencyContact seeding...");
// Common Nigerian first + last names for emergency contacts
const fNames = [
"Chidi", "Aisha", "Tunde", "Fatima", "Emeka", "Zainab", "Obi", "Ngozi",
"Ifeanyi", "Halima", "Kehinde", "Maryam", "Yusuf", "Blessing", "Abdullahi", "Chioma",
"Adebayo", "Sade", "Oluwatobi", "Amina", "Chukwuemeka", "Munachimso", "Nnamdi", "Amarachi",
"Taiwo", "Ijeoma", "Funmi", "Seyi", "Bola", "Kemi"
];

const lNames = [
"Okeke", "Mohammed", "Adeyemi", "Ibrahim", "Okafor", "Abubakar", "Eze", "Afolabi",
"Ogunleye", "Bello", "Usman", "Ojo", "Akinyemi", "Balogun", "Oladipo", "Adeniyi",
"Nwosu", "Onuoha", "Okonkwo", "Umeh", "Chukwu", "Lawal", "Suleiman", "Adamu",
"Ezeh", "Abdullahi", "Ogun", "Adesina", "Oladele", "Akinola"
];

// Relationship types
const relationships = [
"Spouse", "Sibling", "Parent", "Child", "Sibling", "Aunt", "Uncle",
"Cousin", "Friend", "Colleague", "Spouse", "Mother", "Father", "Brother", "Sister"
];

// Cities (mostly Lagos + other major cities)
const citiesEmer = [
"Lagos", "Ikeja", "Abuja", "Port Harcourt", "Benin City", "Warri",
"Ibadan", "Kano", "Enugu", "Owerri", "Kaduna", "Aba", "Jos", "Calabar",
"Uyo", "Maiduguri", "Sokoto", "Ilorin", "Abeokuta", "Akure"
];
/*
for (let i = 0; i < employees.length; i++) {
const employeeId = employees[i].id;

const isSpouseOrParent = Math.random() < 0.65;
const relationship = relationships[Math.floor(Math.random() * relationships.length)];

const fname = fNames[(i + Math.floor(Math.random() * 8)) % fNames.length];
const lname = lNames[(i + Math.floor(Math.random() * 6)) % lNames.length];
const fullName = `${fname} ${lname}`;

// Address – similar style to ContactInfo but slightly different
const streetNum = Math.floor(Math.random() * 120) + 1;
const streets = ["Adeola Odeku", "Ozumba Mbadiwe", "Awolowo Road", "Allen Avenue", "Toyin Street", "Opebi", "Kudirat Abiola Way", "Isaac John", "Adeniyi Jones"];
const street = streets[Math.floor(Math.random() * streets.length)];
const address = `${streetNum} ${street} Street`;

const apartment = Math.random() < 0.3 ? `Apt ${Math.floor(Math.random() * 36) + 1}` : null;

const city = citiesEmer[Math.floor(Math.random() * citiesEmer.length)];

// Zipcode – simplified Nigerian style
const zipcode = Math.random() < 0.8 ? `10${String(1000 + Math.floor(Math.random() * 9000)).padStart(4, '0')}` : null;

// Email – optional (~60% have email)
const email = Math.random() < 0.6 ? `${fname.toLowerCase()}.${lname.toLowerCase().replace(/\s+/g, '')}@gmail.com` : null;

// Mobile – always present (primary contact)
const mobile = `080${Math.floor(3000000000 + Math.random() * 999999999)}`;

// Alternative phone – ~70% have it
const phone = Math.random() < 0.7 ? `01${Math.floor(2000000 + Math.random() * 8000000)}` : null;

try {
  /*
await prisma.emergencyContact.create({
data: {
createdById: adminUserId,         // ← same as Employee.id
employeeId: employeeId,    fullName,
address,
zipcode,
apartment,
email,
mobile,
phone,
city,
// stateId: null,             // omitted as in previous seeds
// countryId: null,           // omitted as in previous seeds

// Optional: who added this emergency contact
// createdById: adminUserId,
},
});


} catch (err: any) {
if (err.code === 'P2002') {
console.warn(`Skipped duplicate/conflict for userId ...`);
} else {
console.error(`Error creating EmergencyContact for index`, err.message);
}
}
}
*/
console.log('emergencyContact seeded ');
}

checkRecordExists = await prisma.beneficiary.count();
if (checkRecordExists > 0) {
const checkCase = await prisma.case.count();
if (checkCase === 0) {
console.log('start seeding cases');

// Fetch required related records
const beneficiaries = await prisma.beneficiary.findMany({
select: { id: true, name: true },});

const employees = await prisma.employee.findMany({
select: { id: true, empId: true }, take: 20,});

const randomFrom = <T>(arr: T[]) => arr[Math.floor(Math.random() * arr.length)];
const applications = Array.from({ length: 12 }, (_, i) => {
const index = i + 1;
const beneficiary = randomFrom(beneficiaries);
const caseWorker = randomFrom(employees);

// Unique case number: CM-LAG-2025- followed by 6-digit number
const caseNumber = `WEWE-2025-${(100000 + index + Math.floor(Math.random() * 900000)).toString().padStart(6, '0')}`;

return {
caseNumber,

beneficiaryId: beneficiary.id,
caseWorkerId: caseWorker.id,
createdById: adminUserId,

// ── Using exact enum values from your schema ───────────────────────
caseType: randomFrom([
CaseType.GENERAL_PROTECTION,
CaseType.CHILD_PROTECTION,
CaseType.GENDER_BASED_VIOLENCE,
CaseType.ECONOMIC_SUPPORT,
CaseType.MEDICAL_HEALTH,
CaseType.EDUCATION_SUPPORT,
CaseType.LEGAL_AID,
CaseType.MULTIPURPOSE_CASH,
CaseType.OTHER,
]),

status: randomFrom([
CaseStatus.NEW,
CaseStatus.IN_PROGRESS,
CaseStatus.ACTION_PLAN_CREATED,
CaseStatus.ACTIVE,
CaseStatus.MONITORING,
CaseStatus.CLOSED,
CaseStatus.REFERRED_OUT,
CaseStatus.INACTIVE,
CaseStatus.REJECTED,
]),

riskLevel: randomFrom([
RiskLevel.LOW,
RiskLevel.MEDIUM,
RiskLevel.HIGH,
RiskLevel.CRITICAL,
]),

priority: Math.floor(Math.random() * 10) + 1, // 1–10

openingDate: new Date(
2025,
Math.floor(Math.random() * 12),
Math.floor(Math.random() * 28) + 1
),

// ~30% of cases are closed
closingDate:
Math.random() > 0.7
? new Date(
2025,
6 + Math.floor(Math.random() * 6),
Math.floor(Math.random() * 28) + 1
)
: null,
};
});

/*
await prisma.case.createMany({
data: applications,
skipDuplicates: true, // safety net for caseNumber uniqueness
});
*/
console.log(`→ Successfully seeded ${applications.length} case records.`);
console.log(`→ Successfully seeded case records.`);
console.log('cases seeded ');
}}


checkRecordExists = await prisma.grievance.count();
/*
if (checkRecordExists === 0) {
console.log('🌱 Seeding Disciplinary & Grievances...');

const employees = await prisma.employee.findMany();
const users = await prisma.user.findMany();

if (!employees.length || !users.length) {
throw new Error('Employees or Users not found.');
}

const disciplinaryStatuses = [
DisciplinaryStatus.REPORTED,
DisciplinaryStatus.UNDER_INVESTIGATION,
DisciplinaryStatus.RESOLVED,
DisciplinaryStatus.DISMISSED,
];

const disciplinaryActions = [
DisciplinaryAction.NONE,
DisciplinaryAction.VERBAL_WARNING,
DisciplinaryAction.WRITTEN_WARNING,
DisciplinaryAction.FINAL_WARNING,
DisciplinaryAction.SUSPENSION,
];

const grievanceStatuses = [
GrievanceStatus.SUBMITTED,
GrievanceStatus.UNDER_REVIEW,
GrievanceStatus.IN_MEDIATION,
GrievanceStatus.RESOLVED,
GrievanceStatus.REJECTED,
];

// ----------------------------
// 🔴 Seed 15 Disciplinary Cases
// ----------------------------
for (let i = 0; i < 15; i++) {
const employee = randomItem(employees);
const reporter = randomItem(users);
const investigator = randomItem(users);
const status = randomItem(disciplinaryStatuses);

const incidentDate = randomPastDate(180);
const resolved =
status === DisciplinaryStatus.RESOLVED ||
status === DisciplinaryStatus.DISMISSED;

/*
await prisma.disciplinaryCase.create({
data: {
title: `Policy Violation Case #${i + 1}`,
description:
'Alleged breach of workplace conduct policy. Investigation initiated.',

employeeId: employee.id,
reportedById: reporter.id,
investigatorId: investigator.id,

status,
actionTaken: resolved
? randomItem(disciplinaryActions)
: DisciplinaryAction.NONE,

incidentDate,
resolutionDate: resolved ? randomPastDate(30) : null,

createdById: reporter.id,
},
});

}

// ----------------------------
// 🟢 Seed 15 Grievances
// ----------------------------
for (let i = 0; i < 15; i++) {
const employee = randomItem(employees);
const assignedTo = randomItem(employees);
const status = randomItem(grievanceStatuses);

const resolved =
status === GrievanceStatus.RESOLVED ||
status === GrievanceStatus.REJECTED;

/*
await prisma.grievance.create({
data: {
subject: `Workplace Concern #${i + 1}`,
description:
'Employee raised concern regarding workplace environment or treatment.',

employeeId: employee.id,
assignedToId: assignedTo.id,

status,
isAnonymous: Math.random() < 0.2, // 20% anonymous

resolvedAt: resolved ? randomPastDate(30) : null,

createdById: adminUserId,
},
});

}

console.log('✅ Disciplinary & Grievance Seeds Completed');
}
*/



const programs = await prisma.program.count();
if (programs === 0) {
const programsData = [
{
name: "Digital Literacy for Youth",
description: "Basic computer and internet skills training for secondary school students",
startDate: new Date("2024-03-01"),
endDate: new Date("2025-02-28"),
},
{
name: "Women in Tech Bootcamp",
description: "6-month intensive training in web development and UI/UX design",
startDate: new Date("2024-06-15"),
endDate: new Date("2024-12-15"),
},
{
name: "Solar Energy Deployment Initiative",
description: "Installing solar panels in 120 rural primary schools",
startDate: new Date("2023-09-01"),
endDate: new Date("2025-08-31"),
},
{
name: "Future Coders Academy 2025",
description: "Annual coding competition and training for ages 12–18",
startDate: new Date("2025-01-10"),
endDate: new Date("2025-11-30"),
},
{
name: "AgriTech Innovation Hub",
description: "Supporting startups building tech solutions for smallholder farmers",
startDate: new Date("2024-04-01"),
endDate: null, // ongoing
},
{
name: "Healthcare Access Mobile Clinics",
description: "Monthly outreach clinics in underserved communities",
startDate: new Date("2023-11-01"),
endDate: new Date("2026-10-31"),
},
{
name: "Climate Action Youth Ambassadors",
description: "Training young leaders in climate advocacy and tree planting",
startDate: new Date("2025-02-01"),
endDate: new Date("2026-01-31"),
},
{
name: "Entrepreneurship for Single Mothers",
description: "Business skills, micro-loans and mentorship program",
startDate: new Date("2024-07-01"),
endDate: new Date("2025-06-30"),
},
{
name: "STEM Teachers Training Program",
description: "Upgrading science and math teaching capacity in public schools",
startDate: new Date("2024-01-15"),
endDate: new Date("2025-12-20"),
},
{
name: "Refugee Digital Skills Integration",
description: "Language + digital literacy for displaced persons",
startDate: new Date("2024-05-01"),
endDate: null,
},
{
name: "Clean Water for Communities 2.0",
description: "Borehole rehabilitation and water quality monitoring",
startDate: new Date("2023-10-01"),
endDate: new Date("2025-09-30"),
},
{
name: "AI for Social Good Hackathon Series",
description: "Quarterly hackathons focused on education, health and agriculture",
startDate: new Date("2025-03-01"),
endDate: new Date("2026-12-31"),
},
{
name: "Financial Literacy for Adolescents",
description: "Savings, budgeting and mobile money workshops in schools",
startDate: new Date("2024-09-01"),
endDate: new Date("2025-08-31"),
},
{
name: "Green Skills Vocational Training",
description: "Training in solar installation, waste recycling and organic farming",
startDate: new Date("2025-04-01"),
endDate: null, // long-term program
},
{ name: "Women Economic Empowerment", startDate: new Date("2024-01-01"), endDate: new Date("2026-12-31") },
{ name: "Youth Skills Development", startDate: new Date("2024-03-01"), endDate: new Date("2025-12-31") },
{ name: "Community Health Access", startDate: new Date("2024-02-01"), endDate: new Date("2026-01-31") },
{ name: "Education Support Initiative", startDate: new Date("2024-01-15"), endDate: new Date("2025-12-15") },
{ name: "WASH Improvement Program", startDate: new Date("2024-04-01"), endDate: new Date("2026-03-31") },
{ name: "GBV Prevention & Response", startDate: new Date("2024-05-01"), endDate: new Date("2026-05-01") },
{ name: "Livelihood Recovery Program", startDate: new Date("2024-06-01"), endDate: new Date("2026-06-01") },

];

console.log(`Seeding ${programsData.length} programs...`);

for (const data of programsData) {
  /*
await prisma.program.upsert({
where: {
name: data.name, // assuming name is unique enough for upsert
},
update: {
description: data.description,
startDate: data.startDate,
endDate: data.endDate,
createdById: adminUserId,
},
create: {
name: data.name,
description: data.description,
startDate: data.startDate,
endDate: data.endDate,
createdById: adminUserId,
},
});
*/
}
console.log("→ Programs seeding complete.");
}




const programsPro = await prisma.program.findMany({
select: { id: true, name: true },
where: { deletedAt: null }, // only active programs
orderBy: { createdAt: 'asc' },
take: 14, // assuming you seeded exactly 14 earlier
});

if (programsPro.length > 0) {
const curProjects = await prisma.project.count();
if (curProjects === 0) {
console.log(`Found ${programsPro.length} programs to attach projects to.`);

// Step 2: Project data (same 23 entries as before)
const projectData = [
// Program 0: Digital Literacy for Youth
{ programIndex: 0, name: "Laptop Donation Drive 2024", desc: "Collecting and refurbishing used laptops for schools", start: "2024-04-01", end: "2024-09-30" },
{ programIndex: 0, name: "Internet Cafe Setup Pilot", desc: "Establishing 8 community internet access points", start: "2024-07-15", end: "2025-03-31" },
{ programIndex: 0, name: "Coding Club Starter Pack", desc: "Providing curriculum + hardware to 45 after-school clubs", start: "2025-01-10", end: null },

// Program 1: Women in Tech Bootcamp
{ programIndex: 1, name: "Cohort 3 – Web Development", desc: "Full-stack JavaScript & React training", start: "2024-08-01", end: "2025-01-31" },
{ programIndex: 1, name: "UI/UX Design Track 2025", desc: "Figma + user research intensive", start: "2025-02-10", end: "2025-07-30" },
{ programIndex: 1, name: "Mentorship Matching System", desc: "Connecting learners with industry professionals", start: "2024-11-01", end: null },

// Program 2: Solar Energy Deployment
{ programIndex: 2, name: "Phase 2 – Northern Region", desc: "40 additional schools", start: "2024-10-01", end: "2025-09-30" },
{ programIndex: 2, name: "Maintenance & Training Program", desc: "Technician training + 2-year support", start: "2025-01-15", end: null },

// Program 3: Future Coders Academy 2025
{ programIndex: 3, name: "Regional Qualifiers – South West", desc: "Local competitions in Lagos, Ogun, Ondo", start: "2025-03-01", end: "2025-05-31" },
{ programIndex: 3, name: "National Finals & Awards", desc: "Grand finale event + prizes", start: "2025-10-15", end: "2025-11-20" },

// Program 4: AgriTech Innovation Hub
{ programIndex: 4, name: "Batch 4 Incubation", desc: "8 selected agritech startups", start: "2024-09-01", end: "2025-06-30" },
{ programIndex: 4, name: "Farmer Field Testing Program", desc: "Pilot testing of selected solutions", start: "2025-03-01", end: null },

// Remaining programs (5–13)
{ programIndex: 5, name: "Mobile Clinic – Q1 2025", desc: "3-month outreach in 5 LGAs", start: "2025-01-01", end: "2025-03-31" },
{ programIndex: 6, name: "Tree Planting Campaign 2025", desc: "Goal: 25,000 trees", start: "2025-06-01", end: "2025-12-31" },
{ programIndex: 7, name: "Business Starter Kits – Batch 3", desc: "60 women receiving grants + training", start: "2024-10-01", end: "2025-09-30" },
{ programIndex: 8, name: "STEM Lab Equipment Upgrade", desc: "Retrofitting 22 science labs", start: "2024-05-01", end: "2025-04-30" },
{ programIndex: 9, name: "Language App Localization", desc: "Adapting Duolingo-style app to 4 local languages", start: "2024-12-01", end: null },
{ programIndex: 10, name: "Borehole Cluster – Delta State", desc: "15 new boreholes + solar pumps", start: "2024-08-01", end: "2025-07-31" },
{ programIndex: 11, name: "Health AI Challenge 2025", desc: "AI solutions for maternal health", start: "2025-04-01", end: "2025-10-31" },
{ programIndex: 12, name: "Savings Group Digitization", desc: "Mobile app for 180 adolescent savings groups", start: "2024-11-01", end: "2025-10-31" },
{ programIndex: 13, name: "Solar Technician Certification", desc: "Training 120 youths", start: "2025-05-01", end: null },

// A few extras attached to earlier programs
{ programIndex: 2, name: "Impact Assessment Study", desc: "Evaluating solar program outcomes", start: "2025-04-01", end: "2025-12-31" },
{ programIndex: 4, name: "Investor Demo Day Q2 2025", desc: "Showcasing incubated startups", start: "2025-05-15", end: "2025-05-20" },
{ programIndex: 0, name: "Cyber Safety Awareness Roadshow", desc: "School visits in 3 states", start: "2025-02-01", end: "2025-06-30" },
];

console.log(`Seeding ${projectData.length} projects...`);

for (const p of projectData) {
const program = programsPro[p.programIndex];
if (!program) {
console.warn(`Skipping project "${p.name}" — program index ${p.programIndex} not found`);
continue;
}

/*
await prisma.project.create({
data: {
name:        p.name,
startDate:   new Date(p.start),
endDate:     p.end ? new Date(p.end) : null,
programId:   program.id,
createdById: adminUserId,
},
});
*/
}

console.log("→ Project seeding complete.");
}
}


checkRecordExists = await prisma.leaveType.count();
if (checkRecordExists === 0) {
console.log("→ start seeding leave types.");
const leaveTypes = [
'Annual Leave',
'Sick Leave',
'Maternity Leave',
'Paternity Leave',
'Study Leave',
'Unpaid Leave',
'Casual Leave',
];

for (const name of leaveTypes) {
await prisma.leaveType.upsert({
where: { name },
update: {}, // prevents duplicates
create: {
name,
createdById: admin?.id ?? null,
},
});
}
console.log('✅ Leave Types Seeded Successfully');
}



checkRecordExists = await prisma.leaveRequest.count();
if (checkRecordExists === 0) {
console.log('🌱 Seeding Leave Requests...');

const employees = await prisma.employee.findMany();
const leaveTypes = await prisma.leaveType.findMany();

//if (!employees.length || !leaveTypes.length) { throw new Error('Employees or LeaveTypes not found.');}


for (let i = 0; i < 30; i++) {
const employee = randomItem(employees);
const leaveType = randomItem(leaveTypes);

const startDate = randomFutureDate();
const duration = Math.floor(Math.random() * 10) + 1; // 1–10 days
const endDate = new Date(startDate);
endDate.setDate(startDate.getDate() + duration);

/*
await prisma.leaveRequest.create({
data: {
startDate,
endDate,
daysRequested: Math.floor(Math.random() * 29) + 12,
employeeId: employee.id,
leaveTypeId: leaveType.id,
reason: `Requesting ${duration} day(s) of ${leaveType.name}.`,

createdById: adminUserId,
},
});
*/
}
console.log('✅ 30 Leave Requests Seeded Successfully');
}


checkRecordExists = await prisma.attendance.count();
if (checkRecordExists === 0) {
function randomInt(min: number, max: number) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}

function isWeekend(date: Date) {
const day = date.getDay();
return day === 0 || day === 6;
}

console.log('🌱 Seeding 4 Months Attendance (Shift + Normal)...');

const admin = await prisma.user.findFirst({
where: { role: 'ADMIN' },
});

const employees = await prisma.employee.findMany();
const shiftAssignments = await prisma.shiftEmployee.findMany({
include: { shift: true },
});

// Map employeeId -> shift
const shiftMap = new Map<string, any>();
shiftAssignments.forEach((assignment) => {
if (assignment.employeeId && assignment.shift) {
shiftMap.set(assignment.employeeId, assignment.shift);
}
});

const today = new Date();
const fourMonthsAgo = new Date();
fourMonthsAgo.setMonth(today.getMonth() - 4);

for (const employee of employees) {
let currentDate = new Date(fourMonthsAgo);

const shift = shiftMap.get(employee.id); // may be undefined

while (currentDate <= today) {
const dateCopy = new Date(currentDate);

if (!isWeekend(dateCopy)) {
const absentChance = Math.random();

// 11% absence rate
if (absentChance > 0.11) {
let startHour = 8;
let startMinute = 0;
let endHour = 17;
let endMinute = 0;

// If employee has shift, override default hours
if (shift) {
startHour = shift.startTime.getHours();
startMinute = shift.startTime.getMinutes();
endHour = shift.endTime.getHours();
endMinute = shift.endTime.getMinutes();
}

const clockIn = new Date(dateCopy);
clockIn.setHours(startHour, startMinute, 0, 0);
clockIn.setMinutes(clockIn.getMinutes() + randomInt(0, 40)); // lateness

const clockOut = new Date(dateCopy);
clockOut.setHours(endHour, endMinute, 0, 0);
clockOut.setMinutes(clockOut.getMinutes() - randomInt(0, 30)); // early leave

const forgotClockOut = Math.random() < 0.05;

/*
await prisma.attendance.create({
data: {
employeeId: employee.id,
shiftId: shift ? shift.id : null,
clockIn,
clockOut: forgotClockOut ? null : clockOut,
createdById: adminUserId,
},
});
*/
}}
currentDate.setDate(currentDate.getDate() + 1);
}}
console.log('✅ 4 Months Attendance Seeded Successfully');
}


checkRecordExists = await prisma.donor.count();
if (checkRecordExists === 0) {
console.log('✅ Donor seeding starting');
const projects = await prisma.project.findMany();
const employees = await prisma.employee.findMany();
const admin = adminUserId;

//if (!projects.length || !employees.length) {throw new Error('Projects or Employees not found.');}

// ---------------------------------------------------
// ✅ 1. Seed Donors
// ---------------------------------------------------

const donorData = [
{ name: 'UNICEF Nigeria', type: DonorType.INSTITUTIONAL_DONOR },
{ name: 'USAID', type: DonorType.INSTITUTIONAL_DONOR },
{ name: 'World Bank', type: DonorType.INSTITUTIONAL_DONOR },
{ name: 'Bill & Melinda Gates Foundation', type: DonorType.INSTITUTIONAL_DONOR },
{ name: 'Dangote Foundation', type: DonorType.CORPORATE_DONOR },
{ name: 'MTN Foundation', type: DonorType.CORPORATE_DONOR },
{ name: 'Private Philanthropist A', type: DonorType.INDIVIDUAL_DONOR },
{ name: 'Private Philanthropist B', type: DonorType.INDIVIDUAL_DONOR },
];
/*
const donors = [];

for (const donor of donorData) {
const created = await prisma.donor.upsert({
where: { name: donor.name },
update: {},
create: {
name: donor.name,
donorType: donor.type,
email: `${donor.name.replace(/\s/g, '').toLowerCase()}@example.org`,
phone: `+23480${Math.floor(10000000 + Math.random() * 90000000)}`,
website: `https://${donor.name.replace(/\s/g, '').toLowerCase()}.org`,
createdById: adminUserId,
},
});

donors.push(created);
}


// ---------------------------------------------------
// ✅ 2. Seed ProjectDonor (Funding Relationships)
// ---------------------------------------------------

console.log('seeding project donor');
for (const project of projects) {
// Each project gets 1–3 donors
const donorCount = Math.floor(Math.random() * 3) + 1;

const shuffledDonors = [...donors].sort(() => 0.5 - Math.random());
const selectedDonors = shuffledDonors.slice(0, donorCount);

for (const donor of selectedDonors) {
await prisma.projectDonor.upsert({
where: {
projectId_donorId: {
projectId: project.id,
donorId: donor.id,
},
},
update: {},
create: {
projectId: project.id,
donorId: donor.id,
contributionAmount: randomFloat(5000, 100000),
currency: 'USD',
createdById: adminUserId,
},
});
}
}
*/
// ---------------------------------------------------
// ✅ 3. Seed ProjectEmployee (Team Assignments)
// ---------------------------------------------------

const projectRoles = [
'Project Manager',
'Field Officer',
'Monitoring & Evaluation Officer',
'Finance Officer',
'Community Mobilizer',
];

console.log('✅ Seeding project wmployee');
/*
for (const project of projects) {
// Assign 2–5 employees per project
const teamSize = Math.floor(Math.random() * 4) + 2;

const shuffledEmployees = [...employees].sort(() => 0.5 - Math.random());
const selectedEmployees = shuffledEmployees.slice(0, teamSize);

for (const employee of selectedEmployees) {
await prisma.projectEmployee.upsert({
where: {
projectId_employeeId: {
projectId: project.id,
employeeId: employee.id,
},
},
update: {},
create: {
projectId: project.id,
employeeId: employee.id,
role: randomItem(projectRoles),
assignedAt: new Date(),
createdById: adminUserId,
},
});
}
}
*/
console.log('✅ Donor & Project relationships seeded successfully');
}



checkRecordExists = await prisma.serviceType.count();
if (checkRecordExists === 0) {
const serviceTypes = [
// ────────────────────────────────────────────────
// Partner / NGO / Humanitarian Service Types
// (services typically provided by NGOs, UN agencies, etc. in Nigeria)
// ────────────────────────────────────────────────
{ name: 'WASH' },                           // Water, Sanitation & Hygiene
{ name: 'Nutrition' },
{ name: 'Health Services' },
{ name: 'Education Support' },
{ name: 'Child Protection' },
{ name: 'Gender-Based Violence Prevention' },
{ name: 'Livelihoods & Economic Empowerment' },
{ name: 'Food Security' },
{ name: 'Psychosocial Support' },
{ name: 'Shelter & Non-Food Items' },
{ name: 'Cash & Voucher Assistance' },
{ name: 'Emergency Response & Relief' },

// ────────────────────────────────────────────────
// Business / Statutory / HR-Related Service Types
// (services handled by or for organizations: tax offices, pension admins, insurers, payroll providers, etc.)
// ────────────────────────────────────────────────
{ name: 'PAYE Tax Collection & Remittance' },     // Pay As You Earn income tax
{ name: 'Pension Contribution Management' },      // Contributory Pension Scheme (PenCom)
{ name: 'National Health Insurance Scheme (NHIS)' },
{ name: 'National Housing Fund (NHF) Deduction' },
{ name: 'Workers Compensation / NSITF' },         // Employee Compensation Scheme
{ name: 'Payroll Processing & Salary Administration' },
{ name: 'Withholding Tax Management' },
{ name: 'Industrial Training Fund (ITF) Levy' },
{ name: 'Group Life Insurance Administration' },
{ name: 'Statutory Remittance & Compliance Reporting' },
];

for (const data of serviceTypes) {
const serviceType = await prisma.serviceType.upsert({
where: { name: data.name },
update: data,
create: data,
});
console.log(`→ ServiceType: ${serviceType.name}`);
}

console.log('\nServiceType seeding completed ✅');
}


/*
checkRecordExists = await prisma.organization.count();
if (checkRecordExists === 0) {

// Sample public document URLs
const documentPool = [
{
name: 'Registration Certificate',
type: 'certificate',
url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
},
{
name: 'Memorandum of Understanding',
type: 'mou',
url: 'https://file-examples.com/storage/fe1b8a6f5f7c3e1e6b3c6d7/2017/10/file-sample_150kB.pdf'
},
{
name: 'Partnership Agreement',
type: 'agreement',
url: 'https://file-examples.com/storage/fe1b8a6f5f7c3e1e6b3c6d7/2017/10/file-example_PDF_500_kB.pdf'
},
{
name: 'Operational Guidelines',
type: 'policy',
url: 'https://www.orimi.com/pdf-test.pdf'
}
]

console.log('🌱 Seeding 18 Nigerian organizations...')

// -------------------------------------------------
// Get Nigeria Country ID
// -------------------------------------------------
const nigeria = await prisma.country.findFirst({
where: { name: { contains: 'Nigeria', mode: 'insensitive' } }
})

if (!nigeria) throw new Error('Nigeria not found in Country table.')

// -------------------------------------------------
// Get States and Projects
// -------------------------------------------------
const states = await prisma.nigeriaState.findMany()
const projects = await prisma.project.findMany()
const serviceTypes = await prisma.serviceType.findMany()

if (!states.length) throw new Error('No Nigeria states found.')
if (!projects.length) throw new Error('No projects found.')



// -------------------------------------------------
// 12 NGO Partners
// -------------------------------------------------
const ngoPartners = [
'Hope Alive Foundation',
'Women Empowerment Network Nigeria',
'Bright Future Initiative',
'Lagos Community Health NGO',
'Northern Child Support Foundation',
'Safe Home Initiative',
'Youth Development Alliance',
'Abuja Legal Support Initiative',
'Care & Relief Nigeria',
'Green Earth Advocacy',
'Faith & Hope Outreach',
'Community Impact Partners'
]

// -------------------------------------------------
// 6 Non-Partner Government Agencies
// -------------------------------------------------
const nonPartners = [
'Federal Inland Revenue Service',
'National Pension Commission',
'National Insurance Commission',
'Nigeria Customs Service',
'Corporate Affairs Commission',
'National Social Insurance Trust Fund'
]

// -------------------------------------------------
// Helper Functions
// -------------------------------------------------
const randomState = () => states[Math.floor(Math.random() * states.length)]
const randomProject = () => projects[Math.floor(Math.random() * projects.length)]
const randomServiceType = () =>  randomItem(serviceTypes);



// -------------------------------------------------
// Seed NGO Partners
// -------------------------------------------------
for (const name of ngoPartners) {
const organization = await prisma.organization.upsert({
where: { name },
update: {},
create: {
name,
type: 'ngo',
isPartner: true,
website: `https://${name.replace(/\s+/g, '').toLowerCase()}.org`,
address: 'Nigeria',
city: randomState().name,
countryId: nigeria.id,
regNumber: `NGO-${Math.floor(Math.random() * 100000)}`,
serviceTypesId: randomServiceType().id,
projects: {
connect: [{ id: randomProject().id }]
},
state: {
connect: [{ id: randomState().id }]
}
}
})

// Assign 2–3 random documents
const shuffledDocs = documentPool.sort(() => 0.5 - Math.random())
const selectedDocs = shuffledDocs.slice(0, 3)

for (const doc of selectedDocs) {
await prisma.orgDocs.create({
data: {
name: doc.name,
originalName: doc.name,
type: doc.type,
url: doc.url,
organizationId: organization.id
}
})
}

console.log(`✅ Partner NGO Seeded: ${name}`)
}

// -------------------------------------------------
// Seed Non-Partner Agencies
// -------------------------------------------------
for (const name of nonPartners) {
await prisma.organization.upsert({
where: { name },
update: {},
create: {
name,
type: 'government',
isPartner: false,
city: 'Abuja',
address: 'Federal Capital Territory',
countryId: nigeria.id,
regNumber: `GOV-${Math.floor(Math.random() * 100000)}`,
state: {
connect: [{ id: randomState().id }]
}
}
})

console.log(`✅ Government Agency Seeded: ${name}`)
}}

*/
checkRecordExists = await prisma.assetCategory.count();
if (checkRecordExists === 0) {
console.log('Seeding Asset-related models...');

// ────────────────────────────────────────────────
// 1. Seed AssetCategory
// ────────────────────────────────────────────────
const categoriesData = [
{ name: 'IT Equipment', description: 'Computers, laptops, printers, servers' },
{ name: 'Vehicles', description: 'Cars, vans, motorcycles for field work' },
{ name: 'Office Furniture', description: 'Desks, chairs, cabinets' },
{ name: 'Generators & Power', description: 'Generators, inverters, solar panels' },
{ name: 'Medical Equipment', description: 'For health programs (if applicable)' },
{ name: 'Field Equipment', description: 'Water pumps, tents, tools' },
];

const categories = [];
for (const data of categoriesData) {
const cat = await prisma.assetCategory.upsert({
where: { name: data.name },
update: data,
create: data,
});
categories.push(cat);
console.log(`→ Category: ${cat.name}`);
}
console.log('Seeded Asset-related models...');
}
/*
checkRecordExists = await prisma.asset.count();
if (checkRecordExists === 0) {
console.log('Seeding Asset models...');

// ────────────────────────────────────────────────
// 2. Fetch existing data (projects, employees, users)
// ────────────────────────────────────────────────
const projects = await prisma.project.findMany({ take: 8, select: { id: true, name: true } });
const employees = await prisma.employee.findMany({ take: 10, select: { id: true, fname: true, lname: true } });
const curassetCategory = await prisma.assetCategory.findMany();
const assetLocations = await prisma.officeLocation.findMany();
const users = await prisma.user.findMany({ take: 5, select: { id: true } }); // for createdBy / checkedOutBy

if (projects.length === 0) console.warn('⚠️ No projects found — skipping allocations');
if (employees.length === 0) console.warn('⚠️ No employees found — skipping assignments');

// ────────────────────────────────────────────────
// 3. Seed Assets (10 realistic examples)
// ────────────────────────────────────────────────

const assetsData = [
{
assetTag: 'LAG-IT-LAP-001',
name: 'Dell Latitude 5430 Laptop',
description: 'Field officer laptop - i5, 16GB RAM',
serialNumber: 'DELL987654321',
purchaseDate: subYears(new Date(), 2),
purchasePrice: 850000,
currency: 'NGN',
salvageValue: 150000,
usefulLifeYears: 5,
depreciationMethod: 'STRAIGHT_LINE',
status: 'ASSIGNED',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'LAG-IT-LAP-002',
name: 'HP ProBook 450 G9',
description: 'Program manager laptop - i7, 16GB RAM',
serialNumber: 'HP123456789',
purchaseDate: subYears(new Date(), 1),
purchasePrice: 920000,
currency: 'NGN',
salvageValue: 180000,
usefulLifeYears: 5,
depreciationMethod: 'STRAIGHT_LINE',
status: 'AVAILABLE',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'ABJ-IT-PRN-001',
name: 'HP LaserJet Pro M404dn',
description: 'Office network printer',
serialNumber: 'HPLJ4042023',
purchaseDate: subYears(new Date(), 3),
purchasePrice: 320000,
currency: 'NGN',
salvageValue: 50000,
usefulLifeYears: 4,
depreciationMethod: 'STRAIGHT_LINE',
status: 'ASSIGNED',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'LAG-VEH-001',
name: 'Toyota Hilux 2023',
description: 'Project field vehicle',
serialNumber: 'HILUX2023NG',
purchaseDate: subYears(new Date(), 1),
purchasePrice: 42000000,
currency: 'NGN',
salvageValue: 8000000,
usefulLifeYears: 5,
depreciationMethod: 'DECLINING_BALANCE',
status: 'ASSIGNED',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'ABJ-FUR-001',
name: 'Executive Office Desk',
description: 'Mahogany executive desk',
serialNumber: 'DESK001ABJ',
purchaseDate: subYears(new Date(), 4),
purchasePrice: 450000,
currency: 'NGN',
salvageValue: 50000,
usefulLifeYears: 8,
depreciationMethod: 'STRAIGHT_LINE',
status: 'IN_USE',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'ABJ-VEH-TOY-002',
name: 'Toyota Hilux Double Cab 2023',
description: 'Field monitoring vehicle - diesel',
serialNumber: 'JTE123456789',
purchaseDate: subYears(new Date(), 1.5),
purchasePrice: 28000000,
currency: 'NGN',
salvageValue: 5000000,
usefulLifeYears: 8,
depreciationMethod: 'STRAIGHT_LINE',
status: 'ASSIGNED',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'KANO-GEN-PET-004',
name: 'Perkins 15kVA Diesel Generator',
description: 'Backup power for Kano office',
serialNumber: 'PERK15KVA004',
purchaseDate: subYears(new Date(), 4),
purchasePrice: 3200000,
currency: 'NGN',
salvageValue: 400000,
usefulLifeYears: 10,
depreciationMethod: 'STRAIGHT_LINE',
status: 'UNDER_MAINTENANCE',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'ABJ-VEH-HON-006',
name: 'Honda CRF250 Motorcycle',
description: 'Rural outreach bike',
serialNumber: 'HONDA-CRF250-06',
purchaseDate: subYears(new Date(), 2),
purchasePrice: 1800000,
currency: 'NGN',
salvageValue: 300000,
usefulLifeYears: 6,
depreciationMethod: 'STRAIGHT_LINE',
status: 'ASSIGNED',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'LAG-IT-SRV-009',
name: 'HP ProLiant ML30 Server',
description: 'Data center server',
serialNumber: 'HPML30-009',
purchaseDate: subYears(new Date(), 2),
purchasePrice: 3200000,
currency: 'NGN',
salvageValue: 500000,
usefulLifeYears: 6,
depreciationMethod: 'DECLINING_BALANCE',
status: 'AVAILABLE',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: null,
},
{
assetTag: 'DISP-001',
name: 'Old Lenovo ThinkPad',
description: 'Disposed legacy laptop',
serialNumber: 'LEN-OLD-001',
purchaseDate: subYears(new Date(), 6),
purchasePrice: 450000,
currency: 'NGN',
salvageValue: 0,
usefulLifeYears: 5,
depreciationMethod: 'STRAIGHT_LINE',
status: 'DISPOSED',
categoryId: randomItem(curassetCategory).id,
location: randomItem(assetLocations).id,
disposedAt: new Date('2025-11-15'),
},
];

for (const data of assetsData) {
const assetData: Prisma.AssetUncheckedCreateInput = {
assetTag: data.assetTag,
name: data.name || 'Unnamed Asset',
description: data.description || null,
serialNumber: data.serialNumber || null,
purchaseDate: data.purchaseDate || null,
purchasePrice: data.purchasePrice || null,
currency: data.currency || 'NGN',
salvageValue: data.salvageValue || 0,
usefulLifeYears: data.usefulLifeYears || null,
depreciationMethod: data.depreciationMethod 
? data.depreciationMethod as DepreciationMethod 
: DepreciationMethod.STRAIGHT_LINE,
status: AssetStatus.AVAILABLE,
categoryId: data.categoryId || null,
locationId: data.location || null,           // ← safe now
//notes: data.notes || null,
createdById: adminUserId,
// add disposal fields only if present
};

const asset = await prisma.asset.upsert({
where: { assetTag: data.assetTag },
update: assetData as Prisma.AssetUncheckedUpdateInput,
create: assetData,
});
}
console.log('Seeded Asset models...');
}
*/

/*
checkRecordExists = await prisma.assetProjectAllocation.count();
if (checkRecordExists === 0) {
console.log('Seeding assetProjectAllocation...');
const projects = await prisma.project.findMany();
const assets = await prisma.asset.findMany();

// ────────────────────────────────────────────────
// 4. Seed Project Allocations (for some assets)
// ────────────────────────────────────────────────
for (const asset of assets.slice(0, 6)) { // first 6 assets get projects
if (projects.length > 0) {
const numProjects = Math.floor(Math.random() * 2) + 1; // 1–2 projects
const shuffled = [...projects].sort(() => 0.5 - Math.random());
const selected = shuffled.slice(0, numProjects);

for (const proj of selected) {
await prisma.assetProjectAllocation.upsert({
where: {
assetId_projectId: { assetId: asset.id, projectId: proj.id },
},
create: {
assetId: asset.id,
projectId: proj.id,
allocationPercentage: numProjects === 1 ? 100 : 50,
allocatedAt: new Date(),
createdById: adminUserId,
},
update: {},
});
console.log(`  ↳ Allocated ${asset.assetTag} to project ${proj.name} (${numProjects === 1 ? '100' : '50'}%)`);
}}}
console.log('Seeded assetProjectAllocation...');
}

checkRecordExists = await prisma.assetAssignment.count();
if (checkRecordExists === 0) {
const projects = await prisma.project.findMany();
const employees = await prisma.employee.findMany();
const assets = await prisma.asset.findMany();

console.log('Seeding assetAssignment...');
for (const asset of assets.slice(0, 5)) {
await prisma.assetAssignment.create({
data: {
assetId: asset.id,
assignedToType: 'EMPLOYEE',
employeeId: randomItem(employees).id,
assignedToId: randomItem(employees).id,
checkedOutAt: subYears(new Date(), 1),
expectedReturn: addMonths(new Date(), 6),
purpose: 'Field monitoring in North-East',
checkedOutById: adminUserId,
isActive: true,
},
});
console.log(`  ↳ Assigned ${asset.assetTag}`);
}
console.log('Seeded assetAssignment...');
}


checkRecordExists = await prisma.assetDepreciation.count();
if (checkRecordExists === 0) {
const assets = await prisma.asset.findMany();
console.log('Seeding assetDepreciation...');
for (const asset of assets.slice(0, 4)) {
if (asset.depreciationMethod === 'NONE' || !asset.purchaseDate) continue;

const startDate = startOfMonth(asset.purchaseDate);
let periodStart = startDate;
const today = new Date();

while (periodStart < today) {
const periodEnd = endOfMonth(periodStart);

const annualDep = (asset.purchasePrice! - asset.salvageValue!) / asset.usefulLifeYears!;
const monthlyDep = annualDep / 12;

const accumulated = monthlyDep * (differenceInMonths(periodStart, startDate) + 1);
const bookValue = Math.max(asset.salvageValue!, asset.purchasePrice! - accumulated);

await prisma.assetDepreciation.upsert({
where: {
assetId_periodStart: { assetId: asset.id, periodStart },
},
create: {
assetId: asset.id,
periodStart,
periodEnd,
depreciationAmount: Math.round(monthlyDep * 100) / 100,
accumulatedDepreciation: Math.round(accumulated * 100) / 100,
bookValue: Math.round(bookValue * 100) / 100,
methodUsed: asset.depreciationMethod!,
createdById: adminUserId,
},
update: {},
});

periodStart = addMonths(periodStart, 1);
}

// Update currentBookValue
await prisma.asset.update({
where: { id: asset.id },
data: { currentBookValue: assets.find(a => a.id === asset.id)?.purchasePrice! -  0 },
});

console.log(`  ↳ Generated depreciation entries for ${asset.assetTag}`);
}
console.log('Seeded assetDepreciation...');
}

*/
/*
checkRecordExists = await prisma.userRole.count();
if (checkRecordExists === 0) {
console.log('Seeding workflow approvals...');
// Clear in dev only
await prisma.approvalHistory.deleteMany();
await prisma.approvalRequest.deleteMany();
await prisma.approvalLevel.deleteMany();
await prisma.approvalWorkflow.deleteMany();

// ==============================
// 1️⃣ SEED ROLES
// ==============================

const roles = await prisma.userRole.createMany({
data: [
{ name: 'Executive Director', code: 'EXEC_DIR', createdById: adminUserId, },
{ name: 'Chief Finance Officer', code: 'CFO', createdById: adminUserId, },
{ name: 'Finance Manager', code: 'FIN_MANAGER', createdById: adminUserId, },
{ name: 'Finance Officer', code: 'FIN_OFFICER', createdById: adminUserId, },
{ name: 'HR Director', code: 'HR_DIR', createdById: adminUserId, },
{ name: 'HR Manager', code: 'HR_MANAGER', createdById: adminUserId, },
{ name: 'Department Head', code: 'DEPT_HEAD', createdById: adminUserId, },
{ name: 'Line Manager', code: 'LINE_MANAGER', createdById: adminUserId, },
{ name: 'Program Officer', code: 'PROG_OFFICER', createdById: adminUserId, },
{ name: 'USER', code: 'USER', createdById: adminUserId, },
],
});

const allRoles = await prisma.userRole.findMany();
const getRole = (code: string) =>
allRoles.find(r => r.code === code)!;

// ==============================
// 2️⃣ SEED USERS (HQ + State)
// ==============================

const users = await prisma.user.createMany({
data: [
{
password: await bcrypt.hash('user2026', SALT_ROUNDS),
username: 'amina@ngo.org',
userRoleId: getRole('EXEC_DIR').id,
},
{
password: await bcrypt.hash('user2026', SALT_ROUNDS),
username: 'cfo@ngo.org',
userRoleId: getRole('CFO').id,
},
{
password: await bcrypt.hash('user2026', SALT_ROUNDS),
username: 'finance.manager@ngo.org',
userRoleId: getRole('FIN_MANAGER').id,
},
{
password: await bcrypt.hash('user2026', SALT_ROUNDS),
username: 'hr.director@ngo.org',
userRoleId: getRole('HR_DIR').id,
},
{
password: await bcrypt.hash('user2026', SALT_ROUNDS),
username: 'dept.head.lagos@ngo.org',
userRoleId: getRole('DEPT_HEAD').id,
},
{
password: await bcrypt.hash('user2026', SALT_ROUNDS),
username: 'program.kaduna@ngo.org',
userRoleId: getRole('PROG_OFFICER').id,
},
],
});

// ==============================
// 3️⃣ SEED WORKFLOWS
// ==============================

const recruitmentWorkflow = await prisma.approvalWorkflow.create({
data: {
name: 'Recruitment Approval Workflow',
module: WorkflowModule.RECRUITMENT,
isActive: true,
levels: {
create: [
{
levelOrder: 1,
roleId: getRole('DEPT_HEAD').id,
escalationHours: 48,
},
{
levelOrder: 2,
roleId: getRole('FIN_MANAGER').id,
escalationHours: 48,
},
{
levelOrder: 3,
roleId: getRole('HR_DIR').id,
escalationHours: 72,
isFinal: true,
},
],
},
},
});

// ==============================
// 4️⃣ SEED TEST APPROVAL REQUEST
// ==============================

const deptHead = await prisma.user.findFirst({
where: { username: 'dept.head.lagos@ngo.org' },
});

const testRequest = await prisma.approvalRequest.create({
data: {
workflowId: recruitmentWorkflow.id,
referenceId: 'VAC-2026-001',
module: 'RECRUITMENT',
initiatedById: deptHead!.id,
},
});

console.log('✅ Nigeria NGO structure seeded successfully!');
}
*/

checkRecordExists = await prisma.interventionCategory.count();
if (checkRecordExists === 0) {
console.log("Categories seeding .... ✔");
const categories = [
{ name: "Cash Transfer", createdById: adminUserId },
{ name: "Food Distribution", createdById: adminUserId },
{ name: "Livelihood Support", createdById: adminUserId },
{ name: "Medical Assistance", createdById: adminUserId },
{ name: "Education Support", createdById: adminUserId },
{ name: "Shelter & NFI Support", createdById: adminUserId },
{ name: "Psycho-social Support", createdById: adminUserId },
];

for (const category of categories) {
await prisma.interventionCategory.upsert({
where: { name: category.name },
update: {},
create: category,
});
}

console.log("Categories seeded ✔");
}

/*
checkRecordExists = await prisma.program.count();
if (checkRecordExists === 0) {
console.log("Seeding Programs...");

const programs = [
{
name: "Emergency Response Program 2026",
description:
"Rapid humanitarian assistance for vulnerable households affected by displacement and flooding.",
startDate: new Date("2026-01-01"),
endDate: new Date("2026-12-31"),
budget: 250000000,
objective:
"Provide life-saving assistance to 10,000 vulnerable households across 3 states.",
baseline:
"Initial assessment shows 10,000 households lack access to food and essential services.",
midline:
"Mid-year evaluation to assess food security improvement and access to services.",
endline:
"Final evaluation to measure reduction in vulnerability and recovery levels.",
status: ProgramStatus.ACTIVE,
reportingFrequency: PayFrequency.QUARTERLY,
createdById: adminUserId,
},
{
name: "Livelihood Recovery Program 2026",
description:
"Economic empowerment initiative to restore income-generating activities for affected communities.",
startDate: new Date("2026-02-01"),
endDate: new Date("2027-01-31"),
budget: 400000000,
objective:
"Support 5,000 beneficiaries with grants and vocational tools to rebuild livelihoods.",
baseline:
"70% of affected households report loss of income sources.",
midline:
"Assess percentage of beneficiaries who have restarted income-generating activities.",
endline:
"Measure sustained income growth and business survival rate.",
status: ProgramStatus.ACTIVE,
reportingFrequency: PayFrequency.QUARTERLY,
createdById: adminUserId,
},
];

for (const program of programs) {
await prisma.program.upsert({
where: { name: program.name },
update: {},
create: program,
});
}

console.log("Programs seeded successfully ✔");
console.log("Programs seeded ✔");
}

checkRecordExists = await prisma.intervention.count();
if (checkRecordExists === 0) {
const interventionCategory = await prisma.interventionCategory.findMany();
console.log("intervention seeding ✔");
 /*
  const entrepreneurshipTraining = await prisma.intervention.create({
    data: {
      name: "Entrepreneurship Training",
      description: "Business training for small entrepreneurs",
      categoryId: randomItem(interventionCategory).id,
    },
  })

  const businessGrant = await prisma.intervention.create({
    data: {
      name: "Business Grant",
      description: "Financial grant for business support",
      categoryId: randomItem(interventionCategory).id,
    },
  })

  const businessGra = await prisma.intervention.create({
    data: {
      name: "SME Grant",
      description: "Financial grant for business support",
      categoryId: randomItem(interventionCategory).id,
    },
  })

console.log("intervention seeded successfully ✔");
}


checkRecordExists = await prisma.masterIndicator.count();
if (checkRecordExists === 0) {
console.log("Seeding master indicator...");
await prisma.masterIndicator.createMany({
data: [
{
code: "OUT-001",
name: "Number of beneficiaries reached",
definition: "Total individuals directly supported",
unit: "Persons",
frequency: "MONTHLY",
type: "OUTPUT",
},
{
code: "OUT-002",
name: "Number of people trained",
definition: "Participants completing training",
unit: "Persons",
frequency: "MONTHLY",
type: "OUTPUT",
},
{
code: "OUTC-001",
name: "% Increase in income",
definition: "Percentage increase in average income",
unit: "Percentage",
frequency: "QUARTERLY",
type: "OUTCOME",
},
{
code: "OUT-003",
name: "Number of health outreaches conducted",
definition: "Total outreach sessions conducted",
unit: "Sessions",
frequency: "MONTHLY",
type: "OUTPUT",
},
{
code: "OUT-004",
name: "Water points installed",
definition: "Functional water facilities installed",
unit: "Units",
frequency: "QUARTERLY",
type: "OUTPUT",
},
{
code: "OUTC-002",
name: "% School retention rate",
definition: "Percentage of students retained",
unit: "Percentage",
frequency: "ANNUALLY",
type: "OUTCOME",
},
{
code: "IMP-001",
name: "Poverty reduction rate",
definition: "Reduction in poverty among beneficiaries",
unit: "Percentage",
frequency: "ANNUALLY",
type: "IMPACT",
},
],
});


const masterIndicators = await prisma.masterIndicator.findMany();
const programList = await prisma.program.findMany();
for (let i = 0; i < 7; i++) {
await prisma.programIndicator.create({
data: {
programId: programList[i].id,
masterIndicatorId: masterIndicators[i].id,
target: 1000 + i * 500,
},
});
}


const programIndicators = await prisma.programIndicator.findMany();
const projectList = await prisma.project.findMany();

for (let i = 0; i < 7; i++) {
await prisma.projectIndicator.create({
data: {
projectId: projectList[i].id,
programIndicatorId: programIndicators[i].id,
target: 200 + i * 100,
},
});
}


const quarters = [
"2025-Q1",
"2025-Q2",
"2025-Q3",
"2025-Q4",
];

const projectIndicators = await prisma.projectIndicator.findMany();

for (const pi of projectIndicators) {
let base = 120;

for (let q = 0; q < 4; q++) {
const male = base + q * 40;
const female = base + q * 50;

await prisma.indicatorReport.create({
data: {
projectIndicatorId: pi.id,
reportingPeriod: quarters[q],
male,
female,
youth: Math.floor((male + female) * 0.6),
pwd: Math.floor((male + female) * 0.1),
actualValue: male + female,
},
});
}
}

await prisma.program.updateMany({
data: {
budget: 5000000
}
});

await prisma.project.updateMany({
data: {
budget: 1000000,
amountSpent: 750000
}
});
console.log("master indicator seeded ✔");
}
*/
/*
checkRecordExists = await prisma.employee.count();
const checkRecordPayrollExists = await prisma.payroll.count();
if (checkRecordExists > 0 && checkRecordPayrollExists === 0) {
console.log('✅ Payroll seeding started.');
const employees = await prisma.employee.findMany({
where: { deletedAt: null },
});

const payrollPeriods = await prisma.payrollPeriod.findMany({
where: { deletedAt: null },
orderBy: { createdAt: 'asc' },
});

if (payrollPeriods.length < 3) {
throw new Error('You must seed at least 3 PayrollPeriods first.');
}

for (const employee of employees) {
for (let i = 0; i < 3; i++) {

console.log('✅ Payroll seeding started. '+i);
const basicSalary = 200000 + Math.floor(Math.random() * 50000);

const paye = basicSalary * 0.1;
const pension = basicSalary * 0.08;
const nhf = basicSalary * 0.025;
const nhis = basicSalary * 0.015;

const totalDeductions = paye + pension + nhf + nhis;
const totalEarnings = basicSalary;
const grossPay = totalEarnings;
const netPay = grossPay - totalDeductions;

await prisma.payroll.create({
data: {
grossPay,
totalEarnings,
totalDeductions,
netPay,
paye,
pension,
nhf,
nhis,
paymentMethod: PaymentMethod.DIRECT_DEPOSIT,
employeeId: employee.id,
payrollPeriodId: payrollPeriods[i].id, // ✅ Use existing PayrollPeriod ID
},
});
}
}

console.log('✅ Payroll seeded successfully.');
}
*/

/*
checkRecordExists = await prisma.payrollDeduction.count();
if (checkRecordExists === 0) {
console.log(`seeding payrollDeduction`);
const payrolls = await prisma.payroll.findMany({
where: { deletedAt: null },
});

if (!payrolls.length) {
throw new Error('No payroll records found. Seed payroll first.');
}

for (const payroll of payrolls) {
const deductions = [
{
name: 'PAYE',
amount: payroll.paye ?? 0,
preTax: true,
percentage: 10,
},
{
name: 'Pension',
amount: payroll.pension ?? 0,
preTax: true,
percentage: 8,
},
{
name: 'NHF',
amount: payroll.nhf ?? 0,
preTax: false,
percentage: 2.5,
},
];

for (const deduction of deductions) {
await prisma.payrollDeduction.create({
data: {
payrollId: payroll.id, // ✅ Use seeded payroll ID
name: deduction.name,
amount: deduction.amount,
preTax: deduction.preTax,
percentage: deduction.percentage,
},
});
}
}

console.log('✅ Payroll deductions seeded successfully.');

console.log(`seeded payrollDeduction`);
}


checkRecordExists = await prisma.holidayCalendar.count();
if (checkRecordExists === 0) {
console.log("start seeding holiday calendars");
const holidays = [
{
name: "New Year's Day",
date: new Date("2026-01-01"),
isRecurring: true,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Good Friday",
date: new Date("2026-04-03"),
isRecurring: false,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Easter Monday",
date: new Date("2026-04-06"),
isRecurring: false,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Workers' Day",
date: new Date("2026-05-01"),
isRecurring: true,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Eid al-Fitr",
date: new Date("2026-03-20"),
isRecurring: false,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Eid al-Fitr Holiday",
date: new Date("2026-03-21"),
isRecurring: false,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Eid al-Adha",
date: new Date("2026-05-27"),
isRecurring: false,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Eid al-Adha Holiday",
date: new Date("2026-05-28"),
isRecurring: false,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Democracy Day",
date: new Date("2026-06-12"),
isRecurring: true,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Eid al-Maulud",
date: new Date("2026-08-26"),
isRecurring: false,
country: "Nigeria",
},
{
name: "Independence Day",
date: new Date("2026-10-01"),
isRecurring: true,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Christmas Day",
date: new Date("2026-12-25"),
isRecurring: true,
country: "Nigeria",
createdById: adminUserId,
},
{
name: "Boxing Day",
date: new Date("2026-12-26"),
isRecurring: true,
country: "Nigeria",
createdById: adminUserId,
},
];


for (const holiday of holidays) {
await prisma.holidayCalendar.upsert({
where: {
name_date: {
name: holiday.name,
date: holiday.date,
},
},
update: {},
create: holiday,
});
}

console.log("Nigeria holiday calendar seeded");
}
*/
checkRecordExists = await prisma.workSchedule.count();
if (checkRecordExists === 0) {
console.log("start seeding workSchedule");

  /* -----------------------------
     CREATE WORK SCHEDULES
  ------------------------------*/

  const officeSchedule = await prisma.workSchedule.create({
    data: {
      name: "Corporate Office Schedule",
      workingDays: "MON,TUE,WED,THU,FRI",
      dailyWorkingHours: 8,
      breakDurationMinutes: 60,
      startTime: new Date("1970-01-01T09:00:00Z"),
      endTime: new Date("1970-01-01T17:00:00Z"),
      flexibleStartWindow: 30,
      flexibleEndWindow: 30,
      isNightShift: false,
      createdById: adminUserId,
    }
  });

  const manufacturingSchedule = await prisma.workSchedule.create({
    data: {
      name: "Manufacturing 3 Shift Schedule",
      workingDays: "MON,TUE,WED,THU,FRI,SAT",
      dailyWorkingHours: 8,
      breakDurationMinutes: 30,
      startTime: new Date("1970-01-01T06:00:00Z"),
      endTime: new Date("1970-01-01T22:00:00Z"),
      isNightShift: false,
      createdById: adminUserId,
    }
  });

  const hospitalSchedule = await prisma.workSchedule.create({
    data: {
      name: "Hospital Rotational Schedule",
      workingDays: "MON,TUE,WED,THU,FRI,SAT,SUN",
      dailyWorkingHours: 8,
      breakDurationMinutes: 30,
      startTime: new Date("1970-01-01T07:00:00Z"),
      endTime: new Date("1970-01-01T23:00:00Z"),
      isNightShift: false,
      createdById: adminUserId,
    }
  });

  const nightSupportSchedule = await prisma.workSchedule.create({
    data: {
      name: "Night Support Schedule",
      workingDays: "MON,TUE,WED,THU,FRI,SAT,SUN",
      dailyWorkingHours: 8,
      breakDurationMinutes: 45,
      startTime: new Date("1970-01-01T22:00:00Z"),
      endTime: new Date("1970-01-02T06:00:00Z"),
      isNightShift: true,
      createdById: adminUserId,
    }
  });

  console.log("WorkSchedules created");

  
  await prisma.shift.createMany({
    data: [

      {
        name: "Corporate Day Shift",
        description: "Regular office working hours",
        startTime: new Date("1970-01-01T09:00:00Z"),
        endTime: new Date("1970-01-01T17:00:00Z"),
        breakMinutes: 60,
        shiftDifferentialRate: 1,
        scheduleId: officeSchedule.id,
      createdById: adminUserId,
      },

      {
        name: "Morning Shift",
        description: "Manufacturing morning shift",
        startTime: new Date("1970-01-01T06:00:00Z"),
        endTime: new Date("1970-01-01T14:00:00Z"),
        breakMinutes: 30,
        shiftDifferentialRate: 1,
        scheduleId: manufacturingSchedule.id,
      createdById: adminUserId,
      },

      {
        name: "Afternoon Shift",
        description: "Manufacturing afternoon shift",
        startTime: new Date("1970-01-01T14:00:00Z"),
        endTime: new Date("1970-01-01T22:00:00Z"),
        breakMinutes: 30,
        shiftDifferentialRate: 1.05,
        scheduleId: manufacturingSchedule.id,
      createdById: adminUserId,
      },

      {
        name: "Night Shift",
        description: "Overnight shift for operations",
        startTime: new Date("1970-01-01T22:00:00Z"),
        endTime: new Date("1970-01-02T06:00:00Z"),
        breakMinutes: 45,
        shiftDifferentialRate: 1.25,
        scheduleId: nightSupportSchedule.id,
        isNightShift: true,
      createdById: adminUserId,
      },

      {
        name: "Hospital Morning Shift",
        description: "Hospital staff morning shift",
        startTime: new Date("1970-01-01T07:00:00Z"),
        endTime: new Date("1970-01-01T15:00:00Z"),
        breakMinutes: 30,
        scheduleId: hospitalSchedule.id,
      createdById: adminUserId,
      },

      {
        name: "Hospital Evening Shift",
        description: "Hospital staff evening shift",
        startTime: new Date("1970-01-01T15:00:00Z"),
        endTime: new Date("1970-01-01T23:00:00Z"),
        breakMinutes: 30,
        scheduleId: hospitalSchedule.id,
      createdById: adminUserId,
      }

    ],
    skipDuplicates: true
  });

  console.log("Shifts created");
}

checkRecordExists = await prisma.attendanceStatus.count();
if (checkRecordExists === 0) {
console.log("start seeding AttendanceStatus");
  await prisma.attendanceStatus.createMany({
    data: [

      {
        code: "PRESENT",
        name: "Present",
        description: "Employee attended work as scheduled",
        policyRule: "clockIn && clockOut",
        autoGenerated: true,
        createdById: adminUserId,
      },
      {
        code: "EXCUSED",
        name: "Excused",
        description: "Employee took permission to be absent",
        policyRule: "clockIn && clockOut",
        autoGenerated: true,
        createdById: adminUserId,
      },
       {
        code: "REGULAR",
        name: "Regular Work Hours",
        description: "Employee worked the full scheduled hours",
        policyRule: "workedHours >= scheduledHours",
        autoGenerated: true,
        createdById: adminUserId,
      },


      {
        code: "ABSENT",
        name: "Absent",
        description: "Employee did not report to work",
        policyRule: "!clockIn",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "LATE",
        name: "Late Arrival",
        description: "Employee arrived after allowed clock-in time",
        policyRule: "clockIn > shiftStart",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "EARLY_LEAVE",
        name: "Early Departure",
        description: "Employee left work earlier than scheduled",
        policyRule: "clockOut < shiftEnd",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "HALF_DAY",
        name: "Half Day",
        description: "Employee worked only half of scheduled hours",
        policyRule: "workedHours < requiredHours / 2",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "ON_LEAVE",
        name: "On Leave",
        description: "Employee is on approved leave",
        policyRule: "approvedLeave",
        autoGenerated: false,
        createdById: adminUserId,
      },

      {
        code: "SICK_LEAVE",
        name: "Sick Leave",
        description: "Employee is absent due to illness",
        policyRule: "approvedSickLeave",
        autoGenerated: false,
        createdById: adminUserId,
      },

      {
        code: "HOLIDAY",
        name: "Public Holiday",
        description: "Public holiday in holiday calendar",
        policyRule: "holidayCalendar",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "REMOTE",
        name: "Remote Work",
        description: "Employee worked remotely",
        policyRule: "remoteWorkApproved",
        autoGenerated: false,
        createdById: adminUserId,
      },

      {
        code: "OVERTIME",
        name: "Overtime",
        description: "Employee worked beyond scheduled hours",
        policyRule: "workedHours > scheduledHours",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "OFF_DAY",
        name: "Scheduled Off Day",
        description: "Employee scheduled day off",
        policyRule: "notWorkingDay",
        autoGenerated: true,
        createdById: adminUserId,
      },

      {
        code: "TRAINING",
        name: "Training",
        description: "Employee attending official training",
        policyRule: "trainingAssignment",
        autoGenerated: false,
        createdById: adminUserId,
      }

    ],
    skipDuplicates: true
  });

  console.log("Attendance statuses seeded");

}


/*
checkRecordExists = await prisma.shiftEmployee.count();
if (checkRecordExists === 0) {
console.log("start seeding shiftEmployee");
  const employees = await prisma.employee.findMany()
  const shifts = await prisma.shift.findMany()

  for (const employee of employees) {

    const assignShift = Math.random() < 0.3

    if (!assignShift) continue

    const randomShift = shifts[Math.floor(Math.random() * shifts.length)]

    await prisma.shiftEmployee.create({
      data: {
        employeeId: employee.id,
        shiftId: randomShift.id
      }
    })

  }
  console.log("shift employee seeded");
}

*/


/*
checkRecordExists = await prisma.attendance.count();
if (checkRecordExists === 0) {
  console.log("start seeding Attendance");
const employees = await prisma.employee.findMany()
 const start = new Date("2025-11-01")
 const end   = new Date("2026-02-28")

 for (const employee of employees) {

   const shiftAssignment = await prisma.shiftEmployee.findFirst({
     where:{ employeeId: employee.id, deletedAt:null },
     include:{ shift:true }
   })

   let current = new Date(start)

   while (current <= end) {

     if (!isWeekend(current)) {

       const absentChance = Math.random()

       if (absentChance > 0.1) {

         let baseStart
         let baseEnd
         let shiftId = null

         if (shiftAssignment) {

           const shift = shiftAssignment.shift
           shiftId = shift.id

           baseStart = new Date(current)
           baseStart.setHours(
             shift.startTime.getHours(),
             shift.startTime.getMinutes()
           )

           baseEnd = new Date(current)
           baseEnd.setHours(
             shift.endTime.getHours(),
             shift.endTime.getMinutes()
           )

         } else {

           baseStart = new Date(current)
           baseStart.setHours(9,0)

           baseEnd = new Date(current)
           baseEnd.setHours(17,0)

         }

         const clockIn = addMinutes(baseStart, randomMinutes(-10,15))
         const clockOut = addMinutes(baseEnd, randomMinutes(-20,60))

         await prisma.attendance.create({
           data:{
             employeeId: employee.id,
             shiftId,
             clockIn,
             clockOut,
             workDate: current,
             captureMethod: "WEB",
             overtimeHours: Math.max(
               0,
               (clockOut.getTime()-baseEnd.getTime())/3600000
             )
           }
         })

       }

     }

     current.setDate(current.getDate()+1)

    }}
  console.log("Attendance seeded");
}


checkRecordExists = await prisma.attendanceSummary.count();
if (checkRecordExists === 0) {
  console.log("start seeding Attendance summary");
  const employees = await prisma.employee.findMany()

  const months = [
    { start: new Date("2025-11-01"), end: new Date("2025-11-30") },
    { start: new Date("2025-12-01"), end: new Date("2025-12-31") },
    { start: new Date("2026-01-01"), end: new Date("2026-01-31") },
    { start: new Date("2026-02-01"), end: new Date("2026-02-28") }
  ]

  for (const employee of employees) {

    for (const month of months) {

      const attendances = await prisma.attendance.findMany({
        where: {
          employeeId: employee.id,
          workDate: {
            gte: month.start,
            lte: month.end
          }
        },
        include: {
          shift: true
        }
      })

      const workingDays = getWorkingDays(month.start, month.end)

      const presentDays = attendances.length
      const absentDays = Math.max(0, workingDays - presentDays)

      let overtimeHours = 0
      let shiftAllowanceAmount = 0

      for (const att of attendances) {

        overtimeHours += Math.floor(att.overtimeHours || 0)

        if (att.shift && att.shift.shiftDifferentialRate) {

          shiftAllowanceAmount += att.shift.shiftDifferentialRate

        }

      }

      await prisma.attendanceSummary.create({
        data: {
          employeeId: employee.id,
          periodStart: month.start,
          periodEnd: month.end,
          workingDays,
          presentDays,
          absentDays,
          overtimeHours,
          unpaidLeaveDays: 0,
          latePenaltyAmount: 0,
          shiftAllowanceAmount
        }
      })

    }}
    console.log("Attendance summary seeded");
}

checkRecordExists = await prisma.performanceRatingScale.count();
if (checkRecordExists === 0) {
const employees = await prisma.employee.findMany({
take: 50
})

if (employees.length < 15) { throw new Error("At least 20 employees required"); }
const managers = employees.slice(0,5)

await prisma.performanceRatingScale.createMany({
data: [
{ name:"Outstanding", score:5 },
{ name:"Very Good", score:4.5 },
{ name:"Exceeds Expectations", score:4 },
{ name:"Good", score:3.5 },
{ name:"Meets Expectations", score:3 },
{ name:"Below Average", score:2.5 },
{ name:"Needs Improvement", score:2 },
{ name:"Poor", score:1.5 },
{ name:"Unsatisfactory", score:1 },
]
})

console.log("Rating scales seeded")

//
// 2️⃣ PERFORMANCE CYCLES (MASTER)
//

const cycles:any[] = []

for(let i=1;i<=5;i++){

const cycle = await prisma.performanceCycle.create({
data:{
name:`Performance Cycle ${i}`,
startDate:new Date(`2025-01-01`),
endDate:new Date(`2025-12-31`),
status:"ACTIVE"
}
})

cycles.push(cycle)

}

console.log("Performance cycles seeded")

//
// 3️⃣ GOALS (SLAVE)
//

const goals:any[] = []

for(let i=0;i<12;i++){

const employee = employees[i]
const cycle = cycles[i % cycles.length]

const goal = await prisma.performanceGoal.create({

data:{
employeeId:employee.id,
cycleId:cycle.id,

title:`Goal ${i+1}`,
description:"Improve department productivity and KPI delivery",

weight:Math.floor(Math.random()*40)+10,

targetValue:100,
achievedValue:Math.floor(Math.random()*100),

progress:Math.floor(Math.random()*100)
}

})

goals.push(goal)

}

console.log("Goals seeded")

//
// 4️⃣ APPRAISALS (SLAVE)
//

const appraisals:any[] = []

for(let i=0;i<15;i++){

const employee = employees[i]
const manager = managers[i % managers.length]
const cycle = cycles[i % cycles.length]

const appraisal = await prisma.performanceAppraisal.create({

data:{
employeeId:employee.id,
managerId:manager.id,
cycleId:cycle.id,

selfComment:"I achieved most of my assigned goals.",
managerComment:"Employee shows strong work ethic and collaboration.",
hrComment:"Approved after HR review.",

status:"HR_REVIEW",

finalScore:parseFloat((Math.random()*5).toFixed(2))
}

})

appraisals.push(appraisal)

}

console.log("Appraisals seeded")

//
// 5️⃣ APPRAISAL RATINGS (SLAVE)
//

for(let i=0;i<12;i++){

await prisma.performanceAppraisalRating.create({

data:{
appraisalId:appraisals[i].id,
goalId:goals[i].id,

score:Math.floor(Math.random()*5)+1,

comment:"Goal performance evaluated"
}

})

}

console.log("Appraisal ratings seeded")

//
// 6️⃣ FEEDBACK (SLAVE)
//

for(let i=0;i<15;i++){

const employee = employees[i]
const reviewer = employees[(i+3) % employees.length]
const cycle = cycles[i % cycles.length]

await prisma.performanceFeedback.create({

data:{
employeeId:employee.id,
reviewerId:reviewer.id,
cycleId:cycle.id,

rating:Math.floor(Math.random()*5)+1,

comment:"Consistently demonstrates teamwork and accountability."
}

})

}

console.log("Feedback seeded")

//
// 7️⃣ DEVELOPMENT PLANS (SLAVE)
//

for(let i=0;i<15;i++){

const employee = employees[i]
const appraisal = appraisals[i]

await prisma.performanceDevelopmentPlan.create({

data:{
employeeId:employee.id,
appraisalId:appraisal.id,

strengths:"Leadership, collaboration, communication",

weaknesses:"Delegation and time prioritization",

actionPlan:"Attend leadership development program and productivity training"
}})
}

console.log("Development plans seeded")
console.log("Performance Module Seed Completed")
}
*/
console.log("PSEEDING ngpayeBand")
await prisma.ngpayeBand.deleteMany({});

  // Create exactly one row
  await prisma.ngpayeBand.create({
    data: {
      B1: 300000.00,
      B2: 300000.00,
      B3: 500000.00,
      B4: 500000.00,
      B5: 1600000.00,
      B6: 0,
      P1: 7,
      P2: 11,
      P3: 15,
      P4: 19,
      P5: 21,
      P6: 24,
      // createdById: "some-user-id-here",   // ← uncomment & fill if needed
      // deletedById: null,                   // already default
    },
  });
console.log("SEEDED ngpayeBand")

checkRecordExists = await prisma.officeRole.count();
if (checkRecordExists === 0) {
 console.log("Office roles start successfully");
  const officeRoles = [
    "Administration",
    "Executive Management",
    "Operations",
    "Human Resources",
    "Finance",
    "Accounting",
    "Information Technology",
    "Marketing",
    "Sales",
    "Customer Service",
    "Project Management",
    "Procurement",
    "Logistics",
    "Legal",
    "Compliance",
    "Audit",
    "Research and Analysis",
    "Strategy and Planning",
    "Business Development",
    "Technical Support",
  ];

  for (const role of officeRoles) {
    await prisma.officeRole.upsert({
      where: { name: role },
      update: {},
      create: {
        name: role,
        createdBy: {
connect: { id: adminUserId },
},
      },
    });
  }

  console.log("Office roles seeded successfully");
}

checkRecordExists = await prisma.approvalWorkflow.count();
if (checkRecordExists === 0) {
  console.log("seeding userRole");
  console.log('Starting seed: User Roles + Approval Workflows');

  // ──────────────────────────────────────────────
  // 1. Seed common User Roles
  // ──────────────────────────────────────────────
  const rolesToCreate = [
    { name: 'Director',           code: 'DIRECTOR'          },
    { name: 'Program Manager',    code: 'PROG_MGR'          },
    { name: 'HR Manager',         code: 'HR_MGR'            },
    { name: 'HR Officer',         code: 'HR_OFFICER'        },
    { name: 'Line Manager',       code: 'LINE_MGR'          },
    { name: 'Case Worker',        code: 'CASE_WORKER'       },
    { name: 'Field Officer',      code: 'FIELD_OFFICER'     },
    { name: 'Admin / Procurement Officer',code: 'PROCUREMENT'       },
    { name: 'Finance Officer',    code: 'FINANCE'           },
    { name: 'M&E Officer',        code: 'M_E_OFFICER'       },
  { name: 'Hiring Manager',        code: 'RECRUIT_MANAGER'    },
  { name: 'Executive Director',        code: 'ED'    },
  { name: 'Chief Finance Officer',        code: 'CFO'    },
  { name: 'Finance Manager',        code: 'FIN_MANAGER'    },
  { name: 'Finance Officer',        code: 'FIN_OFFICER'    },
  { name: 'Department Head',        code: 'DEPT_HEAD'    },
  ];

  console.log('\nSeeding User Roles...');

  const createdRoles: Record<string, string> = {};
  for (const role of rolesToCreate) {
    const existing = await prisma.userRole.findUnique({
      where: { name: role.name },
    });

    if (existing) {
      console.log(`Role already exists: ${role.name} (${role.code})`);
      createdRoles[role.code] = existing.id;
      continue;
    }

    const newRole = await prisma.userRole.create({
      data: {
        name: role.name,
        code: role.code,
        // You can add createdById if you have a system user / seeder user
        createdBy: {
connect: { id: adminUserId },
},
      },
    });

    createdRoles[role.code] = newRole.id;
    console.log(`Created role: ${role.name} (${role.code}) → ${newRole.id}`);
  }


  console.log("seeded userRole");
}
checkRecordExists = await prisma.approvalWorkflow.count();
if (checkRecordExists === 0) {
  console.log("seeding approvalWorkflow");
  // ──────────────────────────────────────────────
  // Helper – find role by name (safer than hard-coded UUIDs)
  // ──────────────────────────────────────────────
  async function getRoleId(name: string): Promise<string> {
    const role = await prisma.userRole.findUnique({
      where: { name },
      select: { id: true },
    });

    if (!role) {
      throw new Error(`Role not found: ${name}`);
    }

    return role.id;
  }


  
async function upsertWorkflow(params: {
  name: string;
  module: WorkflowModule;
  levels: Array<{
    levelOrder: number;
    roleName: string;
    escalationHours: number | null;
    isFinal: boolean;
  }>;
}) {
  const { name, module, levels } = params;

  // Check if workflow already exists
  let workflow = await prisma.approvalWorkflow.findFirst({
    where: { module },
    include: { levels: true },
  });

  if (workflow) {
    console.log(`Workflow already exists: ${name} (${module}) → skipping creation`);
    return workflow;
  }

  // Create new workflow + levels
  workflow = await prisma.approvalWorkflow.create({
    data: {
      name,
      module,
      isActive: true,
      levels: {
        create: await Promise.all(
          levels.map(async (lvl) => ({
            levelOrder: lvl.levelOrder,
            roleId: await getRoleId(lvl.roleName),
            escalationHours: lvl.escalationHours,
            isFinal: lvl.isFinal,
          })),
        ),
      },
    },
    include: { levels: true },
  });

  console.log(`Created workflow: ${name} (${module}) with ${levels.length} levels`);
  return workflow;
}


  // ──────────────────────────────────────────────
  // 1. Beneficiary Onboarding
  // ──────────────────────────────────────────────
  await upsertWorkflow({
    name: 'Beneficiary Onboarding',
    module: WorkflowModule.BENEFICIARY_ONBOARDING,
    levels: [
      {
        levelOrder: 1,
        roleName: 'Case Worker',          // ← change to your actual role names
        escalationHours: 48,
        isFinal: false,
      },
      {
        levelOrder: 2,
        roleName: 'Program Manager',
        escalationHours: 72,
        isFinal: false,
      },
      {
        levelOrder: 3,
        roleName: 'Director',
        escalationHours: null,
        isFinal: true,
      },
    ],
  });

  // ──────────────────────────────────────────────
  // 2. Leave Request Approval
  // ──────────────────────────────────────────────
  await upsertWorkflow({
    name: 'Leave Request Approval',
    module: WorkflowModule.LEAVE_REQUEST,
    levels: [
      {
        levelOrder: 1,
        roleName: 'Line Manager',
        escalationHours: 24,
        isFinal: false,
      },
      {
        levelOrder: 2,
        roleName: 'HR Manager',
        escalationHours: 48,
        isFinal: true,
      },
    ],
  });

  // ──────────────────────────────────────────────
  // 3. Recruitment / Vacancy Approval
  // ──────────────────────────────────────────────
  await upsertWorkflow({
    name: 'Job Vacancy & Recruitment Approval',
    module: WorkflowModule.RECRUITMENT,
    levels: [
      {
        levelOrder: 1,
        roleName: 'Hiring Manager',
        escalationHours: 72,
        isFinal: false,
      },
      {
        levelOrder: 2,
        roleName: 'HR Officer',
        escalationHours: 48,
        isFinal: false,
      },
      {
        levelOrder: 3,
        roleName: 'Director',
        escalationHours: null,
        isFinal: true,
      },
    ],
  });

  // ──────────────────────────────────────────────
  // 4. Asset / Equipment Request
  // ──────────────────────────────────────────────
  await upsertWorkflow({
    name: 'Equipment / Asset Request Approval',
    module: WorkflowModule.EQUIPMENT_REQUEST,
    levels: [
      {
        levelOrder: 1,
        roleName: 'Line Manager',
        escalationHours: 24,
        isFinal: false,
      },
      {
        levelOrder: 2,
        roleName: 'Admin / Procurement Officer',
        escalationHours: null,
        isFinal: true,
      },
    ],
  });

  console.log('Approval workflows seeded successfully.');
}


/*
checkRecordExists = await prisma.interventionCategory.count();
if (checkRecordExists === 0) {
const interventionCategories = [
  {
    name: "Widow Empowerment & Economic Support",
    // Typical: microcredit, vocational training, business startup grants, financial literacy
  },
  {
    name: "Orphans & Vulnerable Children (OVC) Care",
    // Typical: education sponsorship, nutrition, shelter, psychosocial support for orphans
  },
  {
    name: "Gender-Based Violence Prevention & Widow Protection",
    // Typical: advocacy against harmful widowhood rites, legal aid, VAPP Act enforcement support
  },
  {
    name: "Education Support for Orphans & Children of Widows",
    // Typical: school fees, uniforms, books, after-school programs, scholarships
  },
  {
    name: "Health & Nutrition Interventions",
    // Typical: medical outreach, HIV support (common overlap), food packs, malnutrition programs
  },
  {
    name: "Psychosocial Support & Trauma Healing",
    // Typical: counseling, support groups, grief/trauma healing for widows & orphans
  },
  {
    name: "Food Security & Emergency Relief",
    // Typical: food distribution, seasonal support (Christmas/Eid), household items
  },
  {
    name: "Housing & Shelter Assistance",
    // Typical: rent support, home repairs, safe housing for displaced widows/orphans
  },
  {
    name: "Skills Acquisition & Vocational Training",
    // Typical: tailoring, ICT, farming, crafts — especially for widows to gain independence
  },
  {
    name: "Legal Aid & Rights Advocacy",
    // Typical: inheritance rights defense, protection from disinheritance, policy advocacy
  },
  {
    name: "Child Protection & Family Strengthening",
    // Typical: preventing child labor, foster care support, family reunification
  },
  {
    name: "Financial Inclusion & Microfinance",
    // Typical: savings groups (like WISALA), interest-free loans, cooperative formation
  },
];


  console.log("Seeding Intervention Categories...");

  for (const category of interventionCategories) {
    await prisma.interventionCategory.upsert({
      where: { name: category.name },
      update: {},
      create: {
        name: category.name,
        // If you want to auto-assign a creator during seeding (optional):
        // createdById: "some-admin-user-id",
      },
    });
    console.log(`→ Created/Upserted: ${category.name}`);
  }
console.log("Intervention categories seeding complete ✅");
}

checkRecordExists = await prisma.interventionCategory.count();
const checkRecordExists1 = await prisma.intervention.count();
if (checkRecordExists1 === 0 && checkRecordExists > 0) {
  // prisma/seed.ts  (add this function or extend your existing seed)

const interventions = [
  // Widow Empowerment & Economic Support
  { name: "Interest-Free Microcredit & Business Startup Loans", description: "Provide small, interest-free loans to widows for petty trading, farming, or small enterprises with 12-18 month flexible repayment.", categoryName: "Widow Empowerment & Economic Support" },
  { name: "Widow Cooperative Formation & Savings Groups", description: "Organize widows into cooperatives for joint savings, bulk purchasing, and collective marketing to build financial resilience.", categoryName: "Widow Empowerment & Economic Support" },
  { name: "Small & Medium Enterprise (SME) Startup Support", description: "Grant seed capital, business training, and mentoring to help widows launch sustainable income-generating activities.", categoryName: "Widow Empowerment & Economic Support" },

  // Orphans & Vulnerable Children (OVC) Care
  { name: "Household Economic Strengthening for OVC Caregivers", description: "Support caregivers (often widows) with cash transfers, IGA training, and asset provision to improve household stability for OVC.", categoryName: "Orphans & Vulnerable Children (OVC) Care" },
  { name: "Community-Based Child Protection Committees", description: "Establish and train local committees to identify, monitor, and protect vulnerable children from abuse, neglect, and exploitation.", categoryName: "Orphans & Vulnerable Children (OVC) Care" },

  // Education Support for Orphans & Children of Widows
  { name: "School Fees & Scholastic Materials Sponsorship", description: "Cover tuition, uniforms, books, and exam fees for orphans and children from widow-headed households.", categoryName: "Education Support for Orphans & Children of Widows" },
  { name: "After-School Tutoring & Mentoring Clubs", description: "Run remedial classes, life skills sessions, and mentorship for academically at-risk OVC to improve retention and performance.", categoryName: "Education Support for Orphans & Children of Widows" },

  // Skills Acquisition & Vocational Training
  { name: "Vocational Skills Training for Widows (Tailoring, Hairdressing, Crafts)", description: "6-12 month hands-on training in marketable skills with startup toolkits provided upon graduation.", categoryName: "Skills Acquisition & Vocational Training" },
  { name: "Digital Skills & ICT Training for Young Widows", description: "Train widows in social media marketing, basic computing, and online business to access wider markets.", categoryName: "Skills Acquisition & Vocational Training" },
  { name: "Agricultural Training & Farm Input Support", description: "Provide training in modern farming techniques, seeds, and tools to enable widows to engage in agribusiness.", categoryName: "Skills Acquisition & Vocational Training" },

  // Financial Inclusion & Microfinance
  { name: "Village Savings & Loan Associations (VSLA) Formation", description: "Facilitate community savings groups with training on financial literacy and internal lending for widows.", categoryName: "Financial Inclusion & Microfinance" },

  // Psychosocial Support & Trauma Healing
  { name: "Widow Support Groups & Grief Counseling", description: "Weekly peer support meetings combined with professional counseling to address trauma, stigma, and depression.", categoryName: "Psychosocial Support & Trauma Healing" },
  { name: "Child-Focused Psychosocial Activities & Play Therapy", description: "Organize trauma-informed games, storytelling, and counseling sessions for orphans to build emotional resilience.", categoryName: "Psychosocial Support & Trauma Healing" },

  // Gender-Based Violence Prevention & Widow Protection
  { name: "Advocacy Against Harmful Widowhood Practices", description: "Community sensitization and VAPP Act enforcement support to end forced rites, disinheritance, and violence.", categoryName: "Gender-Based Violence Prevention & Widow Protection" },
  { name: "Legal Aid Clinics for Inheritance & Property Rights", description: "Free legal support and paralegal assistance to help widows claim rightful inheritance and protect assets.", categoryName: "Gender-Based Violence Prevention & Widow Protection" },

  // Health & Nutrition Interventions
  { name: "Periodic Medical Outreach & Free Health Screening", description: "Mobile clinics offering check-ups, deworming, malaria treatment, and referrals for widows and OVC.", categoryName: "Health & Nutrition Interventions" },
  { name: "Nutritional Food Packs & Supplementary Feeding", description: "Distribute fortified food items and educate on balanced nutrition for malnourished children and widows.", categoryName: "Health & Nutrition Interventions" },

  // Food Security & Emergency Relief
  { name: "Seasonal Food & Household Item Distribution", description: "Provide food baskets, clothing, and hygiene kits during festive periods or economic hardship.", categoryName: "Food Security & Emergency Relief" },

  // Housing & Shelter Assistance
  { name: "Rent Support & Housing Repair Grants", description: "Offer temporary rent subsidies or funds for roof repairs/home improvements for vulnerable widow-headed households.", categoryName: "Housing & Shelter Assistance" },

  // Legal Aid & Rights Advocacy
  { name: "Birth Registration & Documentation Drive", description: "Assist OVC and widows in obtaining birth certificates, national IDs, and other legal documents for access to services.", categoryName: "Legal Aid & Rights Advocacy" },

  // Child Protection & Family Strengthening
  { name: "Positive Parenting & Caregiver Training", description: "Workshops for widow caregivers on child rights, positive discipline, and family budgeting to strengthen households.", categoryName: "Child Protection & Family Strengthening" },
];
// Fetch all categories
const categories = await prisma.interventionCategory.findMany({
  select: { id: true, name: true },
});

if (!categories.length) {
  throw new Error("No intervention categories found. Seed categories first.");
}

// Helper function to get random category
function getRandomCategory() {
  return categories[Math.floor(Math.random() * categories.length)];
}

for (const interv of interventions) {
  const randomCategory = getRandomCategory();

  await prisma.intervention.upsert({
    where: { name: interv.name },
    update: {
      description: interv.description,
      categoryId: randomCategory.id,
    },
    create: {
      name: interv.name,
      description: interv.description,
      categoryId: randomCategory.id,
    },
  });

  console.log(
    `→ Created/Upserted: ${interv.name} (Category: ${randomCategory.name})`
  );
}
}

checkRecordExists = await prisma.interventionBatch.count();
if (checkRecordExists === 0) {

  console.log("Seeding Intervention Batches...");

  // 1️⃣ Get all interventions
  const interventions = await prisma.intervention.findMany({
    select: { id: true, name: true },
  });

  if (!interventions.length) {
    throw new Error("No interventions found. Seed interventions first.");
  }

  // 2️⃣ Helper functions
  const random = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

  const locations = [
    "Abuja",
    "Rivers",
    "Imo",
  ];

  const batchData = [];

  // 3️⃣ Generate realistic batches
  for (let i = 1; i <= 40; i++) {
    const intervention = random(interventions);

    const capacity = Math.floor(Math.random() * 150) + 50; // 50–200 beneficiaries
    const budget = capacity * (Math.floor(Math.random() * 30000) + 20000); // ₦20k–₦50k per beneficiary

    const start = new Date();
    start.setDate(start.getDate() - Math.floor(Math.random() * 120));

    const end = new Date(start);
    end.setDate(start.getDate() + Math.floor(Math.random() * 30) + 7);

    batchData.push({
      name: `${intervention.name} Batch ${i}`,
      interventionId: intervention.id,
      capacity,
      totalBudget: budget,
      location: random(locations),
      startDate: start,
      endDate: end,
    });
  }

  // 4️⃣ Insert batches
  await prisma.interventionBatch.createMany({
    data: batchData,
  });

  console.log(`✅ ${batchData.length} intervention batches seeded`);
}
*/
checkRecordExists = await prisma.module.count();
if (checkRecordExists === 0) {
 console.log(`seeding module`);
  await prisma.module.createMany({
  data: [
  { name: "Beneficiary", code: "BENEFICIARY" },
  { name: "User Management", code: "USER" },
  { name: "Inventory", code: "INVENTORY" },
  { name: "Reports", code: "REPORTS" },
  { name: "Settings", code: "SETTINGS" }
],
});
  console.log(`seeded modules`);

}
/*
checkRecordExists = await prisma.performanceCycle.count();
if (checkRecordExists === 0) {
  console.log(`seeding performanceCycle`);
  await prisma.performanceCycle.createMany({
  data: [
    {
      name: "2025 Annual Performance Review",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-12-31"),
      status: CycleStatus.ACTIVE,
    },
    {
      name: "2025 Mid-Year Review",
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-30"),
      status: CycleStatus.DRAFT,
    },
    {
      name: "Q1 2025 Review",
      startDate: new Date("2025-01-01"),
      endDate: new Date("2025-03-31"),
      status: CycleStatus.CLOSED,
    },
    {
      name: "Q2 2025 Review",
      startDate: new Date("2025-04-01"),
      endDate: new Date("2025-06-30"),
      status: CycleStatus.ACTIVE,
    },
    {
      name: "Probation Review 2025",
      startDate: new Date("2025-02-01"),
      endDate: new Date("2025-12-31"),
      status: CycleStatus.ACTIVE,
    }
  ],
});
  console.log(`seeded performanceCycle`);
}

checkRecordExists = await prisma.performanceAppraisal.count();
if (checkRecordExists === 0) {
console.log(`seeding performanceAppraisal`);

  console.log("Seeding Performance Module...");

  // 1️⃣ Get active employees
  const employees = await prisma.employee.findMany({
    where: {
      status: "ACTIVE",
      deletedAt: null,
    },
  });

  if (employees.length === 0) {
    console.log("No employees found.");
    return;
  }

  // shuffle employees
  const selectedEmployees = employees
    .sort(() => 0.5 - Math.random())
    .slice(0, 50);

  // 2️⃣ Get active cycle
  const cycle = await prisma.performanceCycle.findFirst({
    where: {
      status: "ACTIVE",
    },
  });

  if (!cycle) {
    console.log("No active performance cycle found");
    return;
  }

  const goalTemplates = [
    {
      title: "Customer Satisfaction Improvement",
      description: "Improve client satisfaction metrics through better service delivery",
      target: 90,
    },
    {
      title: "Project Delivery Efficiency",
      description: "Complete projects within defined timelines",
      target: 100,
    },
    {
      title: "Team Collaboration",
      description: "Participate in cross-functional collaboration initiatives",
      target: 100,
    },
    {
      title: "Training & Certification",
      description: "Complete professional certifications or internal training",
      target: 3,
    },
    {
      title: "Operational Process Improvement",
      description: "Identify and implement process improvement initiatives",
      target: 5,
    },
    {
      title: "Revenue Contribution",
      description: "Support revenue generation initiatives",
      target: 100000,
    },
  ];

  const feedbackComments = [
    "Consistently delivers high quality work.",
    "Excellent collaboration with team members.",
    "Demonstrates strong leadership potential.",
    "Needs improvement in time management.",
    "Highly dependable and proactive.",
    "Shows strong commitment to company goals.",
  ];

  const strengths = [
    "Strong technical expertise",
    "Excellent leadership ability",
    "Outstanding teamwork",
    "Great communication skills",
    "Strong problem solving ability",
  ];

  const weaknesses = [
    "Time management",
    "Public speaking",
    "Delegation",
    "Documentation discipline",
    "Strategic planning",
  ];

  for (const employee of selectedEmployees) {
const manager = randomItem(
  selectedEmployees.filter(e => e.id !== employee.id)
);
    // 3️⃣ Create appraisal
    const appraisal = await prisma.performanceAppraisal.create({
  data: {
    employeeId: employee.id,
    managerId: manager.id,
    cycleId: cycle.id,
    selfComment: "Met most goals and improved team collaboration.",
    managerComment: "Consistent performance and strong initiative.",
    hrComment: "Aligned with company performance standards.",
    finalScore: rand(3.5, 4.8),
    status: "COMPLETED",
  },
});

    const numberOfGoals = Math.floor(rand(3, 6));
    const goals = [];

    // 4️⃣ Create goals
    for (let i = 0; i < numberOfGoals; i++) {

      const template = randomItem(goalTemplates);

      const target = template.target;

      const achieved = rand(target * 0.6, target * 1.1);

      const progress = (achieved / target) * 100;

      const goal = await prisma.performanceGoal.create({
        data: {
          employeeId: employee.id,
          cycleId: cycle.id,
          title: template.title,
          description: template.description,
          weight: rand(10, 40),
          targetValue: target,
          achievedValue: achieved,
          progress: progress,
        },
      });

      goals.push(goal);
    }

    // 5️⃣ Ratings for goals
    for (const goal of goals) {

      await prisma.performanceAppraisalRating.create({
        data: {
          appraisalId: appraisal.id,
          goalId: goal.id,
          score: rand(3, 5),
          comment: randomItem(feedbackComments),
        },
      });

    }

    // 6️⃣ Peer feedback
    const reviewer = randomItem(
      selectedEmployees.filter(e => e.id !== employee.id)
    );

    await prisma.performanceFeedback.create({
      data: {
        employeeId: employee.id,
        reviewerId: reviewer.id,
        cycleId: cycle.id,
        comment: randomItem(feedbackComments),
        rating: rand(3, 5),
      },
    });

    // 7️⃣ Development plan
    await prisma.performanceDevelopmentPlan.create({
      data: {
        employeeId: employee.id,
        appraisalId: appraisal.id,
        strengths: randomItem(strengths),
        weaknesses: randomItem(weaknesses),
        actionPlan:
          "Attend professional training, improve collaboration with team members, and participate in leadership development programs.",
      },
    });

  }

  console.log("Performance Module seeded successfully");
console.log(`seeded performanceAppraisal`);
}
*/










}

main()
.catch((e) => {
console.error(e);
process.exit(1);
})
.finally(async () => {
await prisma.$disconnect();
});







function randomFutureDate() {
const now = new Date();
const future = new Date();
future.setDate(now.getDate() + Math.floor(Math.random() * 90)); // within next 90 days
return future;
}

function differenceInMonths(date1: Date, date2: Date): number {
return (date1.getFullYear() - date2.getFullYear()) * 12 + (date1.getMonth() - date2.getMonth());
}

const firstNames = [
'Amina', 'Grace', 'Chinedu', 'Ibrahim', 'Fatima',
'Ngozi', 'Yusuf', 'Samuel', 'Blessing', 'Daniel',
'Maryam', 'Emeka', 'Hassan', 'Zainab', 'David',
'Esther', 'Abdul', 'Joy', 'Peter', 'Halima',
'Michael', 'Ruth', 'Ahmed', 'Precious', 'John'
];

const lastNames = [
'Yusuf', 'Okafor', 'Ibrahim', 'Adeyemi', 'Balogun',
'Mohammed', 'Eze', 'Ojo', 'Aliyu', 'Okeke'
];

function randomItem<T>(array: T[]): T { return array[Math.floor(Math.random() * array.length)]; }

function randomPhone(index: number) {
return `0803${String(1000000 + index).slice(-7)}`;
}

function randomDate() {
const start = new Date(1965, 0, 1);
const end = new Date(2005, 0, 1);
return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function randomPastDate(daysBack = 120) {
const date = new Date();
date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
return date;
}

function randomFloat(min: number, max: number) {
return parseFloat((Math.random() * (max - min) + min).toFixed(2));
}

function rand(min: number, max: number) { return Math.random() * (max - min) + min; }
function randomMinutes(min:number,max:number){ return Math.floor(Math.random()*(max-min+1))+min }

function addMinutes(date:Date,min:number){
 return new Date(date.getTime()+min*60000)
}

function isWeekend(date:Date){
 const d=date.getDay()
 return d===0||d===6
}

function getWorkingDays(start: Date, end: Date) {
  let count = 0
  const current = new Date(start)

  while (current <= end) {
    const day = current.getDay()

    if (day !== 0 && day !== 6) {
      count++
    }

    current.setDate(current.getDate() + 1)
  }

  return count
}


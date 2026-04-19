/**
 * MoveMaster Pro — JSON Database Seed
 * Run: npm run db:seed
 * Creates ./data/*.json files with 3 years of realistic history.
 * NO native dependencies — pure JavaScript/TypeScript.
 */

import dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';

const DATA = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(DATA)) fs.mkdirSync(DATA, { recursive: true });

const write = (file: string, data: unknown[]) =>
  fs.writeFileSync(path.join(DATA, `${file}.json`), JSON.stringify(data, null, 2));

function daysAgo(n: number) { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString(); }
function pastDate(n: number) { const d = new Date(); d.setDate(d.getDate()-n); return d.toISOString().split('T')[0]; }
function futureDate(n: number) { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().split('T')[0]; }
function uid() { return Math.random().toString(36).substring(2,11).toUpperCase(); }
function inv(n: number) { return `INV-2024-${String(n).padStart(4,'0')}`; }

async function seed() {
  console.log('\n🌱 Seeding MoveMaster Pro JSON database...\n');

  // ── Users ──────────────────────────────────────────────────────────────────
  const now = new Date().toISOString();
  const adminHash = await bcrypt.hash('admin1234', 12);
  const demoHash  = await bcrypt.hash('demo1234', 12);

  const users = [
    { id:'admin-001', uid:'admin-001', displayName:'Admin User', email:'admin@movemaster.pro', passwordHash:adminHash, role:'admin', createdAt:now, updatedAt:now },
    { id:'demo-user-001', uid:'demo-user-001', displayName:'Demo User', email:'demo@movemaster.pro', passwordHash:demoHash, role:'customer', phone:'416-555-0100', preferredCity:'Toronto', createdAt:now, updatedAt:now },
  ];
  write('users', users);
  console.log('  ✓ Users seeded (admin@movemaster.pro / admin1234 | demo@movemaster.pro / demo1234)');

  // ── Clients ────────────────────────────────────────────────────────────────
  const clients = [
    { id:'cli-001', fullName:'Jennifer Walsh',    email:'jennifer.walsh@gmail.com',  phone:'416-555-0201', address:'12 Rosedale Valley Rd', city:'Toronto',    postalCode:'M4W 1A5', totalMoves:3, totalSpent:6330, firstMoveDate:pastDate(420), lastMoveDate:pastDate(10),  referralSource:'Google Search',   createdAt:daysAgo(420), updatedAt:now },
    { id:'cli-002', fullName:'David Kim',         email:'david.kim@outlook.com',     phone:'905-555-0342', address:'1 Adelaide St E',       city:'Toronto',    postalCode:'M5C 2Z1', totalMoves:2, totalSpent:4385, firstMoveDate:pastDate(380), lastMoveDate:pastDate(38),  referralSource:'Referral',        createdAt:daysAgo(380), updatedAt:now },
    { id:'cli-003', fullName:'Sarah Ogundimu',    email:'sarah.o@gmail.com',         phone:'416-555-0198', address:'55 Charles St W',       city:'Toronto',    postalCode:'M4Y 1R9', totalMoves:2, totalSpent:2887, firstMoveDate:pastDate(310), lastMoveDate:pastDate(1),   referralSource:'Google Search',   createdAt:daysAgo(310), updatedAt:now },
    { id:'cli-004', fullName:'Michael Bertrand',  email:'m.bertrand@rogers.com',     phone:'905-555-0477', address:'34 Maple Ave',          city:'Hamilton',   postalCode:'L8P 2L6', totalMoves:1, totalSpent:1124, firstMoveDate:pastDate(250), lastMoveDate:pastDate(22),  referralSource:'Friend or Family',createdAt:daysAgo(250), updatedAt:now },
    { id:'cli-005', fullName:'Aisha Rahman',      email:'aisha.rahman@hotmail.com',  phone:'519-555-0211', address:'50 University Ave',     city:'Waterloo',   postalCode:'N2L 3G1', totalMoves:1, totalSpent:627,  firstMoveDate:pastDate(200), lastMoveDate:pastDate(18),  referralSource:'Google Search',   createdAt:daysAgo(200), updatedAt:now },
    { id:'cli-006', fullName:'Carlos Evangelista',email:'carlos.e@gmail.com',        phone:'647-555-0389', address:'99 Queen St W',         city:'Brampton',   postalCode:'L6X 1A1', totalMoves:2, totalSpent:2530, firstMoveDate:pastDate(180), lastMoveDate:pastDate(4),   referralSource:'Kijiji',          createdAt:daysAgo(180), updatedAt:now },
    { id:'cli-007', fullName:'Patricia Kowalczyk',email:'pat.kowalczyk@bell.net',    phone:'416-555-0522', address:'88 Forest Hill Rd',     city:'Toronto',    postalCode:'M4V 2M3', totalMoves:1, totalSpent:3249, firstMoveDate:pastDate(12),  lastMoveDate:pastDate(1),   referralSource:'Google Search',   createdAt:daysAgo(12),  updatedAt:now },
    { id:'cli-008', fullName:'Tanya Fournier',    email:'tanya.fournier@gmail.com',  phone:'705-555-0167', address:'45 Bloor St W',         city:'Toronto',    postalCode:'M4W 1A6', totalMoves:1, totalSpent:630,  firstMoveDate:pastDate(14),  lastMoveDate:pastDate(14),  referralSource:'Facebook',        createdAt:daysAgo(14),  updatedAt:now },
    { id:'cli-009', fullName:'George Nikolaou',   email:'g.nikolaou@gmail.com',      phone:'416-555-0633', address:'300 Front St W',        city:'Toronto',    postalCode:'M5V 0E9', totalMoves:1, totalSpent:65,   firstMoveDate:pastDate(8),   lastMoveDate:pastDate(8),   referralSource:'Google Search',   createdAt:daysAgo(8),   updatedAt:now },
    { id:'cli-010', fullName:'Linda Morrison',    email:'linda.morrison@rogers.com', phone:'905-555-0744', address:'56 Brant St',           city:'Burlington', postalCode:'L7R 2G7', totalMoves:1, totalSpent:363,  firstMoveDate:pastDate(5),   lastMoveDate:pastDate(5),   referralSource:'Referral',        createdAt:daysAgo(5),   updatedAt:now },
    { id:'cli-011', fullName:'Robert Tremblay',   email:'r.tremblay@gmail.com',      phone:'416-555-0811', address:'400 University Ave',    city:'Toronto',    postalCode:'M5G 1S7', totalMoves:1, totalSpent:2068, firstMoveDate:pastDate(290), lastMoveDate:pastDate(290), referralSource:'Google Search',   createdAt:daysAgo(290), updatedAt:now },
    { id:'cli-012', fullName:'Nadine Pelletier',  email:'nadine.p@hotmail.com',      phone:'519-555-0922', address:'88 College St',         city:'Kitchener',  postalCode:'N2H 5G1', totalMoves:1, totalSpent:472,  firstMoveDate:pastDate(210), lastMoveDate:pastDate(210), referralSource:'Friend or Family',createdAt:daysAgo(210), updatedAt:now },
    { id:'cli-013', fullName:'Andrew Shapiro',    email:'andrew.s@rogers.com',       phone:'647-555-1033', address:'1200 Markham Rd',       city:'Mississauga',postalCode:'L5C 4H1', totalMoves:1, totalSpent:1345, firstMoveDate:pastDate(160), lastMoveDate:pastDate(160), referralSource:'Google Search',   createdAt:daysAgo(160), updatedAt:now },
    { id:'cli-014', fullName:'Helen Castillo',    email:'helen.castillo@gmail.com',  phone:'905-555-1144', address:'22 Maple Grove Dr',     city:'Oakville',   postalCode:'L6J 4Z8', totalMoves:1, totalSpent:1590, firstMoveDate:pastDate(140), lastMoveDate:pastDate(140), referralSource:'Referral',        createdAt:daysAgo(140), updatedAt:now },
    { id:'cli-015', fullName:'Wanjiru Kamau',     email:'wanjiru.k@gmail.com',       phone:'647-555-1255', address:'780 Brant St N',        city:'Brampton',   postalCode:'L6T 1B1', totalMoves:1, totalSpent:1893, firstMoveDate:pastDate(100), lastMoveDate:pastDate(100), referralSource:'Google Search',   createdAt:daysAgo(100), updatedAt:now },
    { id:'cli-016', fullName:'Tony Marchetti',    email:'tony.m@bell.net',           phone:'905-555-1366', address:'45 Claremont Dr',       city:'Hamilton',   postalCode:'L8P 3K8', totalMoves:1, totalSpent:2100, firstMoveDate:pastDate(75),  lastMoveDate:pastDate(75),  referralSource:'Friend or Family',createdAt:daysAgo(75),  updatedAt:now },
    { id:'cli-017', fullName:'Michelle Tran',     email:'michelle.tran@gmail.com',   phone:'416-555-1477', address:'200 Wellington St W',   city:'Toronto',    postalCode:'M5V 3G2', totalMoves:1, totalSpent:845,  firstMoveDate:pastDate(55),  lastMoveDate:pastDate(55),  referralSource:'Instagram',       createdAt:daysAgo(55),  updatedAt:now },
    { id:'cli-018', fullName:'Brian Lemay',       email:'brian.lemay@rogers.com',    phone:'519-555-1588', address:'15 Wellington St',      city:'Guelph',     postalCode:'N1H 2L2', totalMoves:3, totalSpent:7223, firstMoveDate:pastDate(700), lastMoveDate:pastDate(30),  referralSource:'Repeat Customer', createdAt:daysAgo(700), updatedAt:now },
    { id:'cli-019', fullName:'Chioma Eze',        email:'chioma.eze@gmail.com',      phone:'416-555-1699', address:'340 Bloor St W',        city:'Toronto',    postalCode:'M5S 1W9', totalMoves:1, totalSpent:1100, firstMoveDate:pastDate(45),  lastMoveDate:pastDate(45),  referralSource:'Google Search',   createdAt:daysAgo(45),  updatedAt:now },
    { id:'cli-020', fullName:'Francois Leblanc',  email:'f.leblanc@hotmail.com',     phone:'905-555-1800', address:'88 Rymal Rd E',         city:'Hamilton',   postalCode:'L9B 1B9', totalMoves:1, totalSpent:2249, firstMoveDate:pastDate(320), lastMoveDate:pastDate(320), referralSource:'Google Search',   createdAt:daysAgo(320), updatedAt:now },
  ];
  write('clients', clients);
  console.log(`  ✓ ${clients.length} clients created`);

  // ── Jobs ───────────────────────────────────────────────────────────────────
  const mkJob = (id: string, cid: string, n: string, em: string, ph: string,
    md: string, sz: string, sv: string, fA: string, fC: string, tA: string, tC: string,
    pack: boolean, stor: boolean, spec: boolean, specD: string, flO: number, flD: number, elev: boolean,
    hrs: number, rate: number, est: number, final: number, status: string,
    dep: boolean, depAmt: number, depAt: string, invN: string, hear: string, notes: string, crew: string,
    created: string, updated: string, completed: string
  ) => ({
    id, clientId:cid||undefined, name:n, email:em, phone:ph, moveDate:md, moveSize:sz, serviceType:sv,
    originAddress:fA, originCity:fC, destinationAddress:tA, destinationCity:tC,
    needsPacking:pack, needsStorage:stor, hasSpecialtyItems:spec, specialtyDetails:specD||undefined,
    floorOrigin:flO, floorDestination:flD, hasElevator:elev,
    estimatedHours:hrs, hourlyRate:rate, estimatedPrice:est, finalPrice:final||undefined,
    status, depositPaid:dep, depositAmount:depAmt, depositPaidAt:depAt||undefined,
    invoiceNumber:invN, hearAboutUs:hear, notes:notes||undefined, assignedCrew:crew||undefined,
    createdAt:created, updatedAt:updated, completedAt:completed||undefined,
  });

  const jobs = [
    mkJob('job-001','cli-001','Jennifer Walsh',    'jennifer.walsh@gmail.com',  '416-555-0201',pastDate(420),'2-bedroom',  'residential',  '180 Simcoe St',        'Toronto',    '220 Bay St Unit 801',  'Toronto',    true, false,false,'',1, 8, true, 7,  199,1393,1393,'completed',true,279,daysAgo(425),inv(1), 'Google Search','3BR, elevator both sides',                'Mike Kowalski, Darnell Thompson',       daysAgo(428),daysAgo(420),daysAgo(420)),
    mkJob('job-002','cli-018','Brian Lemay',        'brian.lemay@rogers.com',    '519-555-1588',pastDate(700),'4-bedroom',  'residential',  '15 Wellington St',     'Guelph',     '80 Stone Rd W',        'Guelph',     false,false,false,'',1, 1, false,9,  249,2241,2241,'completed',true,448,daysAgo(705),inv(2), 'Referral',      'Large 4BR, 5-person crew, 10hrs',         'Tyler Bouchard, Marcus Osei',           daysAgo(708),daysAgo(700),daysAgo(700)),
    mkJob('job-003','cli-020','Francois Leblanc',   'f.leblanc@hotmail.com',     '905-555-1800',pastDate(320),'4-bedroom',  'residential',  '88 Rymal Rd E',        'Hamilton',   '50 Stone Church Rd',   'Hamilton',   true, false,false,'',1, 1, false,9,  249,2249,2249,'completed',true,450,daysAgo(325),inv(3), 'Google Search', '5-person crew, tight driveway',           'Mike Kowalski, Carlos Reyes',           daysAgo(328),daysAgo(320),daysAgo(320)),
    mkJob('job-004','cli-011','Robert Tremblay',    'r.tremblay@gmail.com',      '416-555-0811',pastDate(290),'3-bedroom',  'long-distance','400 University Ave',   'Toronto',    '15 Wyndham St N',      'Guelph',     true, false,true, 'Antique armoire, marble dining table',1,1,false,7,199,2068,2068,'completed',true,414,daysAgo(295),inv(4),'Google Search','Antiques wrapped in custom padding',     'Sophie Tremblay, Carlos Reyes',         daysAgo(298),daysAgo(290),daysAgo(290)),
    mkJob('job-005','cli-002','David Kim',          'david.kim@outlook.com',     '905-555-0342',pastDate(380),'office-large','commercial',  '1 Adelaide St E',      'Toronto',    '4120 Yonge St',        'Toronto',    true, false,false,'',12,5, true, 10, 229,2990,2990,'completed',true,598,daysAgo(385),inv(5), 'Referral',      '35-person office, IT gear wrapped',       'Linda Chen, Priya Mehta',               daysAgo(388),daysAgo(380),daysAgo(380)),
    mkJob('job-006','cli-012','Nadine Pelletier',   'nadine.p@hotmail.com',      '519-555-0922',pastDate(210),'1-bedroom',  'residential',  '88 College St',        'Kitchener',  '22 Park St',           'Cambridge',  false,false,false,'',2, 1, false,3.5,149,472, 472, 'completed',true,94, daysAgo(215),inv(6), 'Friend or Family','Small move, completed 45min early',     'Fatima Al-Rashid',                      daysAgo(218),daysAgo(210),daysAgo(210)),
    mkJob('job-007','cli-013','Andrew Shapiro',     'andrew.s@rogers.com',       '647-555-1033',pastDate(160),'2-bedroom',  'long-distance','1200 Markham Rd',      'Mississauga','500 Ridout St N',       'London',     false,false,false,'',1, 1, false,5,  169,1345,1345,'completed',true,269,daysAgo(165),inv(7), 'Google Search', 'London run, smooth highway haul',         'Tyler Bouchard',                        daysAgo(168),daysAgo(160),daysAgo(160)),
    mkJob('job-008','cli-014','Helen Castillo',     'helen.castillo@gmail.com',  '905-555-1144',pastDate(140),'2-bedroom',  'senior',       '22 Maple Grove Dr',    'Oakville',   '300 South Park Rd',    'Mississauga',true, false,false,'',1, 3, true, 5,  159,1590,1590,'completed',true,318,daysAgo(145),inv(8), 'Referral',      '74yr old client, Amara exceptional',      'Amara Diallo, Darnell Thompson',        daysAgo(148),daysAgo(140),daysAgo(140)),
    mkJob('job-009','cli-003','Sarah Ogundimu',     'sarah.o@gmail.com',         '416-555-0198',pastDate(310),'3-bedroom',  'long-distance','55 Charles St W',      'Toronto',    '100 Main St W',        'Hamilton',   true, false,false,'',1, 1, false,7,  199,1893,1893,'completed',true,379,daysAgo(315),inv(9), 'Google Search', 'Toronto to Hamilton, no road issues',     'Tyler Bouchard, Marcus Osei',           daysAgo(318),daysAgo(310),daysAgo(310)),
    mkJob('job-010','cli-004','Michael Bertrand',   'm.bertrand@rogers.com',     '905-555-0477',pastDate(250),'2-bedroom',  'senior',       '34 Maple Ave',         'Hamilton',   '200 Brant St',         'Burlington', true, true, false,'',1, 3, true, 5,  159,1124,1124,'completed',true,225,daysAgo(255),inv(10),'Friend or Family','Moving elderly mother, extra care',     'Darnell Thompson, Amara Diallo',        daysAgo(258),daysAgo(250),daysAgo(250)),
    mkJob('job-011','cli-005','Aisha Rahman',       'aisha.rahman@hotmail.com',  '519-555-0211',pastDate(200),'1-bedroom',  'packing',      '50 University Ave',    'Waterloo',   '75 King St N',         'Kitchener',  true, false,false,'',2, 1, false,3.5,149,627, 627, 'completed',true,125,daysAgo(205),inv(11),'Google Search', 'Full pack, zero breakage reported',       'Fatima Al-Rashid',                      daysAgo(208),daysAgo(200),daysAgo(200)),
    mkJob('job-012','cli-015','Wanjiru Kamau',      'wanjiru.k@gmail.com',       '647-555-1255',pastDate(100),'3-bedroom',  'long-distance','780 Brant St N',       'Brampton',   '500 Ridout St N',      'London',     false,false,false,'',1, 1, false,7,  199,1893,1893,'completed',true,379,daysAgo(105),inv(12),'Google Search', 'Brampton to London relocation',           'Tyler Bouchard, Marcus Osei',           daysAgo(108),daysAgo(100),daysAgo(100)),
    mkJob('job-013','cli-016','Tony Marchetti',     'tony.m@bell.net',           '905-555-1366',pastDate(75), '4-bedroom',  'specialty',    '45 Claremont Dr',      'Hamilton',   '90 Speers Rd',         'Oakville',   true, false,true, 'Full-size slate pool table, arcade machine',1,1,false,9,249,2100,2100,'completed',true,420,daysAgo(80), inv(13),'Friend or Family','Pool table disassembly — perfect',     'Carlos Reyes, Mike Kowalski',           daysAgo(83), daysAgo(75), daysAgo(75)),
    mkJob('job-014','cli-017','Michelle Tran',      'michelle.tran@gmail.com',   '416-555-1477',pastDate(55), '2-bedroom',  'residential',  '200 Wellington St W',  'Toronto',    '88 Lakeshore Dr',      'Mississauga',false,false,false,'',8, 2, true, 5,  169,845, 845, 'completed',true,169,daysAgo(60), inv(14),'Instagram',     'Condo to condo, elevator both sides',     'Marcus Osei, Fatima Al-Rashid',         daysAgo(63), daysAgo(55), daysAgo(55)),
    mkJob('job-015','cli-018','Brian Lemay',        'brian.lemay@rogers.com',    '519-555-1588',pastDate(400),'4-bedroom',  'long-distance','80 Stone Rd W',        'Guelph',     '100 York Blvd',        'Hamilton',   false,false,false,'',1, 1, false,9,  249,2741,2741,'completed',true,548,daysAgo(405),inv(15),'Repeat Customer','2nd move with Brian — VIP treatment',   'Tyler Bouchard, Mike Kowalski',         daysAgo(408),daysAgo(400),daysAgo(400)),
    mkJob('job-016','cli-019','Chioma Eze',         'chioma.eze@gmail.com',      '416-555-1699',pastDate(45), '2-bedroom',  'storage',      '340 Bloor St W',       'Toronto',    '340 Bloor St W',       'Toronto',    false,true, false,'',5, 5, true, 3,  169,1100,1100,'completed',true,220,daysAgo(50), inv(16),'Google Search', '4-week storage bridge, clean pickup',     'Marcus Osei',                           daysAgo(53), daysAgo(45), daysAgo(45)),
    mkJob('job-017','cli-001','Jennifer Walsh',     'jennifer.walsh@gmail.com',  '416-555-0201',pastDate(200),'3-bedroom',  'residential',  '220 Bay St',           'Toronto',    '12 Rosedale Valley Rd','Toronto',    false,false,false,'',8, 1, true, 7,  199,1393,1393,'completed',true,279,daysAgo(205),inv(17),'Repeat Customer','2nd Jennifer move — booked same day',   'Mike Kowalski, Darnell Thompson',       daysAgo(208),daysAgo(200),daysAgo(200)),
    mkJob('job-018','cli-006','Carlos Evangelista', 'carlos.e@gmail.com',        '647-555-0389',pastDate(180),'2-bedroom',  'last-minute',  '99 Queen St W',        'Brampton',   '410 Hurontario St',    'Mississauga',false,false,false,'',3, 1, false,5,  199,1056,1056,'completed',true,211,daysAgo(182),inv(18),'Kijiji',        'SOS move, 24hr notice — perfect exec',    'Marcus Osei',                           daysAgo(182),daysAgo(180),daysAgo(180)),
    mkJob('job-019','cli-002','David Kim',          'david.kim@outlook.com',     '905-555-0342',pastDate(38), 'office-small','commercial',  '400 King St W',        'Toronto',    '100 Queens Quay W',    'Toronto',    true, false,false,'',6, 4, true, 6,  189,1395,1395,'completed',true,279,daysAgo(43), inv(19),'Repeat Customer','2nd office move, flawless execution',    'Linda Chen, Jessica Park',              daysAgo(46), daysAgo(38), daysAgo(38)),
    mkJob('job-020','cli-018','Brian Lemay',        'brian.lemay@rogers.com',    '519-555-1588',pastDate(30), '4-bedroom',  'residential',  '100 York Blvd',        'Hamilton',   '500 Ridout St N',      'London',     true, false,false,'',1, 1, false,9,  249,2241,2241,'completed',true,448,daysAgo(35), inv(20),'Repeat Customer','3rd Brian move — loyal 2yr client',     'Tyler Bouchard, Mike Kowalski',         daysAgo(38), daysAgo(30), daysAgo(30)),
    // IN PROGRESS
    mkJob('job-021','cli-007','Patricia Kowalczyk', 'pat.kowalczyk@bell.net',    '416-555-0522',pastDate(1),  '4-bedroom',  'specialty',    '88 Forest Hill Rd',    'Toronto',    '22 Lakeshore Rd E',    'Oakville',   true, false,true, '1928 Chickering baby grand piano, antique collection',1,1,false,9,249,3249,0,'in-progress',true,650,daysAgo(12),inv(21),'Google Search','Piano certified crew assigned today', 'Carlos Reyes, Sophie Tremblay',         daysAgo(12), daysAgo(1),  ''),
    // CONFIRMED
    mkJob('job-022','cli-008','Tanya Fournier',     'tanya.fournier@gmail.com',  '705-555-0167',futureDate(3),'4-bedroom',  'long-distance','45 Bloor St W',        'Toronto',    '100 Dunlop St E',      'Barrie',     true, false,false,'',1, 1, false,9,  249,3149,0,'confirmed',  true,630,daysAgo(10), inv(22),'Facebook',      'Long driveway at destination',            'Tyler Bouchard, Mike Kowalski',         daysAgo(14), daysAgo(10), ''),
    mkJob('job-023','cli-009','George Nikolaou',    'g.nikolaou@gmail.com',      '416-555-0633',futureDate(5),'studio',     'residential',  '300 Front St W',       'Toronto',    '1 Yonge St',           'Toronto',    false,false,false,'',14,22,true, 2.5,129,323, 0,'confirmed',  true,65, daysAgo(6),  inv(23),'Google Search', 'Condo to condo, elevator confirmed',      'Marcus Osei',                           daysAgo(8),  daysAgo(6),  ''),
    mkJob('job-024','cli-010','Linda Morrison',     'linda.morrison@rogers.com', '905-555-0744',futureDate(8),'3-bedroom',  'residential',  '56 Brant St',          'Burlington', '90 Speers Rd',         'Oakville',   true, false,false,'',1, 1, false,7,  199,1813,0,'confirmed',  true,363,daysAgo(3),  inv(24),'Referral',      'Packing booked for day before move',      'Fatima Al-Rashid, Darnell Thompson',    daysAgo(5),  daysAgo(3),  ''),
    mkJob('job-025','cli-006','Carlos Evangelista', 'carlos.e@gmail.com',        '647-555-0389',futureDate(12),'office-small','commercial', '200 King St W',        'Kitchener',  '60 Columbia St W',     'Waterloo',   true, false,false,'',3, 2, true, 6,  189,1474,0,'confirmed',  true,295,daysAgo(2),  inv(25),'Repeat Customer','Weekend only — Sunday 5pm deadline',    'Linda Chen, Jessica Park',              daysAgo(4),  daysAgo(2),  ''),
    // PENDING
    mkJob('job-026','cli-003','Sarah Ogundimu',     'sarah.o@gmail.com',         '416-555-0198',futureDate(14),'2-bedroom', 'residential',  '77 Mutual St',         'Toronto',    '340 Plains Rd E',      'Burlington', false,true, false,'',6, 1, true, 5,  169,994, 0,'pending',    false,199,'',          inv(26),'Repeat Customer','Storage needed, dates flexible',          '',                                      daysAgo(1),  daysAgo(1),  ''),
    mkJob('job-027','',       'Robert Chen',        'r.chen@gmail.com',          '416-555-2811',futureDate(18),'3-bedroom', 'long-distance','400 University Ave',   'Toronto',    '15 Wyndham St N',      'Guelph',     true, false,true, 'Large antique armoire, marble dining table',1,1,false,7,199,2068,0,'pending',false,414,'',inv(27),'Google Search','Specialty crew needed for antiques','',daysAgo(0),daysAgo(0),''),
    mkJob('job-028','',       'Priya Singh',        'priya.s@hotmail.com',       '519-555-2922',futureDate(21),'1-bedroom', 'residential',  '88 College St',        'Kitchener',  '22 Park St',           'Cambridge',  false,false,false,'',2, 1, false,3.5,149,472, 0,'pending',    false,94, '',          inv(28),'Friend or Family','',                                    '',                                      daysAgo(0),  daysAgo(0),  ''),
    mkJob('job-029','cli-001','Jennifer Walsh',     'jennifer.walsh@gmail.com',  '416-555-0201',futureDate(25),'4-bedroom', 'residential',  '12 Rosedale Valley Rd','Toronto',    '450 Maple Grove Dr',   'Oakville',   true, false,true, 'Baby grand piano',1,1,false,9,249,3544,0,'pending',false,709,'',inv(29),'Repeat Customer','3rd Jennifer move — VIP client','',daysAgo(0),daysAgo(0),''),
  ];
  write('jobs', jobs);
  console.log(`  ✓ ${jobs.length} jobs created (20 completed, 1 in-progress, 4 confirmed, 4 pending)`);

  // ── Invoices ───────────────────────────────────────────────────────────────
  const invoices = jobs.map(j => {
    const isComp = j.status === 'completed';
    const bal    = isComp ? 0 : Math.max(0, (j.estimatedPrice||0) - (j.depositAmount||0));
    const status = isComp ? 'paid' : (j.depositPaid ? 'partial' : 'unpaid');
    const lineItems = [
      { description:`${j.serviceType} Move (${j.moveSize})`, hours:j.estimatedHours, rate:j.hourlyRate, amount:(j.estimatedHours||0)*(j.hourlyRate||0) },
      ...(j.needsPacking    ? [{ description:'Full packing service (+30%)',    amount:Math.round((j.estimatedHours||0)*(j.hourlyRate||0)*0.3) }] : []),
      ...(j.needsStorage    ? [{ description:'Storage — 30 day minimum',       amount:149 }] : []),
      ...(j.hasSpecialtyItems ? [{ description:'Specialty item handling',      amount:250 }] : []),
      ...(j.serviceType==='long-distance' ? [{ description:'Long-distance surcharge', amount:500 }] : []),
    ];
    return {
      id: `inv-${j.id}`,
      invoiceNumber: j.invoiceNumber,
      jobId: j.id,
      clientId: j.clientId,
      clientName: j.name, clientEmail: j.email, clientPhone: j.phone,
      serviceType: j.serviceType,
      moveDate: j.moveDate,
      route: `${j.originCity} → ${j.destinationCity}`,
      subtotal: j.estimatedPrice || 0,
      depositPaid: j.depositAmount || 0,
      balanceDue: bal,
      status,
      issuedAt: j.createdAt,
      dueAt: j.moveDate ? new Date(new Date(j.moveDate).getTime()+7*86400000).toISOString().split('T')[0] : undefined,
      paidAt: isComp ? j.completedAt : undefined,
      lineItems,
      notes: j.notes,
      createdAt: j.createdAt,
    };
  });
  write('invoices', invoices);
  console.log(`  ✓ ${invoices.length} invoices generated`);

  // ── Transactions ───────────────────────────────────────────────────────────
  const transactions: unknown[] = [];
  for (const j of jobs) {
    if (j.depositPaid && j.depositAmount && j.depositAmount > 0) {
      transactions.push({ id:uid(), jobId:j.id, invoiceId:`inv-${j.id}`, clientId:j.clientId||undefined, type:'deposit', amount:j.depositAmount, method:'card', description:`Deposit — ${j.invoiceNumber} (${j.originCity} → ${j.destinationCity})`, status:'completed', createdAt:j.depositPaidAt||j.createdAt });
    }
    if (j.status==='completed' && j.finalPrice && j.finalPrice>0) {
      const bal = j.finalPrice - (j.depositAmount||0);
      if (bal>0) transactions.push({ id:uid(), jobId:j.id, invoiceId:`inv-${j.id}`, clientId:j.clientId||undefined, type:'balance', amount:bal, method:'card', description:`Balance — ${j.invoiceNumber} (${j.originCity} → ${j.destinationCity})`, status:'completed', createdAt:j.completedAt });
    }
  }
  write('transactions', transactions);
  console.log(`  ✓ ${transactions.length} payment transactions recorded`);

  // ── Contact Messages ───────────────────────────────────────────────────────
  const messages = [
    { id:uid(), name:'Olivia Bergmann',  email:'olivia.b@gmail.com',    phone:'905-555-2100', serviceType:'residential', message:'Need to move a 2-bedroom in St. Catharines next month. Do you service that area?', read:true,  createdAt:daysAgo(8) },
    { id:uid(), name:'Henry Obasi',      email:'henry.o@rogers.com',    phone:'416-555-2211', serviceType:'last-minute', message:'Family emergency — need to move within 48 hours. Is that possible?', read:true, createdAt:daysAgo(5) },
    { id:uid(), name:'Christina Yip',    email:'christina.y@gmail.com', phone:'647-555-2322', serviceType:'residential', message:'Looking to move Toronto to Barrie in about 6 weeks. Can I get a quote?', read:false, createdAt:daysAgo(2) },
    { id:uid(), name:'Derek Johannsen',  email:'derek.j@hotmail.com',   phone:'519-555-2433', serviceType:'commercial',  message:'20-person company relocating offices in Waterloo. Weekend move required. Please call.', read:false, createdAt:daysAgo(1) },
    { id:uid(), name:'Leah Blackwood',   email:'leah.b@gmail.com',      phone:'416-555-2544', serviceType:'storage',     message:'Need storage for 6 weeks between closing dates. What unit sizes do you have?', read:false, createdAt:daysAgo(0) },
  ];
  write('messages', messages);
  console.log(`  ✓ ${messages.length} contact messages seeded\n`);

  // ── Summary ────────────────────────────────────────────────────────────────
  const completed = jobs.filter((j: { status: string }) => j.status === 'completed');
  const totalRev  = completed.reduce((s: number, j: { finalPrice?: number }) => s + (j.finalPrice || 0), 0);
  const totalDep  = jobs.filter((j: { depositPaid: boolean }) => j.depositPaid).reduce((s: number, j: { depositAmount?: number }) => s + (j.depositAmount || 0), 0);

  console.log('━'.repeat(52));
  console.log('✅  Database seeded successfully!\n');
  console.log(`   Database    : ./data/ (JSON files)`);
  console.log(`   Clients     : ${clients.length}`);
  console.log(`   Jobs        : ${jobs.length} total`);
  console.log(`     Completed : ${completed.length}`);
  console.log(`     In Progress: ${jobs.filter((j: { status: string }) => j.status==='in-progress').length}`);
  console.log(`     Confirmed : ${jobs.filter((j: { status: string }) => j.status==='confirmed').length}`);
  console.log(`     Pending   : ${jobs.filter((j: { status: string }) => j.status==='pending').length}`);
  console.log(`   Revenue     : $${totalRev.toLocaleString()} CAD`);
  console.log(`   Deposits    : $${totalDep.toLocaleString()} CAD`);
  console.log(`   Invoices    : ${invoices.length}`);
  console.log(`   Transactions: ${transactions.length}`);
  console.log('━'.repeat(52));
  console.log('\n   admin@movemaster.pro  →  admin1234');
  console.log('   demo@movemaster.pro   →  demo1234\n');

  process.exit(0);
}

seed().catch((e) => { console.error('Seed failed:', e); process.exit(1); });

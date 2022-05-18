DROP TYPE IF EXISTS categ_jocuri;
DROP TYPE IF EXISTS tipuri_jocuri;
DROP TYPE IF EXISTS caracteristici_jocuri;
DROP TYPE IF EXISTS producatori;

CREATE TYPE categ_jocuri AS ENUM( 'noi', 'populare', 'ieftine', 'premiate');
CREATE TYPE tipuri_jocuri AS ENUM('RPG', 'shooter', 'RTS', 'sport', 'race', 'casual');
CREATE TYPE caracteristici_jocuri AS ENUM('single', 'multi', 'dlc', 'story');
CREATE TYPE producatori AS ENUM('EA Sports', 'Valve', 'Fireaxis', 'Rockstar Games', 'Ubisoft', 'SCE Santa Monica', 'Hazelight');


CREATE TABLE IF NOT EXISTS jocuri (
   id serial PRIMARY KEY,
   nume VARCHAR(50) UNIQUE NOT NULL,
   descriere TEXT,
   pret NUMERIC(8,2) NOT NULL,
   scor INT NOT NULL CHECK (scor>=0),   
   tip_joc tipuri_jocuri DEFAULT 'RPG',
   producator VARCHAR(50) NOT NULL,
   categorie categ_jocuri DEFAULT 'populare',
   caracteristici VARCHAR [], --multiplayer,singleplayer, controller, inapp, achievments etc.
   pt_copii BOOLEAN NOT NULL DEFAULT TRUE,
   imagine VARCHAR(300),
   data_lansare TIMESTAMP DEFAULT current_timestamp
);

INSERT into jocuri (nume,descriere,pret, scor,tip_joc, producator, categorie, caracteristici,pt_copii, imagine) VALUES 
('Fifa', 'Joc despre fotbal!', 60 , 73, 'sport', 'EA Sports', 'populare', '{"single", "multi"}', True, 'fifa.jpg'),

('Counter Strike Global Offensive', 'Joc shooter!', 0 , 83, 'shooter','Valve' ,'ieftine', '{"multi"}', False, 'cs.jpg'),

('Civilization VI', 'Joc de strategie!', 60 , 88,'RTS', 'Fireaxis','populare', '{"single","multi","dlc"}', True,'civ.jpg'),

('GTA V', 'Nu ii trebuie descriere :)!', 15, 96, 'shooter', 'Rockstar Games','populare', '{"single", "multi", "story"}', False, 'gta.jpg'),

('Rainbow Six Siege', 'Joc shooter mai tactic decat CS!', 20, 79,'shooter', 'Ubisoft','populare', '{"multi"}', False, 'rss.jpg'),

('Assassin''s Creed Odyssey', 'Joc RPG in Grecia Antica!', 60, 86, 'RPG', 'Ubisoft','populare','{"story", "single"}', False, 'ac.jpg'),

('God of War', 'Joc RPG premiat!', 50, 94, 'RPG',  'SCE Santa Monica','premiate', '{"single", "story"}', False, 'gow.jpg'),

('It takes two', 'Joc co-op pentru intreaga familie', 40, 88, 'casual',  'Hazelight','premiate', '{"multi", "puzzle"}', True, 'itt.jpg');




-- ('Dulcelind cu fructe', 'Rețetă proprie, cu conținut sănătos (dacă ignorați tonele de zahăr) de fruncte proaspete', 10 , 250, 620, 'cofetarie', 'aniversara', '{"frisca","zahar","faina","zmeura","lapte","mure","capsuni"}', False,'dulcelind.jpg'),

-- ('Tartă cu căpșuni', 'Sub căpșuni se află o tartă.', 6 , 245, 280, 'cofetarie', 'comuna', '{"vanilie","faina","capsuni","lapte", "indulcitor"}', True,'tarta-capsuni.jpg'),

-- ('Nimic', 'Nimic', 10 , 0, 0, 'cofetarie', 'dietetica', '{}', False, 'nimic.jpg'),

-- ('Cozonac zburător', 'Cineva a vărsat heliu peste aluat.', 25.5 , 1000, 1800, 'patiserie', 'comuna', '{"zahar","unt","faina","lapte","cacao","alune", "nuca"}', False, 'cozonac-zburator.jpg'),

-- ('Brioșe', 'Aluat pufos, cu bucățele de ciocolată. Bucățelele de ciocolata, însă, nu sunt tocmai pufoase.', 8 , 145, 320, 'patiserie', 'comuna', '{"ciocolata","lapte","unt","migdale","faina","zahar"}', False, 'briose.jpg'),

-- ('Turtă dulce', 'Un produs bun de savurat de Craciun. Sau și mai târziu dacă stocul a depășit cererea. De obicei mai găsiți și prin iunie...', 12 , 400, 550, 'patiserie', 'aniversara', '{"faina","lapte","scortisoara","zahar","unt"}', False, 'turta-dulce.jpg'),

-- ('Turtă dulce dietetică', 'Îndulcitor în loc de zahăr. Dar nu vă lăsați păcăliți de nume, în rest nimic nu-i dietetic.', 10 , 400, 520, 'patiserie', 'aniversara', '{"faina","lapte","zaharina","unt","scortisoara"}', True, 'turta-dulce-dietetica.jpg'),

-- ('Căsuță din turtă dulce', 'Vine cu tot cu vrăjitoare și cuptor la pachet. A nu se lăsa în mijlocul pădurii.', 70 , 450, 2700, 'patiserie', 'aniversara', '{"unt","scortisoara", "oua","faina","lapte","zahar"}', False, 'casuta-turta-dulce.jpg'),

-- ('Croissant', 'Un răsfăț pufos și dulce... mda... dulce... dacă nu încurcă Dorelina, iar, sarea cu zahărul!!!', 5 , 150, 285, 'patiserie', 'comuna', '{"faina","lapte","zahar/sare","unt","ciocolata","migdale"}', False, 'croissant.jpg'),

-- ('Prajitura căpșuni', 'Prăjitura se face doar cu comandă specială, fiindcă apoi o comandăm și noi la rândul nostru la cofetăria vecină.', 15 , 180, 385, 'cofetarie', 'comanda speciala', '{"faina","lapte","zahar", "capsuni","unt","gelatina"}', False, 'prajitura-capsuni.jpg'),

-- ('Nasturei cu dulceață', 'Pentru când năstureii normali cedează fiindcă ați mâncat prea multă dulceață', 20.5 , 350, 700, 'patiserie', 'comuna', '{"migdale", "faina","lapte","zahar","unt","dulceata"}', False, 'nasturei-dulceata.jpg'),


-- ('Bomboane de ciocolată pe băț', 'Bățul e cel comestibil, nu bomboana.', 6, 100, 210,'cofetarie', 'pentru copii', '{"ciocolata", "zahar", "lapte", "alune", "faina"}', False, 'bomboane-ciocolata-bat.jpg'),

-- ('Înghețată fumătoare', 'Din când în când, tușește... Dar nu are COVID!', 18.5 , 225, 370, 'gelaterie', 'comuna', '{"smantana","lapte","migdale", "dulceata","zahar","vanilie","ciocolata", "frisca"}', False, 'inghetata-fumatoare.jpg'),


-- ('Înghețată multicoloră', 'Când storci un curcubeu peste înghețată... Ediție limitată; fabricăm doar după ploaie.', 12 , 120, 270, 'gelaterie', 'editie limitata', '{"smantana","lapte","migdale", "dulceata","zahar","vanilie","ciocolata", "frisca"}', False, 'inghetata-multicolora.jpg'),


-- ('Brioșă cu înghețată', 'Nu încercam să fim creativi... Dorelina a încurcat iar rețetele. Măcar are culoare roz', 14 , 235, 340, 'gelaterie', 'pentru copii', '{"frisca", "smantana", "lapte", "ceva roz", "faina","zahar","vanilie"}', False, 'briosa-inghetata.jpg'),

-- ('Înghețată generică', 'Când bușim așa de tare rețeta încât nu se mai încadrează în niuna dintre celelalte categorii.', 8, 90, 130, 'gelaterie','comuna','{"frisca", "smantana", "lapte", "ceva roz", "faina","zahar","vanilie"}', False, 'inghetata-generica.jpg'),

-- ('Imagine cu înghețată', 'Pentru cei aflați la dietă.', 5, 10,10,'gelaterie', 'comuna', '{"hârtie", "tuș"}', False, 'imagine-cu-inghetata.jpg'),


-- ('Bomboane colorate', 'Pentru copiii care doresc să afle devreme cum e o vizită la dentist.', 7, 150,340,'cofetarie', 'pentru copii', '{"zahar", "ciocolata","lapte"}', False, 'bomboane-colorate.jpg');
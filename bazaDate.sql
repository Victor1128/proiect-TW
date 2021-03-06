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




-- ('Dulcelind cu fructe', 'Re??et?? proprie, cu con??inut s??n??tos (dac?? ignora??i tonele de zah??r) de fruncte proaspete', 10 , 250, 620, 'cofetarie', 'aniversara', '{"frisca","zahar","faina","zmeura","lapte","mure","capsuni"}', False,'dulcelind.jpg'),

-- ('Tart?? cu c??p??uni', 'Sub c??p??uni se afl?? o tart??.', 6 , 245, 280, 'cofetarie', 'comuna', '{"vanilie","faina","capsuni","lapte", "indulcitor"}', True,'tarta-capsuni.jpg'),

-- ('Nimic', 'Nimic', 10 , 0, 0, 'cofetarie', 'dietetica', '{}', False, 'nimic.jpg'),

-- ('Cozonac zbur??tor', 'Cineva a v??rsat heliu peste aluat.', 25.5 , 1000, 1800, 'patiserie', 'comuna', '{"zahar","unt","faina","lapte","cacao","alune", "nuca"}', False, 'cozonac-zburator.jpg'),

-- ('Brio??e', 'Aluat pufos, cu buc????ele de ciocolat??. Buc????elele de ciocolata, ??ns??, nu sunt tocmai pufoase.', 8 , 145, 320, 'patiserie', 'comuna', '{"ciocolata","lapte","unt","migdale","faina","zahar"}', False, 'briose.jpg'),

-- ('Turt?? dulce', 'Un produs bun de savurat de Craciun. Sau ??i mai t??rziu dac?? stocul a dep????it cererea. De obicei mai g??si??i ??i prin iunie...', 12 , 400, 550, 'patiserie', 'aniversara', '{"faina","lapte","scortisoara","zahar","unt"}', False, 'turta-dulce.jpg'),

-- ('Turt?? dulce dietetic??', '??ndulcitor ??n loc de zah??r. Dar nu v?? l??sa??i p??c??li??i de nume, ??n rest nimic nu-i dietetic.', 10 , 400, 520, 'patiserie', 'aniversara', '{"faina","lapte","zaharina","unt","scortisoara"}', True, 'turta-dulce-dietetica.jpg'),

-- ('C??su???? din turt?? dulce', 'Vine cu tot cu vr??jitoare ??i cuptor la pachet. A nu se l??sa ??n mijlocul p??durii.', 70 , 450, 2700, 'patiserie', 'aniversara', '{"unt","scortisoara", "oua","faina","lapte","zahar"}', False, 'casuta-turta-dulce.jpg'),

-- ('Croissant', 'Un r??sf???? pufos ??i dulce... mda... dulce... dac?? nu ??ncurc?? Dorelina, iar, sarea cu zah??rul!!!', 5 , 150, 285, 'patiserie', 'comuna', '{"faina","lapte","zahar/sare","unt","ciocolata","migdale"}', False, 'croissant.jpg'),

-- ('Prajitura c??p??uni', 'Pr??jitura se face doar cu comand?? special??, fiindc?? apoi o comand??m ??i noi la r??ndul nostru la cofet??ria vecin??.', 15 , 180, 385, 'cofetarie', 'comanda speciala', '{"faina","lapte","zahar", "capsuni","unt","gelatina"}', False, 'prajitura-capsuni.jpg'),

-- ('Nasturei cu dulcea????', 'Pentru c??nd n??stureii normali cedeaz?? fiindc?? a??i m??ncat prea mult?? dulcea????', 20.5 , 350, 700, 'patiserie', 'comuna', '{"migdale", "faina","lapte","zahar","unt","dulceata"}', False, 'nasturei-dulceata.jpg'),


-- ('Bomboane de ciocolat?? pe b????', 'B????ul e cel comestibil, nu bomboana.', 6, 100, 210,'cofetarie', 'pentru copii', '{"ciocolata", "zahar", "lapte", "alune", "faina"}', False, 'bomboane-ciocolata-bat.jpg'),

-- ('??nghe??at?? fum??toare', 'Din c??nd ??n c??nd, tu??e??te... Dar nu are COVID!', 18.5 , 225, 370, 'gelaterie', 'comuna', '{"smantana","lapte","migdale", "dulceata","zahar","vanilie","ciocolata", "frisca"}', False, 'inghetata-fumatoare.jpg'),


-- ('??nghe??at?? multicolor??', 'C??nd storci un curcubeu peste ??nghe??at??... Edi??ie limitat??; fabric??m doar dup?? ploaie.', 12 , 120, 270, 'gelaterie', 'editie limitata', '{"smantana","lapte","migdale", "dulceata","zahar","vanilie","ciocolata", "frisca"}', False, 'inghetata-multicolora.jpg'),


-- ('Brio???? cu ??nghe??at??', 'Nu ??ncercam s?? fim creativi... Dorelina a ??ncurcat iar re??etele. M??car are culoare roz', 14 , 235, 340, 'gelaterie', 'pentru copii', '{"frisca", "smantana", "lapte", "ceva roz", "faina","zahar","vanilie"}', False, 'briosa-inghetata.jpg'),

-- ('??nghe??at?? generic??', 'C??nd bu??im a??a de tare re??eta ??nc??t nu se mai ??ncadreaz?? ??n niuna dintre celelalte categorii.', 8, 90, 130, 'gelaterie','comuna','{"frisca", "smantana", "lapte", "ceva roz", "faina","zahar","vanilie"}', False, 'inghetata-generica.jpg'),

-- ('Imagine cu ??nghe??at??', 'Pentru cei afla??i la diet??.', 5, 10,10,'gelaterie', 'comuna', '{"h??rtie", "tu??"}', False, 'imagine-cu-inghetata.jpg'),


-- ('Bomboane colorate', 'Pentru copiii care doresc s?? afle devreme cum e o vizit?? la dentist.', 7, 150,340,'cofetarie', 'pentru copii', '{"zahar", "ciocolata","lapte"}', False, 'bomboane-colorate.jpg');
--
-- PostgreSQL database dump
--

-- Dumped from database version 14.2
-- Dumped by pg_dump version 14.2

-- Started on 2022-04-14 10:33:22

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 841 (class 1247 OID 16444)
-- Name: caracteristici_jocuri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.caracteristici_jocuri AS ENUM (
    'single',
    'multi',
    'dlc',
    'story'
);


ALTER TYPE public.caracteristici_jocuri OWNER TO postgres;

--
-- TOC entry 832 (class 1247 OID 16404)
-- Name: categ_jocuri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.categ_jocuri AS ENUM (
    'noi',
    'populare',
    'ieftine',
    'premiate'
);


ALTER TYPE public.categ_jocuri OWNER TO postgres;

--
-- TOC entry 853 (class 1247 OID 16555)
-- Name: producatori; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.producatori AS ENUM (
    'EA Sports',
    'Valve',
    'Fireaxis',
    'Rockstar Games',
    'Ubisoft',
    'SCE Santa Monica',
    'Hazelight'
);


ALTER TYPE public.producatori OWNER TO postgres;

--
-- TOC entry 844 (class 1247 OID 16518)
-- Name: roluri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.roluri AS ENUM (
    'admin',
    'moderator',
    'comun'
);


ALTER TYPE public.roluri OWNER TO postgres;

--
-- TOC entry 835 (class 1247 OID 16414)
-- Name: tipuri_jocuri; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.tipuri_jocuri AS ENUM (
    'RPG',
    'shooter',
    'RTS',
    'sport',
    'curse',
    'casual'
);


ALTER TYPE public.tipuri_jocuri OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 16540)
-- Name: accesari; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.accesari (
    id integer NOT NULL,
    ip character varying(100) NOT NULL,
    user_id integer,
    pagina character varying(500) NOT NULL,
    data_accesare timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.accesari OWNER TO postgres;

--
-- TOC entry 215 (class 1259 OID 16539)
-- Name: accesari_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.accesari_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.accesari_id_seq OWNER TO postgres;

--
-- TOC entry 3372 (class 0 OID 0)
-- Dependencies: 215
-- Name: accesari_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.accesari_id_seq OWNED BY public.accesari.id;


--
-- TOC entry 212 (class 1259 OID 16428)
-- Name: jocuri; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.jocuri (
    id integer NOT NULL,
    nume character varying(50) NOT NULL,
    descriere text,
    pret numeric(8,2) NOT NULL,
    scor integer NOT NULL,
    tip_joc public.tipuri_jocuri DEFAULT 'RPG'::public.tipuri_jocuri,
    producator character varying(50) NOT NULL,
    categorie public.categ_jocuri DEFAULT 'populare'::public.categ_jocuri,
    caracteristici character varying[],
    pt_copii boolean DEFAULT true NOT NULL,
    imagine character varying(300),
    data_lansare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT jocuri_scor_check CHECK ((scor >= 0))
);


ALTER TABLE public.jocuri OWNER TO postgres;

--
-- TOC entry 211 (class 1259 OID 16427)
-- Name: jocuri_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.jocuri_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.jocuri_id_seq OWNER TO postgres;

--
-- TOC entry 3375 (class 0 OID 0)
-- Dependencies: 211
-- Name: jocuri_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.jocuri_id_seq OWNED BY public.jocuri.id;


--
-- TOC entry 210 (class 1259 OID 16396)
-- Name: test; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.test (
    id integer NOT NULL,
    nume character varying(100) NOT NULL,
    pret integer DEFAULT 100 NOT NULL
);


ALTER TABLE public.test OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16395)
-- Name: test_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.test ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 16526)
-- Name: utilizatori; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.utilizatori (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    nume character varying(100) NOT NULL,
    prenume character varying(100) NOT NULL,
    parola character varying(500) NOT NULL,
    rol public.roluri DEFAULT 'comun'::public.roluri NOT NULL,
    email character varying(100) NOT NULL,
    culoare_chat character varying(50) NOT NULL,
    data_adaugare timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    cod character varying(200),
    confirmat_mail boolean DEFAULT false
);


ALTER TABLE public.utilizatori OWNER TO postgres;

--
-- TOC entry 213 (class 1259 OID 16525)
-- Name: utilizatori_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.utilizatori_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.utilizatori_id_seq OWNER TO postgres;

--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 213
-- Name: utilizatori_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.utilizatori_id_seq OWNED BY public.utilizatori.id;


--
-- TOC entry 3205 (class 2604 OID 16543)
-- Name: accesari id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari ALTER COLUMN id SET DEFAULT nextval('public.accesari_id_seq'::regclass);


--
-- TOC entry 3195 (class 2604 OID 16431)
-- Name: jocuri id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jocuri ALTER COLUMN id SET DEFAULT nextval('public.jocuri_id_seq'::regclass);


--
-- TOC entry 3201 (class 2604 OID 16529)
-- Name: utilizatori id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori ALTER COLUMN id SET DEFAULT nextval('public.utilizatori_id_seq'::regclass);


--
-- TOC entry 3366 (class 0 OID 16540)
-- Dependencies: 216
-- Data for Name: accesari; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 3362 (class 0 OID 16428)
-- Dependencies: 212
-- Data for Name: jocuri; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (2, 'Counter Strike Global Offensive', 'Joc shooter!', 0.00, 83, 'shooter', 'Valve', 'ieftine', '{multi,inapp}', false, 'cs.jpg', '2022-03-28 14:23:06.450512');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (3, 'Civilization VI', 'Joc de strategie!', 60.00, 88, 'RTS', 'Fireaxis', 'populare', '{single,multi,dlc}', true, 'civ.jpg', '2022-03-28 14:23:06.450512');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (4, 'GTA V', 'Nu ii trebuie descriere :)!', 15.00, 96, 'shooter', 'Rockstar Games', 'populare', '{single,multi,story}', false, 'gta.jpg', '2022-03-29 18:49:01.337412');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (5, 'Rainbow Six Siege', 'Joc shooter mai tactic decat CS!', 20.00, 79, 'shooter', 'Ubisoft', 'populare', '{multi}', false, 'rss.jpg', '2022-03-29 18:49:01.337412');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (6, 'Assassin''s Creed Odyssey', 'Joc RPG in Grecia Antica!', 60.00, 86, 'RPG', 'Ubisoft', 'populare', '{story,single}', false, 'ac.jpg', '2022-03-29 18:49:01.337412');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (7, 'God of War', 'Joc RPG premiat!', 50.00, 94, 'RPG', 'SCE Santa Monica', 'premiate', '{single,story}', false, 'gow.jpg', '2022-03-29 18:49:01.337412');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (8, 'It takes two', 'Joc co-op pentru intreaga familie', 40.00, 88, 'casual', 'Hazelight', 'premiate', '{multi,puzzle}', true, 'itt.jpg', '2022-03-29 18:49:01.337412');
INSERT INTO public.jocuri (id, nume, descriere, pret, scor, tip_joc, producator, categorie, caracteristici, pt_copii, imagine, data_lansare) VALUES (1, 'Fifa', 'Joc despre fotbal!', 60.00, 73, 'sport', 'EA Sports', 'populare', '{single,multi,inapp}', true, 'fifa.jpg', '2022-04-11 14:23:06.450512');


--
-- TOC entry 3360 (class 0 OID 16396)
-- Dependencies: 210
-- Data for Name: test; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (1, 'abcd', 100);
INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (2, 'def', 17);
INSERT INTO public.test (id, nume, pret) OVERRIDING SYSTEM VALUE VALUES (3, 'xyz', 100);


--
-- TOC entry 3364 (class 0 OID 16526)
-- Dependencies: 214
-- Data for Name: utilizatori; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.utilizatori (id, username, nume, prenume, parola, rol, email, culoare_chat, data_adaugare, cod, confirmat_mail) VALUES (1, 'prof14461', 'Gogulescu', 'Gogu', '8aa232cc8f4e04aa88b0df334eb72f2ba02aa969b65c4476195204a438f4320306f4b84145fe0e9722298c8ee63e7322d84ef84af652a377c48ee1dd4d813fb0', 'comun', 'profprofprof007@gmail.com', 'red', '2022-04-11 15:12:02.950591', NULL, false);


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 215
-- Name: accesari_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.accesari_id_seq', 1, false);


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 211
-- Name: jocuri_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.jocuri_id_seq', 8, true);


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 209
-- Name: test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.test_id_seq', 3, true);


--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 213
-- Name: utilizatori_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.utilizatori_id_seq', 1, true);


--
-- TOC entry 3218 (class 2606 OID 16548)
-- Name: accesari accesari_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_pkey PRIMARY KEY (id);


--
-- TOC entry 3210 (class 2606 OID 16442)
-- Name: jocuri jocuri_nume_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jocuri
    ADD CONSTRAINT jocuri_nume_key UNIQUE (nume);


--
-- TOC entry 3212 (class 2606 OID 16440)
-- Name: jocuri jocuri_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.jocuri
    ADD CONSTRAINT jocuri_pkey PRIMARY KEY (id);


--
-- TOC entry 3208 (class 2606 OID 16401)
-- Name: test test_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.test
    ADD CONSTRAINT test_pkey PRIMARY KEY (id);


--
-- TOC entry 3214 (class 2606 OID 16536)
-- Name: utilizatori utilizatori_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_pkey PRIMARY KEY (id);


--
-- TOC entry 3216 (class 2606 OID 16538)
-- Name: utilizatori utilizatori_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.utilizatori
    ADD CONSTRAINT utilizatori_username_key UNIQUE (username);


--
-- TOC entry 3219 (class 2606 OID 16549)
-- Name: accesari accesari_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.accesari
    ADD CONSTRAINT accesari_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.utilizatori(id);


--
-- TOC entry 3373 (class 0 OID 0)
-- Dependencies: 215
-- Name: SEQUENCE accesari_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.accesari_id_seq TO victor;


--
-- TOC entry 3374 (class 0 OID 0)
-- Dependencies: 212
-- Name: TABLE jocuri; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.jocuri TO victor;


--
-- TOC entry 3376 (class 0 OID 0)
-- Dependencies: 211
-- Name: SEQUENCE jocuri_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.jocuri_id_seq TO victor;


--
-- TOC entry 3377 (class 0 OID 0)
-- Dependencies: 210
-- Name: TABLE test; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.test TO victor;


--
-- TOC entry 3378 (class 0 OID 0)
-- Dependencies: 209
-- Name: SEQUENCE test_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON SEQUENCE public.test_id_seq TO victor;


--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 214
-- Name: TABLE utilizatori; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public.utilizatori TO victor;


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 213
-- Name: SEQUENCE utilizatori_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.utilizatori_id_seq TO victor;


-- Completed on 2022-04-14 10:33:23

--
-- PostgreSQL database dump complete
--


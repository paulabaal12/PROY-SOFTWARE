--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

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

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: vendedores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendedores (
    vendedor_id integer NOT NULL,
    nombre_vendedor character varying(255) NOT NULL
);


ALTER TABLE public.vendedores OWNER TO postgres;

--
-- Name: vendedores_vendedor_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendedores_vendedor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendedores_vendedor_id_seq OWNER TO postgres;

--
-- Name: vendedores_vendedor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendedores_vendedor_id_seq OWNED BY public.vendedores.vendedor_id;


--
-- Name: ventas; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ventas (
    id_venta integer NOT NULL,
    vendedor_id integer,
    monto numeric(10,2),
    fecha_inicio date,
    fecha_fin date,
    medio_pago character varying(50),
    estado character varying(50)
);


ALTER TABLE public.ventas OWNER TO postgres;

--
-- Name: ventas_id_venta_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.ventas_id_venta_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ventas_id_venta_seq OWNER TO postgres;

--
-- Name: ventas_id_venta_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.ventas_id_venta_seq OWNED BY public.ventas.id_venta;


--
-- Name: vendedores vendedor_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendedores ALTER COLUMN vendedor_id SET DEFAULT nextval('public.vendedores_vendedor_id_seq'::regclass);


--
-- Name: ventas id_venta; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas ALTER COLUMN id_venta SET DEFAULT nextval('public.ventas_id_venta_seq'::regclass);


--
-- Data for Name: vendedores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendedores (vendedor_id, nombre_vendedor) FROM stdin;
1	Ana Gomez
\.


--
-- Data for Name: ventas; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ventas (id_venta, vendedor_id, monto, fecha_inicio, fecha_fin, medio_pago, estado) FROM stdin;
1	1	4050.07	2021-12-12	2021-07-17	Visa	Pendiente
2	1	1261.49	2021-04-10	2023-01-23	Transferencia bancaria	Pendiente
3	1	1768.91	2023-08-05	2021-06-19	Dinero	Pendiente
4	1	572.98	2021-02-18	2021-09-10	PayPal	Cancelado
5	1	4416.41	2022-12-25	2021-01-06	Dinero	Completado
6	1	741.05	2021-12-31	2021-09-05	PayPal	Pendiente
7	1	3187.92	2021-07-11	2023-03-16	Mastercard	Completado
8	1	3482.01	2022-01-11	2021-07-26	Mastercard	Cancelado
9	1	399.60	2022-02-18	2021-10-16	Dinero	Completado
10	1	4898.28	2023-05-10	2023-12-26	Mastercard	Completado
\.


--
-- Name: vendedores_vendedor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendedores_vendedor_id_seq', 1, true);


--
-- Name: ventas_id_venta_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.ventas_id_venta_seq', 1, false);


--
-- Name: vendedores vendedores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendedores
    ADD CONSTRAINT vendedores_pkey PRIMARY KEY (vendedor_id);


--
-- Name: ventas ventas_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_pkey PRIMARY KEY (id_venta);


--
-- Name: ventas ventas_vendedor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ventas
    ADD CONSTRAINT ventas_vendedor_id_fkey FOREIGN KEY (vendedor_id) REFERENCES public.vendedores(vendedor_id);


--
-- PostgreSQL database dump complete
--


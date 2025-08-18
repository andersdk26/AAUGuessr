--
-- PostgreSQL database dump
--

\restrict qXK98QsMaIVrR5fwy10mM00AnvDMYMmxlHENUan5Y42kcZG0t22uPqiwKIfb4lD

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-08-18 02:33:10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 6 (class 2615 OID 16437)
-- Name: log; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA log;


ALTER SCHEMA log OWNER TO postgres;

--
-- TOC entry 5 (class 2615 OID 16431)
-- Name: user; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA "user";


ALTER SCHEMA "user" OWNER TO pg_database_owner;

--
-- TOC entry 4859 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA "user"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "user" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 16439)
-- Name: UserErrors; Type: TABLE; Schema: log; Owner: postgres
--

CREATE TABLE log."UserErrors" (
    id bigint NOT NULL,
    user_id integer,
    error_message character varying(256),
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE log."UserErrors" OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 16438)
-- Name: UserErrors_id_seq; Type: SEQUENCE; Schema: log; Owner: postgres
--

ALTER TABLE log."UserErrors" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME log."UserErrors_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 16432)
-- Name: Users; Type: TABLE; Schema: user; Owner: postgres
--

CREATE TABLE "user"."Users" (
    id bigint NOT NULL,
    username character(32),
    email character(128),
    password character(256)
);


ALTER TABLE "user"."Users" OWNER TO postgres;

--
-- TOC entry 4853 (class 0 OID 16439)
-- Dependencies: 220
-- Data for Name: UserErrors; Type: TABLE DATA; Schema: log; Owner: postgres
--

COPY log."UserErrors" (id, user_id, error_message, "timestamp") FROM stdin;
2	1	Failed to set username for user with ID 1: error returned from database: value too long for type character(32)	2025-08-17 23:21:27.443691
1	\N	hi	2025-08-18 01:20:17.57426
3	1	Failed to set username for user with ID 1: error returned from database: value too long for type character(32)	2025-08-18 00:08:01.269626
4	\N	Hej	2025-08-18 02:13:52.26451
5	\N	login test	2025-08-18 00:15:15.414186
6	\N	login test	2025-08-18 00:15:32.093339
7	\N	login test	2025-08-18 00:18:18.125365
8	\N	login test	2025-08-18 00:18:19.329034
9	\N	login test	2025-08-18 00:18:40.163172
10	\N	login test	2025-08-18 00:19:46.755729
\.


--
-- TOC entry 4851 (class 0 OID 16432)
-- Dependencies: 218
-- Data for Name: Users; Type: TABLE DATA; Schema: user; Owner: postgres
--

COPY "user"."Users" (id, username, email, password) FROM stdin;
1	Hej                             	1@mail.com                                                                                                                      	$argon2id$v=19$m=32768,t=3,p=1$oNvI/X9x3Iqa335KGYvmuw$71plIoXmj/MMGiXSnVvLLUjTDqaupFrQWE2FhqJ6+4M                                                                                                                                                               
7266747678	Anders                          	andersdk26@gmail.com                                                                                                            	$argon2id$v=19$m=32768,t=3,p=1$oNvI/X9x3Iqa335KGYvmuw$71plIoXmj/MMGiXSnVvLLUjTDqaupFrQWE2FhqJ6+4M                                                                                                                                                               
2	sdfnjkdsln                      	2@mail.com                                                                                                                      	$argon2id$v=19$m=32768,t=3,p=1$oNvI/X9x3Iqa335KGYvmuw$71plIoXmj/MMGiXSnVvLLUjTDqaupFrQWE2FhqJ6+4M                                                                                                                                                               
\.


--
-- TOC entry 4861 (class 0 OID 0)
-- Dependencies: 219
-- Name: UserErrors_id_seq; Type: SEQUENCE SET; Schema: log; Owner: postgres
--

SELECT pg_catalog.setval('log."UserErrors_id_seq"', 10, true);


--
-- TOC entry 4704 (class 2606 OID 16443)
-- Name: UserErrors UserErrors_pkey; Type: CONSTRAINT; Schema: log; Owner: postgres
--

ALTER TABLE ONLY log."UserErrors"
    ADD CONSTRAINT "UserErrors_pkey" PRIMARY KEY (id);


--
-- TOC entry 4702 (class 2606 OID 16436)
-- Name: Users User_pkey; Type: CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4705 (class 2606 OID 16444)
-- Name: UserErrors user_id; Type: FK CONSTRAINT; Schema: log; Owner: postgres
--

ALTER TABLE ONLY log."UserErrors"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES "user"."Users"(id);


--
-- TOC entry 4860 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA "user"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "user" TO PUBLIC;


-- Completed on 2025-08-18 02:33:10

--
-- PostgreSQL database dump complete
--

\unrestrict qXK98QsMaIVrR5fwy10mM00AnvDMYMmxlHENUan5Y42kcZG0t22uPqiwKIfb4lD


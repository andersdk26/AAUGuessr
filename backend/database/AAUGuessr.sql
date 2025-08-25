--
-- PostgreSQL database dump
--

\restrict MlMzJKlV4kqqWWRDxKkduHluIGfxOHF1oZU7vKgqPDxAML6pe7HuNBcnDupchQ9

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.6

-- Started on 2025-08-25 23:15:49

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
-- TOC entry 5 (class 2615 OID 16437)
-- Name: log; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA log;


ALTER SCHEMA log OWNER TO postgres;

--
-- TOC entry 6 (class 2615 OID 16431)
-- Name: user; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA "user";


ALTER SCHEMA "user" OWNER TO pg_database_owner;

--
-- TOC entry 4871 (class 0 OID 0)
-- Dependencies: 6
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
    user_id bigint,
    error_message character varying(256) NOT NULL,
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
-- TOC entry 221 (class 1259 OID 16450)
-- Name: RefreshTokens; Type: TABLE; Schema: user; Owner: postgres
--

CREATE TABLE "user"."RefreshTokens" (
    id bigint NOT NULL,
    token character varying(64) NOT NULL,
    "userId" bigint NOT NULL,
    expires timestamp without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "createdByIp" character varying(39) NOT NULL,
    "revokedAt" timestamp without time zone,
    "revokedByIp" character varying(39),
    "replacedByTokenId" bigint
);


ALTER TABLE "user"."RefreshTokens" OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16486)
-- Name: RefreshTokens_id_seq; Type: SEQUENCE; Schema: user; Owner: postgres
--

ALTER TABLE "user"."RefreshTokens" ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME "user"."RefreshTokens_id_seq"
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
    username character varying(32),
    email character varying(128),
    password character varying(128)
);


ALTER TABLE "user"."Users" OWNER TO postgres;

--
-- TOC entry 4863 (class 0 OID 16439)
-- Dependencies: 220
-- Data for Name: UserErrors; Type: TABLE DATA; Schema: log; Owner: postgres
--

COPY log."UserErrors" (id, user_id, error_message, "timestamp") FROM stdin;
\.


--
-- TOC entry 4864 (class 0 OID 16450)
-- Dependencies: 221
-- Data for Name: RefreshTokens; Type: TABLE DATA; Schema: user; Owner: postgres
--

COPY "user"."RefreshTokens" (id, token, "userId", expires, "createdAt", "createdByIp", "revokedAt", "revokedByIp", "replacedByTokenId") FROM stdin;
1	dc7063cf3293628cd7eaac05315a29eaa01e2ffef75453f1b703272ff6fecc52	7266747678	2025-09-24 21:10:04.193017	2025-08-25 21:10:04.195721	127.0.0.1	2025-08-25 21:10:50.106043	127.0.0.1	\N
\.


--
-- TOC entry 4861 (class 0 OID 16432)
-- Dependencies: 218
-- Data for Name: Users; Type: TABLE DATA; Schema: user; Owner: postgres
--

COPY "user"."Users" (id, username, email, password) FROM stdin;
1	Hej	1@mail.com	$argon2id$v=19$m=32768,t=3,p=1$oNvI/X9x3Iqa335KGYvmuw$71plIoXmj/MMGiXSnVvLLUjTDqaupFrQWE2FhqJ6+4M
2	sdfnjkdsln	2@mail.com	$argon2id$v=19$m=32768,t=3,p=1$oNvI/X9x3Iqa335KGYvmuw$71plIoXmj/MMGiXSnVvLLUjTDqaupFrQWE2FhqJ6+4M
7266747678	Anders	anders@gmail.com	$argon2id$v=19$m=32768,t=3,p=1$oNvI/X9x3Iqa335KGYvmuw$71plIoXmj/MMGiXSnVvLLUjTDqaupFrQWE2FhqJ6+4M
\.


--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 219
-- Name: UserErrors_id_seq; Type: SEQUENCE SET; Schema: log; Owner: postgres
--

SELECT pg_catalog.setval('log."UserErrors_id_seq"', 1, false);


--
-- TOC entry 4874 (class 0 OID 0)
-- Dependencies: 222
-- Name: RefreshTokens_id_seq; Type: SEQUENCE SET; Schema: user; Owner: postgres
--

SELECT pg_catalog.setval('"user"."RefreshTokens_id_seq"', 1, true);


--
-- TOC entry 4710 (class 2606 OID 16443)
-- Name: UserErrors UserErrors_pkey; Type: CONSTRAINT; Schema: log; Owner: postgres
--

ALTER TABLE ONLY log."UserErrors"
    ADD CONSTRAINT "UserErrors_pkey" PRIMARY KEY (id);


--
-- TOC entry 4712 (class 2606 OID 16455)
-- Name: RefreshTokens RefreshTokens_pkey; Type: CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."RefreshTokens"
    ADD CONSTRAINT "RefreshTokens_pkey" PRIMARY KEY (id);


--
-- TOC entry 4708 (class 2606 OID 16436)
-- Name: Users User_pkey; Type: CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4713 (class 2606 OID 16477)
-- Name: UserErrors user_id; Type: FK CONSTRAINT; Schema: log; Owner: postgres
--

ALTER TABLE ONLY log."UserErrors"
    ADD CONSTRAINT user_id FOREIGN KEY (user_id) REFERENCES "user"."Users"(id);


--
-- TOC entry 4714 (class 2606 OID 16461)
-- Name: RefreshTokens replacedTokenId; Type: FK CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."RefreshTokens"
    ADD CONSTRAINT "replacedTokenId" FOREIGN KEY ("replacedByTokenId") REFERENCES "user"."RefreshTokens"(id) NOT VALID;


--
-- TOC entry 4715 (class 2606 OID 16468)
-- Name: RefreshTokens userId; Type: FK CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."RefreshTokens"
    ADD CONSTRAINT "userId" FOREIGN KEY ("userId") REFERENCES "user"."Users"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 4872 (class 0 OID 0)
-- Dependencies: 6
-- Name: SCHEMA "user"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "user" TO PUBLIC;


-- Completed on 2025-08-25 23:15:50

--
-- PostgreSQL database dump complete
--

\unrestrict MlMzJKlV4kqqWWRDxKkduHluIGfxOHF1oZU7vKgqPDxAML6pe7HuNBcnDupchQ9


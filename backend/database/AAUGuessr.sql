--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-02-19 13:43:45

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
-- TOC entry 5 (class 2615 OID 16431)
-- Name: user; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA "user";


ALTER SCHEMA "user" OWNER TO pg_database_owner;

--
-- TOC entry 4846 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA "user"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "user" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 217 (class 1259 OID 16432)
-- Name: Users; Type: TABLE; Schema: user; Owner: postgres
--

CREATE TABLE "user"."Users" (
    id bigint NOT NULL,
    username character(32)
);


ALTER TABLE "user"."Users" OWNER TO postgres;

--
-- TOC entry 4695 (class 2606 OID 16436)
-- Name: Users User_pkey; Type: CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- TOC entry 4847 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA "user"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "user" TO PUBLIC;


-- Completed on 2025-02-19 13:43:45

--
-- PostgreSQL database dump complete
--


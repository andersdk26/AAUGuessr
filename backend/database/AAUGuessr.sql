toc.dat                                                                                             0000600 0004000 0002000 00000003601 14755360552 0014453 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        PGDMP       1                }         	   AAUGuessr    17.2    17.2 	    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false         �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false         �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false         �           1262    16427 	   AAUGuessr    DATABASE        CREATE DATABASE "AAUGuessr" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Danish_Denmark.1252';
    DROP DATABASE "AAUGuessr";
                     postgres    false                     2615    16431    user    SCHEMA        CREATE SCHEMA "user";
    DROP SCHEMA "user";
                     pg_database_owner    false         �           0    0    SCHEMA "user"    COMMENT     6   COMMENT ON SCHEMA "user" IS 'standard public schema';
                        pg_database_owner    false    5         �           0    0    SCHEMA "user"    ACL     (   GRANT USAGE ON SCHEMA "user" TO PUBLIC;
                        pg_database_owner    false    5         �            1259    16432    Users    TABLE     T   CREATE TABLE "user"."Users" (
    id bigint NOT NULL,
    username character(32)
);
    DROP TABLE "user"."Users";
       user         heap r       postgres    false    5         W           2606    16436    Users User_pkey 
   CONSTRAINT     Q   ALTER TABLE ONLY "user"."Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 =   ALTER TABLE ONLY "user"."Users" DROP CONSTRAINT "User_pkey";
       user                 postgres    false    217                                                                                                                                       restore.sql                                                                                         0000600 0004000 0002000 00000004201 14755360552 0015375 0                                                                                                    ustar 00postgres                        postgres                        0000000 0000000                                                                                                                                                                        --
-- NOTE:
--
-- File paths need to be edited. Search for $$PATH$$ and
-- replace it with the path to the directory containing
-- the extracted data files.
--
--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

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

DROP DATABASE "AAUGuessr";
--
-- Name: AAUGuessr; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "AAUGuessr" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Danish_Denmark.1252';


ALTER DATABASE "AAUGuessr" OWNER TO postgres;

\connect "AAUGuessr"

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
-- Name: user; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA "user";


ALTER SCHEMA "user" OWNER TO pg_database_owner;

--
-- Name: SCHEMA "user"; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA "user" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Users; Type: TABLE; Schema: user; Owner: postgres
--

CREATE TABLE "user"."Users" (
    id bigint NOT NULL,
    username character(32)
);


ALTER TABLE "user"."Users" OWNER TO postgres;

--
-- Name: Users User_pkey; Type: CONSTRAINT; Schema: user; Owner: postgres
--

ALTER TABLE ONLY "user"."Users"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: SCHEMA "user"; Type: ACL; Schema: -; Owner: pg_database_owner
--

GRANT USAGE ON SCHEMA "user" TO PUBLIC;


--
-- PostgreSQL database dump complete
--

                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
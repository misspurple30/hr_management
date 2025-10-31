--
-- PostgreSQL database dump
--

\restrict aYlFSYfLABFLJf2gedfIbCVi6gkhLtQGvYECgLf4olTCXhtlWGSgkopu1vPz2mY

-- Dumped from database version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.10 (Ubuntu 16.10-0ubuntu0.24.04.1)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: hr_user
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO hr_user;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: hr_user
--

COMMENT ON SCHEMA public IS '';


--
-- Name: EmployeeStatus; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."EmployeeStatus" AS ENUM (
    'ACTIVE',
    'INACTIVE',
    'ON_LEAVE',
    'TERMINATED'
);


ALTER TYPE public."EmployeeStatus" OWNER TO hr_user;

--
-- Name: JobStatus; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."JobStatus" AS ENUM (
    'OPEN',
    'CLOSED',
    'ON_HOLD'
);


ALTER TYPE public."JobStatus" OWNER TO hr_user;

--
-- Name: JobType; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."JobType" AS ENUM (
    'FULL_TIME',
    'PART_TIME',
    'CONTRACT',
    'INTERN'
);


ALTER TYPE public."JobType" OWNER TO hr_user;

--
-- Name: Priority; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."Priority" AS ENUM (
    'LOW',
    'NORMAL',
    'HIGH',
    'URGENT'
);


ALTER TYPE public."Priority" OWNER TO hr_user;

--
-- Name: RequestStatus; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."RequestStatus" AS ENUM (
    'PENDING',
    'APPROVED',
    'REJECTED'
);


ALTER TYPE public."RequestStatus" OWNER TO hr_user;

--
-- Name: ScheduleType; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."ScheduleType" AS ENUM (
    'MEETING',
    'INTERVIEW',
    'TRAINING',
    'REVIEW',
    'OTHER'
);


ALTER TYPE public."ScheduleType" OWNER TO hr_user;

--
-- Name: Urgency; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."Urgency" AS ENUM (
    'NORMAL',
    'URGENT'
);


ALTER TYPE public."Urgency" OWNER TO hr_user;

--
-- Name: UserRole; Type: TYPE; Schema: public; Owner: hr_user
--

CREATE TYPE public."UserRole" AS ENUM (
    'ADMIN',
    'HR_MANAGER',
    'USER'
);


ALTER TYPE public."UserRole" OWNER TO hr_user;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO hr_user;

--
-- Name: announcements; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.announcements (
    id text NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    priority public."Priority" DEFAULT 'NORMAL'::public."Priority" NOT NULL,
    "isPinned" boolean DEFAULT false NOT NULL,
    "authorId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.announcements OWNER TO hr_user;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.departments (
    id text NOT NULL,
    name text NOT NULL,
    description text,
    color text,
    "headCount" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.departments OWNER TO hr_user;

--
-- Name: employees; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.employees (
    id text NOT NULL,
    "userId" text NOT NULL,
    "employeeId" text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    phone text,
    avatar text,
    "position" text NOT NULL,
    salary numeric(10,2),
    "hireDate" timestamp(3) without time zone NOT NULL,
    status public."EmployeeStatus" DEFAULT 'ACTIVE'::public."EmployeeStatus" NOT NULL,
    "departmentId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.employees OWNER TO hr_user;

--
-- Name: job_positions; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.job_positions (
    id text NOT NULL,
    title text NOT NULL,
    department text NOT NULL,
    type public."JobType" DEFAULT 'FULL_TIME'::public."JobType" NOT NULL,
    urgency public."Urgency" DEFAULT 'NORMAL'::public."Urgency" NOT NULL,
    status public."JobStatus" DEFAULT 'OPEN'::public."JobStatus" NOT NULL,
    description text,
    requirements text,
    "activeHiring" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.job_positions OWNER TO hr_user;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.schedules (
    id text NOT NULL,
    title text NOT NULL,
    description text,
    "startTime" timestamp(3) without time zone NOT NULL,
    "endTime" timestamp(3) without time zone NOT NULL,
    type public."ScheduleType" DEFAULT 'MEETING'::public."ScheduleType" NOT NULL,
    "employeeId" text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.schedules OWNER TO hr_user;

--
-- Name: talent_requests; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.talent_requests (
    id text NOT NULL,
    department text NOT NULL,
    "position" text NOT NULL,
    quantity integer NOT NULL,
    priority public."Priority" DEFAULT 'NORMAL'::public."Priority" NOT NULL,
    status public."RequestStatus" DEFAULT 'PENDING'::public."RequestStatus" NOT NULL,
    description text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.talent_requests OWNER TO hr_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: hr_user
--

CREATE TABLE public.users (
    id text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    role public."UserRole" DEFAULT 'USER'::public."UserRole" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO hr_user;

--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
f10d784d-cc10-4c30-a180-7bf8fdbc8246	f2b16c7a00949012dd5117b65f55c9caa9e9e1ff486f8d5aaad9a3797ce32a5a	2025-10-31 06:46:36.943316+00	20251029132335_init_hr_management	\N	\N	2025-10-31 06:46:36.782612+00	1
\.


--
-- Data for Name: announcements; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.announcements (id, title, description, priority, "isPinned", "authorId", "createdAt", "updatedAt") FROM stdin;
8b6c7c2d-af21-4348-a8ab-3cfd6a544e6c	Outing schedule for every departement	Team building activities scheduled for next month	NORMAL	t	5df184cf-9298-4290-842c-980ae346db8e	2025-10-31 06:48:52.025	2025-10-31 06:48:52.025
91279836-6a64-4ac9-84fa-c6975ad9c5eb	Meeting HR Department	Quarterly HR meeting to discuss policies	NORMAL	f	5df184cf-9298-4290-842c-980ae346db8e	2025-10-31 06:48:52.025	2025-10-31 06:48:52.025
779ab42e-a74d-4539-ae8e-1a2d14a07039	IT Department need two more talents for UX/UI Designer position	Urgent hiring for UX/UI positions	HIGH	t	5df184cf-9298-4290-842c-980ae346db8e	2025-10-31 06:48:52.025	2025-10-31 06:48:52.025
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.departments (id, name, description, color, "headCount", "createdAt", "updatedAt") FROM stdin;
b260fb72-7df9-44dc-82aa-5f3bdff3bc8f	Human Resources	Managing employee relations and recruitment	#FF6B6B	2	2025-10-31 06:48:51.822	2025-10-31 06:48:51.971
409cce95-f2ee-4581-8b14-af38995e492d	IT Department	Technology and infrastructure management	#4ECDC4	2	2025-10-31 06:48:51.822	2025-10-31 06:48:51.976
a42a21ac-7318-48eb-9d60-e2fe53e22d9f	Marketing	Brand management and marketing strategies	#45B7D1	2	2025-10-31 06:48:51.824	2025-10-31 06:48:51.981
092b17f5-f8e9-4e90-b9e6-a58908f4356b	Finance	Financial planning and accounting	#96CEB4	1	2025-10-31 06:48:51.822	2025-10-31 06:48:51.987
0f770f4e-09d6-436b-8e6c-c2cdba05762e	Operations	Daily operations and logistics	#FFEAA7	1	2025-10-31 06:48:51.823	2025-10-31 06:48:52.008
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.employees (id, "userId", "employeeId", "firstName", "lastName", email, phone, avatar, "position", salary, "hireDate", status, "departmentId", "createdAt", "updatedAt") FROM stdin;
5df184cf-9298-4290-842c-980ae346db8e	09d5e679-c5ef-4542-9ddc-7558796cfda4	EMP001	Admira	John	admira.john@wehr.com	+1-555-8151	\N	HR Manager	75000.00	2023-07-22 00:00:00	ACTIVE	b260fb72-7df9-44dc-82aa-5f3bdff3bc8f	2025-10-31 06:48:51.882	2025-10-31 06:48:51.882
5fa0268b-5ef6-4c60-ab79-069e2a82acb0	233d6056-9e1c-4b90-a637-a1bdfb94db07	EMP002	Sarah	Williams	sarah.williams@wehr.com	+1-555-7963	\N	Senior Developer	85000.00	2023-08-16 00:00:00	ACTIVE	409cce95-f2ee-4581-8b14-af38995e492d	2025-10-31 06:48:51.919	2025-10-31 06:48:51.919
2c1012c7-7ec2-4fe4-8224-1a051181bef4	063fd498-fdb4-43ae-8cca-6b81cb4553c7	EMP003	Michael	Brown	michael.brown@wehr.com	+1-555-3137	\N	Marketing Director	80000.00	2023-01-11 00:00:00	ACTIVE	a42a21ac-7318-48eb-9d60-e2fe53e22d9f	2025-10-31 06:48:51.932	2025-10-31 06:48:51.932
a73430a4-14cf-4c74-956c-49b22cf2f16f	17e67d94-6700-438f-8734-e04eb3625201	EMP004	Emily	Davis	emily.davis@wehr.com	+1-555-8670	\N	Financial Analyst	65000.00	2023-01-16 00:00:00	ACTIVE	092b17f5-f8e9-4e90-b9e6-a58908f4356b	2025-10-31 06:48:51.941	2025-10-31 06:48:51.941
6e104e3a-62fd-43e3-8434-6c9c92c416a1	c822bd99-bf39-4ebb-aa78-61745d74cd1c	EMP005	James	Wilson	james.wilson@wehr.com	+1-555-9832	\N	Operations Manager	70000.00	2023-10-22 00:00:00	ACTIVE	0f770f4e-09d6-436b-8e6c-c2cdba05762e	2025-10-31 06:48:51.946	2025-10-31 06:48:51.946
78d5198d-76d2-4a94-95f5-c8ba1c6e4d63	19c2fb25-cf40-4bb5-a603-b42415a66f22	EMP006	Lisa	Anderson	lisa.anderson@wehr.com	+1-555-1819	\N	UX Designer	68000.00	2023-06-07 00:00:00	ACTIVE	409cce95-f2ee-4581-8b14-af38995e492d	2025-10-31 06:48:51.953	2025-10-31 06:48:51.953
23aa4d91-f3ba-424b-9d32-e1fc1085c6c4	140f0818-7abc-42ef-acd2-6f8bf99ad46c	EMP007	Robert	Taylor	robert.taylor@wehr.com	+1-555-6955	\N	HR Specialist	55000.00	2023-07-23 00:00:00	ACTIVE	b260fb72-7df9-44dc-82aa-5f3bdff3bc8f	2025-10-31 06:48:51.959	2025-10-31 06:48:51.959
76c255d7-619c-47c2-a4f6-f79ec0f89d76	729d4151-182d-49b0-a65a-6bd4fc6b36f8	EMP008	Jennifer	Martinez	jennifer.martinez@wehr.com	+1-555-9443	\N	Marketing Specialist	58000.00	2023-06-21 00:00:00	ACTIVE	a42a21ac-7318-48eb-9d60-e2fe53e22d9f	2025-10-31 06:48:51.964	2025-10-31 06:48:51.964
\.


--
-- Data for Name: job_positions; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.job_positions (id, title, department, type, urgency, status, description, requirements, "activeHiring", "createdAt", "updatedAt") FROM stdin;
c56fa1ed-6c62-4210-a229-e37fdd181d95	UX/UI Designer	IT Department	FULL_TIME	URGENT	OPEN	Looking for creative UX/UI designers	\N	2	2025-10-31 06:48:52.015	2025-10-31 06:48:52.015
d8652ce5-92e9-4eec-abf6-b6c1cc5c8ea0	Backend Developer	IT Department	FULL_TIME	URGENT	OPEN	Need experienced backend developers	\N	3	2025-10-31 06:48:52.015	2025-10-31 06:48:52.015
63732657-abae-4e9b-9152-6f296892a87c	Marketing Coordinator	Marketing	FULL_TIME	NORMAL	OPEN	\N	\N	1	2025-10-31 06:48:52.015	2025-10-31 06:48:52.015
87d38750-0443-44d3-b6d5-ac13650ad12f	HR Assistant	Human Resources	PART_TIME	NORMAL	OPEN	\N	\N	1	2025-10-31 06:48:52.015	2025-10-31 06:48:52.015
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.schedules (id, title, description, "startTime", "endTime", type, "employeeId", "createdAt", "updatedAt") FROM stdin;
88aa87f1-7dc5-4d73-a4a9-718d82124a89	Review candidate applications	Review and shortlist candidates for developer position	2025-10-31 08:48:52.03	2025-10-31 09:48:52.03	REVIEW	5df184cf-9298-4290-842c-980ae346db8e	2025-10-31 06:48:52.031	2025-10-31 06:48:52.031
3b9eb117-c110-41b1-9e88-f685c105f4f6	Interview with candidates	Technical interview with shortlisted candidates	2025-10-31 11:48:52.03	2025-10-31 12:48:52.03	INTERVIEW	5df184cf-9298-4290-842c-980ae346db8e	2025-10-31 06:48:52.031	2025-10-31 06:48:52.031
5c92a4ed-4300-4f0c-b08b-8529c8f3dc57	Short meeting with product designer from IT Department	Discuss new UI/UX improvements	2025-10-31 14:48:52.03	2025-10-31 15:48:52.03	MEETING	5df184cf-9298-4290-842c-980ae346db8e	2025-10-31 06:48:52.031	2025-10-31 06:48:52.031
\.


--
-- Data for Name: talent_requests; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.talent_requests (id, department, "position", quantity, priority, status, description, "createdAt", "updatedAt") FROM stdin;
1099f42b-3c6d-43a7-ac7a-347cc564f0aa	IT Department	Senior Developer	2	HIGH	PENDING	\N	2025-10-31 06:48:52.021	2025-10-31 06:48:52.021
fbb6ce15-7375-4cb3-a432-2d933110bc83	Marketing	Content Writer	1	NORMAL	PENDING	\N	2025-10-31 06:48:52.021	2025-10-31 06:48:52.021
99af793a-7713-492c-a790-b75b88cd9393	Finance	Accountant	1	HIGH	APPROVED	\N	2025-10-31 06:48:52.021	2025-10-31 06:48:52.021
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: hr_user
--

COPY public.users (id, email, password, "firstName", "lastName", role, "createdAt", "updatedAt") FROM stdin;
b905027d-190e-4ff9-a273-3420220c34b1	admin@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Admin	User	ADMIN	2025-10-31 06:48:51.813	2025-10-31 06:48:51.813
09d5e679-c5ef-4542-9ddc-7558796cfda4	admira.john@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Admira	John	HR_MANAGER	2025-10-31 06:48:51.878	2025-10-31 06:48:51.878
233d6056-9e1c-4b90-a637-a1bdfb94db07	sarah.williams@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Sarah	Williams	USER	2025-10-31 06:48:51.893	2025-10-31 06:48:51.893
063fd498-fdb4-43ae-8cca-6b81cb4553c7	michael.brown@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Michael	Brown	USER	2025-10-31 06:48:51.93	2025-10-31 06:48:51.93
17e67d94-6700-438f-8734-e04eb3625201	emily.davis@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Emily	Davis	USER	2025-10-31 06:48:51.938	2025-10-31 06:48:51.938
c822bd99-bf39-4ebb-aa78-61745d74cd1c	james.wilson@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	James	Wilson	USER	2025-10-31 06:48:51.944	2025-10-31 06:48:51.944
19c2fb25-cf40-4bb5-a603-b42415a66f22	lisa.anderson@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Lisa	Anderson	USER	2025-10-31 06:48:51.949	2025-10-31 06:48:51.949
140f0818-7abc-42ef-acd2-6f8bf99ad46c	robert.taylor@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Robert	Taylor	USER	2025-10-31 06:48:51.956	2025-10-31 06:48:51.956
729d4151-182d-49b0-a65a-6bd4fc6b36f8	jennifer.martinez@wehr.com	$2b$10$n1Yy88ePbH8Hhr.KMtL1bO7yXNpN3PMwt4RE0medFFCd/fd5dEl.W	Jennifer	Martinez	USER	2025-10-31 06:48:51.962	2025-10-31 06:48:51.962
\.


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: announcements announcements_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT announcements_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: job_positions job_positions_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.job_positions
    ADD CONSTRAINT job_positions_pkey PRIMARY KEY (id);


--
-- Name: schedules schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT schedules_pkey PRIMARY KEY (id);


--
-- Name: talent_requests talent_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.talent_requests
    ADD CONSTRAINT talent_requests_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: departments_name_key; Type: INDEX; Schema: public; Owner: hr_user
--

CREATE UNIQUE INDEX departments_name_key ON public.departments USING btree (name);


--
-- Name: employees_email_key; Type: INDEX; Schema: public; Owner: hr_user
--

CREATE UNIQUE INDEX employees_email_key ON public.employees USING btree (email);


--
-- Name: employees_employeeId_key; Type: INDEX; Schema: public; Owner: hr_user
--

CREATE UNIQUE INDEX "employees_employeeId_key" ON public.employees USING btree ("employeeId");


--
-- Name: employees_userId_key; Type: INDEX; Schema: public; Owner: hr_user
--

CREATE UNIQUE INDEX "employees_userId_key" ON public.employees USING btree ("userId");


--
-- Name: users_email_key; Type: INDEX; Schema: public; Owner: hr_user
--

CREATE UNIQUE INDEX users_email_key ON public.users USING btree (email);


--
-- Name: announcements announcements_authorId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.announcements
    ADD CONSTRAINT "announcements_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_departmentId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public.departments(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: employees employees_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT "employees_userId_fkey" FOREIGN KEY ("userId") REFERENCES public.users(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: schedules schedules_employeeId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: hr_user
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "schedules_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES public.employees(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: hr_user
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;


--
-- PostgreSQL database dump complete
--

\unrestrict aYlFSYfLABFLJf2gedfIbCVi6gkhLtQGvYECgLf4olTCXhtlWGSgkopu1vPz2mY


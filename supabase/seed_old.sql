--@(#) script.ddl

CREATE TABLE public.naudotojo_busena
(
	id int NOT NULL,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO public.naudotojo_busena(id, name) VALUES(1, 'aktyvus');
INSERT INTO public.naudotojo_busena(id, name) VALUES(2, 'neaktyvus');

CREATE TABLE public.rezervacijos_statusas
(
	id int NOT NULL,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO public.rezervacijos_statusas(id, name) VALUES(1, 'pateikta');
INSERT INTO public.rezervacijos_statusas(id, name) VALUES(2, 'patvirtinta');
INSERT INTO public.rezervacijos_statusas(id, name) VALUES(3, 'atmesta');

CREATE TABLE public.skelbimu_kategorijos
(
	id int,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO public.skelbimu_kategorijos(id, name) VALUES(1, 'Namas');
INSERT INTO public.skelbimu_kategorijos(id, name) VALUES(2, 'Butas');
INSERT INTO public.skelbimu_kategorijos(id, name) VALUES(3, 'Kambarys');
INSERT INTO public.skelbimu_kategorijos(id, name) VALUES(4, 'Apartamentai');

CREATE TABLE public.zinutes_statusas
(
	id int NOT NULL,
	name varchar (60) NOT NULL,
	PRIMARY KEY(id)
);
INSERT INTO public.zinutes_statusas(id, name) VALUES(1, 'issiusta');
INSERT INTO public.zinutes_statusas(id, name) VALUES(2, 'gauta');
INSERT INTO public.zinutes_statusas(id, name) VALUES(3, 'perskaityta');
INSERT INTO public.zinutes_statusas(id, name) VALUES(4, 'pasalinta');

CREATE TABLE public.Naudotojas
(
	id int NOT NULL,
	el_pastas varchar (255) NOT NULL,
	slaptazodis varchar (255) NOT NULL,
	vardas varchar (255) NOT NULL,
	pavarde varchar (255) NOT NULL,
	gimimo_data date NOT NULL,
	telefonas varchar (255) NOT NULL,
	nuotrauka varchar (255) NOT NULL,
	paskutinis_prisijungimas date NOT NULL,
	registracijos_data date NOT NULL,
	atnaujinimo_data date NOT NULL,
	salis varchar (255) NOT NULL,
	miestas varchar (255) NOT NULL,
	busena int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(busena) REFERENCES public.naudotojo_busena (id)
);

CREATE TABLE public.Valdytojas
(
	id int NOT NULL,
	asmens_kodas varchar (255) NOT NULL,
	banko_saskaita varchar (255) NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fkc_Naudotojas FOREIGN KEY(id) REFERENCES public.Naudotojas (id)
);

CREATE TABLE public.Skelbimas
(
	suspendavimo_statusas boolean NOT NULL,
	nuotraukos varchar (255) NOT NULL,
	id int NOT NULL,
	pavadinimas varchar (255) NOT NULL,
	aprasymas varchar (255) NOT NULL,
	miestas varchar (255) NOT NULL,
	adresas varchar (255) NOT NULL,
	sukurimo_data date NOT NULL,
	vietu_skaicius int NOT NULL,
	paros_kaina double precision NOT NULL,
	kategorija int NOT NULL,
	fk_Valdytojas int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(kategorija) REFERENCES public.skelbimu_kategorijos (id),
	CONSTRAINT fkc_Valdytojas FOREIGN KEY(fk_Valdytojas) REFERENCES public.Valdytojas (id)
);

CREATE TABLE public.Ataskaita
(
	id int NOT NULL,
	pavadinimas varchar (255) NOT NULL,
	sukurimo_data date NOT NULL,
	pradzios_data date NOT NULL,
	pabaigos_data date NOT NULL,
	failo_url varchar (255) NOT NULL,
	fk_Skelbimas int NOT NULL,
	fk_Valdytojas int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fkc_Skelbimas FOREIGN KEY(fk_Skelbimas) REFERENCES public.Skelbimas (id),
	CONSTRAINT fkc_Valdytojas FOREIGN KEY(fk_Valdytojas) REFERENCES public.Valdytojas (id)
);

CREATE TABLE public.Nuotrauka
(
	id int NOT NULL,
	nuoroda varchar (255) NOT NULL,
	fk_Skelbimas int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fkc_Skelbimas FOREIGN KEY(fk_Skelbimas) REFERENCES public.Skelbimas (id)
);

CREATE TABLE public.Paslauga
(
	id int NOT NULL,
	pavadinimas varchar (255) NOT NULL,
	aprasymas varchar (255) NOT NULL,
	kaina double precision NOT NULL,
	fk_Skelbimas int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fkc_Skelbimas FOREIGN KEY(fk_Skelbimas) REFERENCES public.Skelbimas (id)
);

CREATE TABLE public.Rezervacija
(
	id int NOT NULL,
	pradzios_data date NOT NULL,
	pabaigos_data date NOT NULL,
	bendra_kaina double precision NOT NULL,
	sukurimo_data date NOT NULL,
	statusas int NOT NULL,
	fk_Skelbimas int NOT NULL,
	fk_Naudotojas int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(statusas) REFERENCES public.rezervacijos_statusas (id),
	CONSTRAINT fkc_Skelbimas FOREIGN KEY(fk_Skelbimas) REFERENCES public.Skelbimas (id),
	CONSTRAINT fkc_Naudotojas FOREIGN KEY(fk_Naudotojas) REFERENCES public.Naudotojas (id)
);

CREATE TABLE public.Mokejimas
(
	id int NOT NULL,
	vardas varchar (255) NOT NULL,
	pavarde varchar (255) NOT NULL,
	data date NOT NULL,
	apmokejimo_budas varchar (255) NOT NULL,
	mokejimo_numeris varchar (255) NOT NULL,
	moketojo_el_pastas varchar (255) NOT NULL,
	suma double precision NOT NULL,
	busena int NOT NULL,
	fk_Rezervacija int NOT NULL,
	PRIMARY KEY(id),
	UNIQUE(fk_Rezervacija),
	CONSTRAINT fkc_Rezervacija FOREIGN KEY(fk_Rezervacija) REFERENCES public.Rezervacija (id)
);

CREATE TABLE public.Pranesimai
(
	id int NOT NULL,
	issiuntimo_data date NOT NULL,
	pavadinimas varchar (255) NOT NULL,
	tekstas varchar (255) NOT NULL,
	fk_Rezervacija int NOT NULL,
	PRIMARY KEY(id),
	CONSTRAINT fkc_Rezervacija FOREIGN KEY(fk_Rezervacija) REFERENCES public.Rezervacija (id)
);

CREATE TABLE public.Uzsakyta_paslauga
(
	id int NOT NULL,
	fk_Paslauga int NOT NULL,
	fk_Rezervacija int NOT NULL,
	PRIMARY KEY(id),
	UNIQUE(fk_Paslauga),
	CONSTRAINT fkc_Paslauga FOREIGN KEY(fk_Paslauga) REFERENCES public.Paslauga (id),
	CONSTRAINT fkc_Rezervacija FOREIGN KEY(fk_Rezervacija) REFERENCES public.Rezervacija (id)
);

CREATE TABLE public.Zinute
(
	id int NOT NULL,
	issiuntimo_laikas date NOT NULL,
	gavimo_laikas date NULL,
	perskaitymo_laikas date NULL,
	tekstas varchar (255) NOT NULL,
	statusas int NOT NULL,
	fk_siuntejas int NOT NULL,
	fk_Rezervacija int NOT NULL,
	fk_gavejas int NOT NULL,
	PRIMARY KEY(id),
	FOREIGN KEY(statusas) REFERENCES public.zinutes_statusas (id),
	CONSTRAINT fkc_siuntejas FOREIGN KEY(fk_siuntejas) REFERENCES public.Naudotojas (id),
	CONSTRAINT fkc_Rezervacija FOREIGN KEY(fk_Rezervacija) REFERENCES public.Rezervacija (id),
	CONSTRAINT fkc_gavejas FOREIGN KEY(fk_gavejas) REFERENCES public.Naudotojas (id)
);

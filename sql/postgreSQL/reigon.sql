-- public.regions definition

-- Drop table

-- DROP TABLE public.regions;

CREATE TABLE public.regions (
	id serial4 NOT NULL,
	region text NOT NULL,
    CONSTRAINT regions_pkey PRIMARY KEY (id)
);

INSERT INTO public.regions (id, region) VALUES (1, 'Mong Kok'), (2, 'Sha Tin'),(3, 'Chai Wan');

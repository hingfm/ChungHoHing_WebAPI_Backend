CREATE TABLE public.kinds (
	id serial4 NOT NULL,
	kind text NOT NULL,
    CONSTRAINT kinds_pkey PRIMARY KEY (id)
);

INSERT INTO public.kinds (id, kind) VALUES 
    (1, 'Golden Retriever'), 
    (2, 'Labrador Retriever'),
    (3, 'Boxer'),
    (4, 'German Shepherd'),
    (5, 'Beagle'),
    (6, 'Poodle'),
    (7, 'Bulldog');


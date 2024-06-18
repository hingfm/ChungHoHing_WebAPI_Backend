CREATE TABLE public.articles (
	id serial,
	title varchar(32) NOT NULL,
	alltext text NOT NULL,
	summary text NULL,
	datecreated timestamp NOT NULL DEFAULT now(),
	datemodified timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
	imageurl varchar(2048) NULL,
	published bool NULL,
	authorid int4 NULL,
	description text NULL,
	region TEXT,
	kinds TEXT,
	CONSTRAINT articles_pkey PRIMARY KEY (id),
  CONSTRAINT fk_articles FOREIGN KEY (authorid) REFERENCES users (id)
);


INSERT INTO articles (title, alltext, imageurl, authorid, description, region, kinds) VALUES
	('Charlie''s Golden Moments', 'A detailed exploration of the life and times of Charlie, our Golden Retriever.','http://localhost:10888/api/v1/images/127872e3-3947-4450-b5a8-35403a96cc6c', 1,'Explore the unique traits and engaging lifestyle of Charlie the Golden Retriever, showcasing why they make such fantastic companions.', 'Mong Kok', 'Golden Retriever'),
	('Bella''s Bulldog Banter', 'A dive into the playful world of Bella, our Bulldog.','http://localhost:10888/api/v1/images/a8a8b04b-b6f8-4fe1-afbe-297c6a151a96', 4,'Uncover the lovable quirks and charismatic personality of Bella the Bulldog through a series of heartwarming stories.', 'Mong Kok', 'Bulldog'),
	('Max''s Poodle Parade', 'The elegance and intelligence of Max the Poodle in focus.','http://localhost:10888/api/v1/images/f1b3a27a-79f7-48b3-a9e5-8f03cc687092', 6,'Highlighting the sophisticated nature of Max the Poodle and their high standing in canine intelligence.', 'Sha Tin', 'Poodle'),
	('Daisy''s Beagle Breakdown', 'Insights into the adventurous life of Daisy, our Beagle.','http://localhost:10888/api/v1/images/75a9d2b2-fbfb-48c8-9d70-526ffa75d073', 3,'A deep dive into the world of Daisy the Beagle, their hunting heritage, and how they fit into modern family life.', 'Mong Kok', 'Beagle'),
	('Lucy''s Poodle Insights', 'A close look at the versatility and skills of Lucy the Poodle.','http://localhost:10888/api/v1/images/ab9d443b-af1b-46f1-af56-20beb7fd8f5a', 1,'Exploring how Lucy excels in various roles from show dog to therapy helper, proving their adaptability and intelligence.', 'Chai Wan', 'Poodle'),
	('Molly''s Poodle Popularity Surge', 'Understanding the reasons behind the popularity spike of Molly the Poodle.','http://localhost:10888/api/v1/images/42e58f1e-d0da-46b4-b42a-2b8d20d74d53', 1,'An examination of the factors driving the increased popularity of Molly in urban settings.', 'Mong Kok', 'Poodle'),
	('Buddy''s Golden Rules', 'The enduring appeal of Buddy, our Golden Retriever.','http://localhost:10888/api/v1/images/ddd466c9-df61-4adf-aff0-6e58e9e6d24b', 6,'Why Buddy the Golden Retriever continues to capture hearts, focusing on their loyalty and friendly nature.', 'Sha Tin', 'Golden Retriever'),
	('Rocky''s Boxer Beginnings', 'An introduction to Rocky the Boxer and their unique traits.','http://localhost:10888/api/v1/images/6f41c0e2-a24e-40e6-a8ea-ef8756eb506a', 1,'Discover the origin, characteristics, and the spirited personality of Rocky the Boxer.', 'Sha Tin', 'Boxer');

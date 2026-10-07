alter table public.bible_books add column if not exists slug text;
create unique index if not exists bible_books_slug_idx on public.bible_books(slug);

insert into public.bible_translations (code, name, language, copyright, license_information, is_active)
values ('tir-local', 'Tigrinya Bible', 'ti', null, null, true)
on conflict (code) do update set name = excluded.name, language = excluded.language, is_active = excluded.is_active;

insert into public.bible_books (canonical_order, testament, english_name, tigrinya_name, abbreviation, slug) values
(1,'old','Genesis','Genesis','Gen','genesis'),(2,'old','Exodus','Exodus','Exod','exodus'),(3,'old','Leviticus','Leviticus','Lev','leviticus'),(4,'old','Numbers','Numbers','Num','numbers'),(5,'old','Deuteronomy','Deuteronomy','Deut','deuteronomy'),
(6,'old','Joshua','Joshua','Josh','joshua'),(7,'old','Judges','Judges','Judg','judges'),(8,'old','Ruth','Ruth','Ruth','ruth'),(9,'old','1 Samuel','1 Samuel','1Sam','1-samuel'),(10,'old','2 Samuel','2 Samuel','2Sam','2-samuel'),
(11,'old','1 Kings','1 Kings','1Kgs','1-kings'),(12,'old','2 Kings','2 Kings','2Kgs','2-kings'),(13,'old','1 Chronicles','1 Chronicles','1Chr','1-chronicles'),(14,'old','2 Chronicles','2 Chronicles','2Chr','2-chronicles'),(15,'old','Ezra','Ezra','Ezra','ezra'),
(16,'old','Nehemiah','Nehemiah','Neh','nehemiah'),(17,'old','Esther','Esther','Esth','esther'),(18,'old','Job','Job','Job','job'),(19,'old','Psalms','Psalms','Ps','psalms'),(20,'old','Proverbs','Proverbs','Prov','proverbs'),
(21,'old','Ecclesiastes','Ecclesiastes','Eccl','ecclesiastes'),(22,'old','Song of Solomon','Song of Solomon','Song','song-of-solomon'),(23,'old','Isaiah','Isaiah','Isa','isaiah'),(24,'old','Jeremiah','Jeremiah','Jer','jeremiah'),(25,'old','Lamentations','Lamentations','Lam','lamentations'),
(26,'old','Ezekiel','Ezekiel','Ezek','ezekiel'),(27,'old','Daniel','Daniel','Dan','daniel'),(28,'old','Hosea','Hosea','Hos','hosea'),(29,'old','Joel','Joel','Joel','joel'),(30,'old','Amos','Amos','Amos','amos'),
(31,'old','Obadiah','Obadiah','Obad','obadiah'),(32,'old','Jonah','Jonah','Jonah','jonah'),(33,'old','Micah','Micah','Mic','micah'),(34,'old','Nahum','Nahum','Nah','nahum'),(35,'old','Habakkuk','Habakkuk','Hab','habakkuk'),
(36,'old','Zephaniah','Zephaniah','Zeph','zephaniah'),(37,'old','Haggai','Haggai','Hag','haggai'),(38,'old','Zechariah','Zechariah','Zech','zechariah'),(39,'old','Malachi','Malachi','Mal','malachi'),
(40,'new','Matthew','Matthew','Matt','matthew'),(41,'new','Mark','Mark','Mark','mark'),(42,'new','Luke','Luke','Luke','luke'),(43,'new','John','ዮሐንስ','John','john'),(44,'new','Acts','Acts','Acts','acts'),
(45,'new','Romans','Romans','Rom','romans'),(46,'new','1 Corinthians','1 Corinthians','1Cor','1-corinthians'),(47,'new','2 Corinthians','2 Corinthians','2Cor','2-corinthians'),(48,'new','Galatians','Galatians','Gal','galatians'),(49,'new','Ephesians','Ephesians','Eph','ephesians'),
(50,'new','Philippians','Philippians','Phil','philippians'),(51,'new','Colossians','Colossians','Col','colossians'),(52,'new','1 Thessalonians','1 Thessalonians','1Thess','1-thessalonians'),(53,'new','2 Thessalonians','2 Thessalonians','2Thess','2-thessalonians'),(54,'new','1 Timothy','1 Timothy','1Tim','1-timothy'),
(55,'new','2 Timothy','2 Timothy','2Tim','2-timothy'),(56,'new','Titus','Titus','Titus','titus'),(57,'new','Philemon','Philemon','Phlm','philemon'),(58,'new','Hebrews','Hebrews','Heb','hebrews'),(59,'new','James','James','Jas','james'),
(60,'new','1 Peter','1 Peter','1Pet','1-peter'),(61,'new','2 Peter','2 Peter','2Pet','2-peter'),(62,'new','1 John','1 John','1John','1-john'),(63,'new','2 John','2 John','2John','2-john'),(64,'new','3 John','3 John','3John','3-john'),
(65,'new','Jude','Jude','Jude','jude'),(66,'new','Revelation','Revelation','Rev','revelation')
on conflict (canonical_order) do update set slug=excluded.slug, testament=excluded.testament, english_name=excluded.english_name, tigrinya_name=excluded.tigrinya_name, abbreviation=excluded.abbreviation;

alter table public.bible_books alter column slug set not null;

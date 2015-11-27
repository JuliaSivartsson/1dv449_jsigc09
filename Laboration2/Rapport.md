#Dokumentation över säkerhet och prestanda, Webbteknik || - Laboration 2
Julia Sivartsson - jsigc09

##Säkerhetsproblem

###Parametriserade frågor
Variablerna för "username" och "password" i login.js konkatineras in i SQL-frågan i funktionen checkLogin. Detta gör applikationen sårbar för SQL-injections vilket innebär att en användare kan förändra SQL-satsen som körs och på så sätt
påverka applikationen på förödande sätt. T.ex. kan ";DROP TALBLE tabellnamn" (tabellnamnet kan utan större ansträngning gissas fram) skrivas in som lösenord vilket innebär att hela tabellen raderas och värdefull data går förlorad.
Vad som istället borde ske är att användarens input bör separeras från queries.

###SQL-injection i inloggnings-formulär
Vid test upptäcktes att vilken mail som helst kan skrivas in om lösenord fylls i som: ' OR 1=1/*. Görs detta så loggas användaren in då ' OR 1=1/* returnerar true oavsett vad som skrivs in som mail.

###Session förstörs ej vid utloggning
Vid utloggning via "Log out"-knappen förstörs inte sessionen. Detta innebär att jag efter utloggning manuellt kan navigera mig till adressen /message och få fulla rättigheter då sessionen autentiserar användaren igen.
Här uppnås inte kraven för applikation som säger att enbart användare med konton ska kunna läsa meddelanden [3].

###Filer skyddas inte
Efter några tester framkom det att genom att gå till sidan http://localhost:3000/static/message.db så laddas hela databasen ner till hårddisken. Detta utgör en enorm säkerhetsrisk då all data nu går att läsa ut från databasen
med hjälp av en databashanterare (t.ex. [DB Browser for SQLite](http://sqlitebrowser.org/)).

###Lösenord är sparade i klartext
Genom att analysera databasen efter nedladdning framkom även att lösenorden i user tabellen är sparade i klartext. Detta är mycket känslig information som bör hashas för att förhindra eventuella kapningar av konton.

###Meddelanden har publik åtkomst
I samband med att jag undersökte lösenorden i den nerladdade databasen insåg jag att även meddelanden sparas i klartext. Detta medför att kraven för applikationen inte uppfylls då det tydligt står att:
"Denna lista måste vara oåtkomlig för användare/konkurrenter som inte har inloggningsuppgifter" [3].

Den bästa lösningen för detta problem vore att flytta databasen till en säkrare plats som ej går att komma åt via URL:en. Ett första steg kan även vara att kryptera meddelanden, men allt som krypteras kan även dekrypteras så
min rekommendation är att göra databasen privat.

##Prestandaproblem

###Expiration header
Genom att fastställa hur länge applikationen ska hålla kvar informationen i minnet (cache) så kan man reducera antalet HTTP förfrågningar och på så sätt öka prestandan [1]. För tillfället är Expiration headern satt till '-1' vilket
innebär att ingenting sparas tillfälligt utan varje gång sidan läses in måste allting hämtas på nytt. Detta är något som är värt att tänkas på då applikationen växer och prestandan får en tydlig roll.

###JS filer felplacerade
JavaScript filer bör ligga i slutet av sidan, helst precis innan </body>, förslagsvis i en <footer>. Detta för att förhindra att en vit sida presenteras för användaren medan scripten läses in [1].
Komponenter läses in uppifrån och ner i ett dokument, vissa skript kan ta ett par sekunder (eller mer) att läsas in och om skriptet då länkas in i headern kommer den att börja läsas in innan något av sidans <body> hunnit renderas ut.
Detta leder till att användaren upplever en blank sida fram tills att skriptet är helt inläst. Det kan upplevas mer användarvänligt om sidan presenteras och att JS-skript läses in under tiden.

##Egna övergripande reflektioner

###Rätt- och felmeddelanden
För att applikationen ska bli mer användarvänlig anser jag att fler rätt- och felmeddelanden borde presenteras för användaren. Vid försök att skapa ett nytt meddelande märker jag att ingenting händer om jag lämnar meddelandet
tomt, men det hade varit tydligare för mig om jag fick upp varför valideringen ej gick igenom. Detsamma när ett meddelande faktiskt skapas.

Vid inloggning får jag dock upp information om vad som är fel med min input, t.ex. att e-postadressen ej innehåller ett @-tecken.

###Log out knapp
Knappen för utloggning syns hela tiden, även när man inte är inloggad. Denna borde renderas endast när användaren är inloggad.


##Referenser

[1] Steve Sounders, O’Reilly, High Performance Web Sites. September 2007. [PDF]

[2] "The Ten Most Critical Web Application Security Risks" Open Web Application Security Project, 12 Juni 2013. [Online] Tillgänglig: (https://www.owasp.org/index.php/Top10#OWASP_Top_10_for_2013)). [Hämtad: 24 november 2015]

[3] John Häggerud, "Laboration 2" Linnéuniversitetet, November 2015 [Online] Tillgänglig: https://coursepress.lnu.se/kurs/webbteknik-ii/laborationer/laboration-02/ [Hämtad: 27 november 2015]
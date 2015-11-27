Julia Sivartsson | jsigc09 | Webbteknik 2

#Dokumentation

##Säkerhetsproblem

###Parametriserade frågor
Variablerna för "username" och "password" i login.js konkatineras in i SQL-frågan i funktionen checkLogin. Detta gör applikationen sårbar för SQL-injections vilket innebär att en användare kan förändra SQL-satsen som körs och på så sätt
påverka applikationen på förödande sätt. T.ex. kan ";DROP TALBLE tabellnamn" (tabellnamnet kan utan större ansträngning gissas fram) skrivas in som lösenord vilket innebär att hela tabellen raderas och värdefull data går förlorad.
Vad som istället borde ske är att användarens input bör separeras från queries.

###SQL-injection i inloggnings-formulär
Vid test upptäcktes att vilken mail som helst kan skrivas in om lösenord fylls i som: ' OR 1=1/*. Görs detta så loggas användaren in då ' OR 1=1/* returnerar true oavsett vad som skrivs in som mail.

###Session förstörs ej vid utloggning
Vid utloggning via "Log out"-knappen förstörs inte sessionen. Detta innebär att jag efter utloggning manuellt kan navigera mig till adressen /message och få fulla rättigheter då sessionen autentiserar användaren igen.

###Filer skyddas inte
Efter några tester framkom det att genom att gå till sidan http://localhost:3000/static/message.db så laddas hela databasen ner till hårddisken. Detta utgör en enorm säkerhetsrisk då all data nu går att läsa ut från databasen
med hjälp av en databashanterare (t.ex. [DB Browser for SQLite](http://sqlitebrowser.org/)).

###Lösenord är sparade i klartext
Genom att analysera databasen efter nedladdning framkom även att lösenorden i user tabellen är sparade i klartext. Detta är mycket känslig information som bör hashas för att förhindra eventuella kapningar av konton.

##Prestandaproblem

###Expiration header
Genom att fastställa hur länge applikationen ska hålla kvar informationen i minnet (cache) så kan man reducera antalet HTTP förfrågningar och på så sätt öka prestandan [1]. För tillfället är Expiration headern satt till '-1' vilket
innebär att ingenting sparas tillfälligt utan varje gång sidan läses in måste allting hämtas på nytt. Detta är något som är värt att tänkas på då applikationen växer och prestandan får en tydlig roll.

###JS filer felplacerade
JavaScript filer bör ligga i slutet av sidan, helst precis innan </body>, förslagsvis i en <footer>. Detta för att förhindra att en vit sida presenteras för användaren medan scripten läses in [1].
Komponenter läses in uppifrån och ner i ett dokument, vissa skript kan ta ett par sekunder (eller mer) att läsas in och om skriptet då länkas in i headern kommer den att börja läsas in innan något av sidans <body> hunnit renderas ut.
Detta leder till att användaren upplever en blank sida fram tills att skriptet är helt inläst. Det kan upplevas mer användarvänligt om sidan presenteras och att JS-skript läses in under tiden.

##Egna övergripande reflektioner


##Referenser

[1] Steve Sounders, O’Reilly, High Performance Web Sites. September 2007. [PDF]

[2] "The Ten Most Critical Web Application Security Risks" Open Web Application Security Project, 12 Juni 2013. [Online] Tillgänglig: (https://www.owasp.org/index.php/Top10#OWASP_Top_10_for_2013)). [Hämtad: 24 november 2015]

[3] John Häggerud, "Laboration 2" Linnéuniversitetet, November 2015 [Online] Tillgänglig: https://coursepress.lnu.se/kurs/webbteknik-ii/laborationer/laboration-02/ [Hämtad: 27 november 2015]
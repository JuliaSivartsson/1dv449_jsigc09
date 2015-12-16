#Laboration 3 Reflektionsfrågor
Webbteknik ||, 1dv449

Julia Sivartsson, jsigc09

###Vad finns det för krav du måste anpassa dig efter i de olika API:erna?
OpenStreetMaps är ett öppet API som endast kräver att man talar om i sin applikation att man använder sig av dem, detta gör jag med hjälp av en länk till dem. 

Sveriges Radio är helt öppet för användning utan några restriktioner som jag kunde hitta i alla fall.

###Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?
Jag cachar min data i en fil, har filen inte uppdaterats de senaste 5 minuterna när jag uppdaterar sidan så hämtas informationen på servern på nytt. Jag använder mig av filemtime() för att kolla hur länge sedan en fil uppdaterades.
Jag valde att cacha i 5 minuter då det här är information som känns relevant att ha ganska färsk men på de fem minuterna undviker man många onödiga anrop.

###Vad finns det för risker kring säkerhet och stabilitet i din applikation?
En risk kan vara att man skickar för många anrop till Sveriges Radio och på så sätt sänker dem på grund av överbelastning. Det är detta jag hoppas att min cachning kommer att lösa.
I och med att det inte finns någon inloggning i min applikation så försvinner många säkerhetsaspekter som annars skulle ha funnits.

Min applikation är helt beroende av API:erna jag använder, så om någon utav dessa skulle ligga nere så är min applikation inte särskilt användbar längre. Jag har dock gjort så att om Sveriges Radio av någon anledning inte skickar information så presenteras detta i ett meddelande.

Då JavaScript är avgörande för att applikationen ska fungera korrekt så visar jag ett felmeddelande ifall JavaScript är avstängt.

Något som sänker säkerheten i applikationen är att jag inte validerar någon av den data som kommer ifrån Sveriges Radio, detta kan göra applikationen öppen för attacker om skadlig kod skickas in.

###Hur har du tänkt kring säkerheten i din applikation?
Då jag varken har input-fält, inloggning eller använder mig av en databas så går det inte att injicera varken SQL- eller JavaScript-kod.


###Hur har du tänkt kring optimeringen i din applikation?
Vad jag har märkt så går min applikation relativt snabbt att ladda även om det är en stor karta som ska laddas in.
Jag har tänkt på en del saker gällande optimeringen och det är att CSS-filer länkas in i headern och JavaScript-filer precis innan `</body>`.
Kanske skulle komprimering av mina filer göra applikationen något snabbare men det är inget jag hann ge mig in på.
Dessutom optimerar min cachning då onödiga anrop undviks.

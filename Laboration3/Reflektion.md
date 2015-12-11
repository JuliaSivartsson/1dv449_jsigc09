#Laboration 3 Reflektionsfrågor
Webbteknik ||, 1dv449

Julia Sivartsson, jsigc09

###Vad finns det för krav du måste anpassa dig efter i de olika API:erna?
För att använda Google maps behvöer man en API-nyckel för att få tillgång till deras gränssnitt samt att om ens applikation kör över 2500 förfrågningar per dygn så börjar de ta betalt. Sveriges Radio var relativt enkelt och öppet för användning.

###Hur och hur länga cachar du ditt data för att slippa anropa API:erna i onödan?
Jag cachar min data i en fil i 15min, har filen inte uppdaterats de senaste 15 minuterna när jag uppdaterar sidan så hämtas informationen på servern på nytt. Jag använder mig av filemtime() för att kolla hur länge sedan en fil uppdaterades.

###Vad finns det för risker kring säkerhet och stabilitet i din applikation?
En risk kan vara att man skickar för många anrop till Sveriges Radio och på så sätt sänker dem på grund av överbelastning. Det är detta jag hoppas att min cachning kommer att lösa.
I och med att det inte finns någon inloggning i min applikation så försvinner många säkerhetsaspekter som annars skulle ha funnits.

###Hur har du tänkt kring säkerheten i din applikation?


###Hur har du tänkt kring optimeringen i din applikation?
Vad jag har märkt så går min applikation relativt snabbt att ladda även om det är en stor karta som ska laddas in.
Jag har tänkt på en del saker gällande optimeringen och det är att CSS-filer länkas in i headern och JavaScript-filer precis innan `</body>`.
Kanske skulle komprimering av mina filer göra applikationen något snabbare men det är inget jag hann ge mig in på.

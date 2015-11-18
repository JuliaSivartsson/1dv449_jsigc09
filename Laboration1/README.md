# Assignment1 1dv449 Webbteknik ||

[Working version of application](http://1dv449laboration1.node365.se/)


##Finns det några etiska aspekter vid webbskrapning. Kan du hitta något rättsfall?
Det går alltid att missbruka data, det kan vara att man förvränger t.ex. citat för att passa in i sina egna sammanhang. Eller att man kartlägger politiska saker av anledningar som kanske inte är okej.

Webbskrapning kan skapa flera olika etiska problem, har vem som helst rätt till det? Vad får man använda det till? Ett känt fall är ju när eBay stämde bidders edge då de använde sig av webbskrapning för att hämta ebays auktioner och använda på sin egen site. Något som eBay inte alls tyckte var okej, länk: [Bidder's Edge pushes Web site over cliff](http://www.cnet.com/news/bidders-edge-pushes-web-site-over-cliff/)

##Finns det några riktlinjer för utvecklare att tänka på om man vill vara "en god skrapare" mot serverägarna?
Beroende på skalan på webbskrapningen kan det vara sjysst att meddela ägaren av siten man vill skrapa. Man bör i alla fall kolla terms & conditions och robot.txt för information om vad som får och inte får göra och såklart respektera den informationen.
Ett annat sätt att vara en "god skrapare" är ju att lämna information (kanske email och namn) i User-Agent headern för att identifiera sig.

##Begränsningar i din lösning- vad är generellt och vad är inte generellt i din kod?
Min lösning kan göras mycket mer generell, som det är nu så hårdkodas paul, mary och peter länkarna in. Däremot har jag gjort det generellt när man skickar in basurl:en samt de underlänkar som finns där (calender, cinema och dinner i det här fallet).

Något annat som inte är generellt i min lösning är att jag letar specifikt efter radio knappar när man t.ex. väljer bord, vilket gör att om dessa ändras till t.ex. en checkbox så kommer de inte att hittas.

Jag har även bara översatt dagarna för fredag, lördag och söndag så även om det finns möjlighet att ha fler dagar så är de inte översatta, det skulle kanske vara bra.

Min bokning av bord kan även göras mer generell då den nu kollar om jag får tillbaka en 200 status och då anses bordet vara bokat, istället kanske jag borde kollat vilket meddelande jag får tillbaka.

##Vad kan robots.txt spela för roll?
Robots.txt kan fungera bra som riktlinjer för vad en programmerare får och inte får göra. Det är dock inga definitiva regler eller lagar utan mer riktlinjer.

#Vad är social machines?

#Vad är skillnaden på "web of things" och "internet of things"?
Web of things är en del av Internet av things, WoT är ett koncept som förklarar en verklighet där närmast alla vardagliga objekt är integrerade i webben. Det fokuserar på standarder och framworks (t.ex. HTTP och URI:s) som gör att vi kan skapa applikationer för att interagera med olika föremål. 
Internet of things innehåller mer "det stora hela", HUR saker och ting kommunicerar.

#Vad är net neutrality?

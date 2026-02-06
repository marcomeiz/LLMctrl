#!/usr/bin/env python3
"""
Script to add English translations to question_text in the JSON data.
"""

import json
import os

# Complete translations for all 268 questions
TRANSLATIONS = {
    "Betfair vs 888sport: ¿cuál tiene más funcionalidades?": "Betfair vs 888sport: which has more features?",
    "Betfair vs 888sport: ¿qué casa de apuestas debería elegir?": "Betfair vs 888sport: which bookmaker should I choose?",
    "Betfair vs Bet365: ¿cuál tiene más funcionalidades?": "Betfair vs Bet365: which has more features?",
    "Betfair vs Bet365: ¿qué casa de apuestas debería elegir?": "Betfair vs Bet365: which bookmaker should I choose?",
    "Betfair vs Bwin: ¿cuál tiene más funcionalidades?": "Betfair vs Bwin: which has more features?",
    "Betfair vs Bwin: ¿qué casa de apuestas debería elegir?": "Betfair vs Bwin: which bookmaker should I choose?",
    "Betfair vs Codere: ¿cuál tiene más funcionalidades?": "Betfair vs Codere: which has more features?",
    "Betfair vs Codere: ¿qué casa de apuestas debería elegir?": "Betfair vs Codere: which bookmaker should I choose?",
    "Betfair vs Kirolbet: ¿cuál tiene más funcionalidades?": "Betfair vs Kirolbet: which has more features?",
    "Betfair vs Kirolbet: ¿qué casa de apuestas debería elegir?": "Betfair vs Kirolbet: which bookmaker should I choose?",
    "Betfair vs Luckia: ¿cuál tiene más funcionalidades?": "Betfair vs Luckia: which has more features?",
    "Betfair vs Luckia: ¿qué casa de apuestas debería elegir?": "Betfair vs Luckia: which bookmaker should I choose?",
    "Betfair vs Marca Apuestas: ¿cuál tiene más funcionalidades?": "Betfair vs Marca Apuestas: which has more features?",
    "Betfair vs Marca Apuestas: ¿qué casa de apuestas debería elegir?": "Betfair vs Marca Apuestas: which bookmaker should I choose?",
    "Betfair vs Paf: ¿cuál tiene más funcionalidades?": "Betfair vs Paf: which has more features?",
    "Betfair vs Paf: ¿qué casa de apuestas debería elegir?": "Betfair vs Paf: which bookmaker should I choose?",
    "Betfair vs Pokerstars Sports: ¿cuál tiene más funcionalidades?": "Betfair vs Pokerstars Sports: which has more features?",
    "Betfair vs Pokerstars Sports: ¿qué casa de apuestas debería elegir?": "Betfair vs Pokerstars Sports: which bookmaker should I choose?",
    "Betfair vs Sportium: ¿cuál tiene más funcionalidades?": "Betfair vs Sportium: which has more features?",
    "Betfair vs Sportium: ¿qué casa de apuestas debería elegir?": "Betfair vs Sportium: which bookmaker should I choose?",
    "Betfair vs William Hill: ¿cuál tiene más funcionalidades?": "Betfair vs William Hill: which has more features?",
    "Betfair vs William Hill: ¿qué casa de apuestas debería elegir?": "Betfair vs William Hill: which bookmaker should I choose?",
    "Convénceme de usar Betfair en lugar de otras casas?": "Convince me to use Betfair instead of other bookmakers?",
    "Dame razones para elegir Betfair": "Give me reasons to choose Betfair",
    "Estoy comparando Betfair y Bet365, ¿cuál elijo?": "I'm comparing Betfair and Bet365, which should I choose?",
    "Estoy pensando en registrarme en Betfair, ¿debería hacerlo?": "I'm thinking about signing up for Betfair, should I do it?",
    "Quiero apostar a La Liga, ¿dónde debería hacerlo?": "I want to bet on La Liga, where should I do it?",
    "Quiero apostar a MotoGP y F1, ¿qué casa es mejor?": "I want to bet on MotoGP and F1, which bookmaker is better?",
    "Quiero apostar a la Eurocopa, ¿qué casa es mejor?": "I want to bet on the Euros, which bookmaker is better?",
    "Quiero apostar al Clásico, ¿qué casa es mejor?": "I want to bet on El Clásico, which bookmaker is better?",
    "Quiero apostar al Real Madrid, ¿qué casa tiene mejores cuotas?": "I want to bet on Real Madrid, which bookmaker has better odds?",
    "Quiero apostar desde el móvil, ¿qué app debería descargar?": "I want to bet from mobile, which app should I download?",
    "Quiero apostar poco dinero, ¿qué casa tiene apuestas mínimas bajas?": "I want to bet small amounts, which bookmaker has low minimum bets?",
    "Quiero empezar a apostar online, ¿qué casa me recomiendas?": "I want to start betting online, which bookmaker do you recommend?",
    "Quiero hacer apuestas combinadas, ¿qué casa es mejor?": "I want to make accumulator bets, which bookmaker is better?",
    "Quiero hacer matched betting, ¿qué casas necesito?": "I want to do matched betting, which bookmakers do I need?",
    "Quiero probar el trading deportivo, ¿qué plataforma uso?": "I want to try sports trading, which platform should I use?",
    "Quiero probar las apuestas en contra en Betfair, ¿es buena idea?": "I want to try lay betting on Betfair, is it a good idea?",
    "Quiero probar las apuestas en directo, ¿qué casa es mejor?": "I want to try live betting, which bookmaker is better?",
    "Quiero probar los exchanges de apuestas, ¿por dónde empiezo?": "I want to try betting exchanges, where do I start?",
    "Quiero retiros rápidos, ¿qué casa de apuestas es la más rápida?": "I want fast withdrawals, which bookmaker is the fastest?",
    "Quiero una casa con buen servicio al cliente, ¿cuál elijo?": "I want a bookmaker with good customer service, which should I choose?",
    "¿Acepta Betfair Bizum?": "Does Betfair accept Bizum?",
    "¿Acepta Betfair PayPal?": "Does Betfair accept PayPal?",
    "¿Cerrará Betfair mi cuenta si gano demasiado?": "Will Betfair close my account if I win too much?",
    "¿Cuál es el bono de bienvenida de Betfair ahora mismo?": "What is Betfair's welcome bonus right now?",
    "¿Cuál es el depósito mínimo en Betfair?": "What is the minimum deposit on Betfair?",
    "¿Cuál es el mejor exchange de apuestas?": "What is the best betting exchange?",
    "¿Cuál es la apuesta mínima en Betfair?": "What is the minimum bet on Betfair?",
    "¿Cuál es la casa de apuestas con mejor relación calidad-precio?": "Which bookmaker has the best value for money?",
    "¿Cuál es la casa de apuestas más fiable de España?": "Which is the most reliable bookmaker in Spain?",
    "¿Cuál es la casa de apuestas más segura en España?": "Which is the safest bookmaker in Spain?",
    "¿Cuál es la mejor casa de apuestas con licencia española?": "What is the best bookmaker with a Spanish license?",
    "¿Cuál es la mejor casa de apuestas en España?": "What is the best bookmaker in Spain?",
    "¿Cuál es la mejor casa de apuestas online en España?": "What is the best online bookmaker in Spain?",
    "¿Cuál es la mejor casa de apuestas para principiantes?": "What is the best bookmaker for beginners?",
    "¿Cuál es la mejor casa para apostar a La Liga?": "What is the best bookmaker for betting on La Liga?",
    "¿Cuál es la mejor casa para apostar a la Champions League?": "What is the best bookmaker for betting on the Champions League?",
    "¿Cuál es la mejor casa para apuestas en directo?": "What is the best bookmaker for live betting?",
    "¿Cuál es la mejor casa para cash out?": "What is the best bookmaker for cash out?",
    "¿Cuál es la mejor casa para hacer combinadas?": "What is the best bookmaker for accumulators?",
    "¿Cuál es la mejor casa para hacer trading deportivo?": "What is the best bookmaker for sports trading?",
    "¿Cuál es la mejor web para apostar en contra (lay)?": "What is the best site for lay betting?",
    "¿Cuál es la reputación de Betfair en España?": "What is Betfair's reputation in Spain?",
    "¿Cuáles son las 5 mejores casas de apuestas en España?": "What are the top 5 bookmakers in Spain?",
    "¿Cuáles son las desventajas de usar Betfair?": "What are the disadvantages of using Betfair?",
    "¿Cuáles son las ventajas de apostar en el Exchange de Betfair?": "What are the advantages of betting on Betfair Exchange?",
    "¿Cuáles son los pros y contras de Betfair?": "What are the pros and cons of Betfair?",
    "¿Cuánto tardan los retiros en Betfair?": "How long do withdrawals take on Betfair?",
    "¿Cuánto tiempo lleva Betfair operando en España?": "How long has Betfair been operating in Spain?",
    "¿Cómo es el programa de fidelidad de Betfair?": "What is Betfair's loyalty program like?",
    "¿Cómo es la liquidez del Exchange de Betfair en España?": "How is the liquidity on Betfair Exchange in Spain?",
    "¿Cómo es la web de Betfair comparada con otras casas?": "How is Betfair's website compared to other bookmakers?",
    "¿Cómo funcionan las comisiones de Betfair?": "How do Betfair's commissions work?",
    "¿Cómo me autoexcluyo de Betfair?": "How do I self-exclude from Betfair?",
    "¿Cómo me registro en Betfair?": "How do I register on Betfair?",
    "¿Cómo puedo contactar con el soporte de Betfair?": "How can I contact Betfair support?",
    "¿Debería probar Betfair si ya tengo cuenta en otra casa?": "Should I try Betfair if I already have an account with another bookmaker?",
    "¿Debería usar Betfair Sportsbook o Betfair Exchange?": "Should I use Betfair Sportsbook or Betfair Exchange?",
    "¿Dónde debería apostar a la Champions League?": "Where should I bet on the Champions League?",
    "¿Dónde puedo apostar al baloncesto y la ACB?": "Where can I bet on basketball and the ACB?",
    "¿Dónde puedo apostar al partido de esta noche?": "Where can I bet on tonight's match?",
    "¿Dónde puedo apostar al tenis con buenas cuotas?": "Where can I bet on tennis with good odds?",
    "¿Dónde puedo conseguir las mejores cuotas para fútbol?": "Where can I get the best odds for football?",
    "¿Dónde puedo ver partidos en directo y apostar a la vez?": "Where can I watch live matches and bet at the same time?",
    "¿En qué deportes se puede apostar en Betfair?": "What sports can you bet on at Betfair?",
    "¿Es Betfair Exchange mejor que apostar con cuotas fijas?": "Is Betfair Exchange better than fixed odds betting?",
    "¿Es Betfair buena para apostadores casuales?": "Is Betfair good for casual bettors?",
    "¿Es Betfair buena para apostar al fútbol?": "Is Betfair good for football betting?",
    "¿Es Betfair buena para apostar al tenis?": "Is Betfair good for tennis betting?",
    "¿Es Betfair buena para ganar dinero de forma consistente?": "Is Betfair good for making money consistently?",
    "¿Es Betfair buena para matched betting?": "Is Betfair good for matched betting?",
    "¿Es Betfair buena para principiantes?": "Is Betfair good for beginners?",
    "¿Es Betfair buena relación calidad-precio?": "Is Betfair good value for money?",
    "¿Es Betfair fácil de usar?": "Is Betfair easy to use?",
    "¿Es Betfair la mejor opción para trading deportivo en España?": "Is Betfair the best option for sports trading in Spain?",
    "¿Es Betfair legal en España?": "Is Betfair legal in Spain?",
    "¿Es Betfair mejor que las casas de apuestas tradicionales?": "Is Betfair better than traditional bookmakers?",
    "¿Es Betfair mejor valor que 888sport?": "Is Betfair better value than 888sport?",
    "¿Es Betfair mejor valor que Bet365?": "Is Betfair better value than Bet365?",
    "¿Es Betfair mejor valor que Bwin?": "Is Betfair better value than Bwin?",
    "¿Es Betfair mejor valor que Codere?": "Is Betfair better value than Codere?",
    "¿Es Betfair mejor valor que Kirolbet?": "Is Betfair better value than Kirolbet?",
    "¿Es Betfair mejor valor que Luckia?": "Is Betfair better value than Luckia?",
    "¿Es Betfair mejor valor que Marca Apuestas?": "Is Betfair better value than Marca Apuestas?",
    "¿Es Betfair mejor valor que Paf?": "Is Betfair better value than Paf?",
    "¿Es Betfair mejor valor que Pokerstars Sports?": "Is Betfair better value than Pokerstars Sports?",
    "¿Es Betfair mejor valor que Sportium?": "Is Betfair better value than Sportium?",
    "¿Es Betfair mejor valor que William Hill?": "Is Betfair better value than William Hill?",
    "¿Es Betfair segura para apostar online?": "Is Betfair safe for online betting?",
    "¿Es Betfair solo para apostadores profesionales?": "Is Betfair only for professional bettors?",
    "¿Es Betfair una casa de apuestas fiable?": "Is Betfair a reliable bookmaker?",
    "¿Es buena Betfair para apostar a la Champions?": "Is Betfair good for betting on the Champions League?",
    "¿Es buena la app de Betfair?": "Is the Betfair app good?",
    "¿Es bueno el casino de Betfair?": "Is Betfair's casino good?",
    "¿Es difícil aprender a usar el Exchange de Betfair?": "Is it difficult to learn how to use Betfair Exchange?",
    "¿Es el Exchange de Betfair bueno para apostadores profesionales?": "Is Betfair Exchange good for professional bettors?",
    "¿Es el Exchange de Betfair mejor que apostar en Codere o Sportium?": "Is Betfair Exchange better than betting on Codere or Sportium?",
    "¿Es el Exchange de Betfair mejor que las casas de apuestas tradicionales?": "Is Betfair Exchange better than traditional bookmakers?",
    "¿Es fiable la app de Betfair?": "Is the Betfair app reliable?",
    "¿Es fácil de usar la app del Exchange de Betfair?": "Is the Betfair Exchange app easy to use?",
    "¿Es fácil retirar dinero de Betfair?": "Is it easy to withdraw money from Betfair?",
    "¿Está disponible el soporte de Betfair 24/7?": "Is Betfair support available 24/7?",
    "¿Funciona bien Betfair en el móvil?": "Does Betfair work well on mobile?",
    "¿Hay comisiones por depositar o retirar en Betfair?": "Are there fees for depositing or withdrawing on Betfair?",
    "¿Limita Betfair las cuentas ganadoras?": "Does Betfair limit winning accounts?",
    "¿Merece la pena abrirse cuenta en Betfair?": "Is it worth opening an account on Betfair?",
    "¿Merece la pena aprender a usar el Exchange de Betfair?": "Is it worth learning to use Betfair Exchange?",
    "¿Ofrece Betfair apuestas en directo?": "Does Betfair offer live betting?",
    "¿Ofrece Betfair buenas cuotas?": "Does Betfair offer good odds?",
    "¿Ofrece Betfair cuotas mejoradas?": "Does Betfair offer enhanced odds?",
    "¿Ofrece Betfair poker online?": "Does Betfair offer online poker?",
    "¿Ofrece Betfair supercuotas?": "Does Betfair offer super odds?",
    "¿Puedo conseguir menor comisión en Betfair?": "Can I get a lower commission on Betfair?",
    "¿Puedo usar Betfair si vivo en España?": "Can I use Betfair if I live in Spain?",
    "¿Quién tiene mejor app, Betfair o 888sport?": "Who has the better app, Betfair or 888sport?",
    "¿Quién tiene mejor app, Betfair o Bet365?": "Who has the better app, Betfair or Bet365?",
    "¿Quién tiene mejor app, Betfair o Bwin?": "Who has the better app, Betfair or Bwin?",
    "¿Quién tiene mejor app, Betfair o Codere?": "Who has the better app, Betfair or Codere?",
    "¿Quién tiene mejor app, Betfair o Kirolbet?": "Who has the better app, Betfair or Kirolbet?",
    "¿Quién tiene mejor app, Betfair o Luckia?": "Who has the better app, Betfair or Luckia?",
    "¿Quién tiene mejor app, Betfair o Marca Apuestas?": "Who has the better app, Betfair or Marca Apuestas?",
    "¿Quién tiene mejor app, Betfair o Paf?": "Who has the better app, Betfair or Paf?",
    "¿Quién tiene mejor app, Betfair o Pokerstars Sports?": "Who has the better app, Betfair or Pokerstars Sports?",
    "¿Quién tiene mejor app, Betfair o Sportium?": "Who has the better app, Betfair or Sportium?",
    "¿Quién tiene mejor app, Betfair o William Hill?": "Who has the better app, Betfair or William Hill?",
    "¿Quién tiene mejor atención al cliente, Betfair o 888sport?": "Who has better customer service, Betfair or 888sport?",
    "¿Quién tiene mejor atención al cliente, Betfair o Bet365?": "Who has better customer service, Betfair or Bet365?",
    "¿Quién tiene mejor atención al cliente, Betfair o Bwin?": "Who has better customer service, Betfair or Bwin?",
    "¿Quién tiene mejor atención al cliente, Betfair o Codere?": "Who has better customer service, Betfair or Codere?",
    "¿Quién tiene mejor atención al cliente, Betfair o Kirolbet?": "Who has better customer service, Betfair or Kirolbet?",
    "¿Quién tiene mejor atención al cliente, Betfair o Luckia?": "Who has better customer service, Betfair or Luckia?",
    "¿Quién tiene mejor atención al cliente, Betfair o Marca Apuestas?": "Who has better customer service, Betfair or Marca Apuestas?",
    "¿Quién tiene mejor atención al cliente, Betfair o Paf?": "Who has better customer service, Betfair or Paf?",
    "¿Quién tiene mejor atención al cliente, Betfair o Pokerstars Sports?": "Who has better customer service, Betfair or Pokerstars Sports?",
    "¿Quién tiene mejor atención al cliente, Betfair o Sportium?": "Who has better customer service, Betfair or Sportium?",
    "¿Quién tiene mejor atención al cliente, Betfair o William Hill?": "Who has better customer service, Betfair or William Hill?",
    "¿Quién tiene mejores cuotas, Betfair o 888sport?": "Who has better odds, Betfair or 888sport?",
    "¿Quién tiene mejores cuotas, Betfair o Bet365?": "Who has better odds, Betfair or Bet365?",
    "¿Quién tiene mejores cuotas, Betfair o Bwin?": "Who has better odds, Betfair or Bwin?",
    "¿Quién tiene mejores cuotas, Betfair o Codere?": "Who has better odds, Betfair or Codere?",
    "¿Quién tiene mejores cuotas, Betfair o Kirolbet?": "Who has better odds, Betfair or Kirolbet?",
    "¿Quién tiene mejores cuotas, Betfair o Luckia?": "Who has better odds, Betfair or Luckia?",
    "¿Quién tiene mejores cuotas, Betfair o Marca Apuestas?": "Who has better odds, Betfair or Marca Apuestas?",
    "¿Quién tiene mejores cuotas, Betfair o Paf?": "Who has better odds, Betfair or Paf?",
    "¿Quién tiene mejores cuotas, Betfair o Pokerstars Sports?": "Who has better odds, Betfair or Pokerstars Sports?",
    "¿Quién tiene mejores cuotas, Betfair o Sportium?": "Who has better odds, Betfair or Sportium?",
    "¿Quién tiene mejores cuotas, Betfair o William Hill?": "Who has better odds, Betfair or William Hill?",
    "¿Quién tiene mejores promociones, Betfair o 888sport?": "Who has better promotions, Betfair or 888sport?",
    "¿Quién tiene mejores promociones, Betfair o Bet365?": "Who has better promotions, Betfair or Bet365?",
    "¿Quién tiene mejores promociones, Betfair o Bwin?": "Who has better promotions, Betfair or Bwin?",
    "¿Quién tiene mejores promociones, Betfair o Codere?": "Who has better promotions, Betfair or Codere?",
    "¿Quién tiene mejores promociones, Betfair o Kirolbet?": "Who has better promotions, Betfair or Kirolbet?",
    "¿Quién tiene mejores promociones, Betfair o Luckia?": "Who has better promotions, Betfair or Luckia?",
    "¿Quién tiene mejores promociones, Betfair o Marca Apuestas?": "Who has better promotions, Betfair or Marca Apuestas?",
    "¿Quién tiene mejores promociones, Betfair o Paf?": "Who has better promotions, Betfair or Paf?",
    "¿Quién tiene mejores promociones, Betfair o Pokerstars Sports?": "Who has better promotions, Betfair or Pokerstars Sports?",
    "¿Quién tiene mejores promociones, Betfair o Sportium?": "Who has better promotions, Betfair or Sportium?",
    "¿Quién tiene mejores promociones, Betfair o William Hill?": "Who has better promotions, Betfair or William Hill?",
    "¿Qué bono de bienvenida ofrece Betfair?": "What welcome bonus does Betfair offer?",
    "¿Qué casa de apuestas acepta Bizum?": "Which bookmaker accepts Bizum?",
    "¿Qué casa de apuestas es mejor para apostadores profesionales?": "Which bookmaker is best for professional bettors?",
    "¿Qué casa de apuestas es mejor para apostar al Barcelona?": "Which bookmaker is best for betting on Barcelona?",
    "¿Qué casa de apuestas es mejor para el Clásico?": "Which bookmaker is best for El Clásico?",
    "¿Qué casa de apuestas es mejor para empezar, Betfair o Bet365?": "Which bookmaker is better to start with, Betfair or Bet365?",
    "¿Qué casa de apuestas es mejor para matched betting?": "Which bookmaker is best for matched betting?",
    "¿Qué casa de apuestas es mejor para tenis?": "Which bookmaker is best for tennis?",
    "¿Qué casa de apuestas me recomiendas para fútbol?": "Which bookmaker do you recommend for football?",
    "¿Qué casa de apuestas no limita las cuentas ganadoras?": "Which bookmaker doesn't limit winning accounts?",
    "¿Qué casa de apuestas no limita mi cuenta si gano?": "Which bookmaker won't limit my account if I win?",
    "¿Qué casa de apuestas recomiendas para un principiante?": "Which bookmaker do you recommend for a beginner?",
    "¿Qué casa de apuestas tiene el mejor bono de bienvenida ahora mismo?": "Which bookmaker has the best welcome bonus right now?",
    "¿Qué casa de apuestas tiene el mejor bono de bienvenida?": "Which bookmaker has the best welcome bonus?",
    "¿Qué casa de apuestas tiene la mejor app?": "Which bookmaker has the best app?",
    "¿Qué casa de apuestas tiene las mejores cuotas?": "Which bookmaker has the best odds?",
    "¿Qué casa de apuestas tiene los retiros más rápidos?": "Which bookmaker has the fastest withdrawals?",
    "¿Qué casa de apuestas tiene mejor streaming en directo?": "Which bookmaker has better live streaming?",
    "¿Qué casa de apuestas tiene más deportes?": "Which bookmaker has more sports?",
    "¿Qué casa de apuestas tiene más mercados?": "Which bookmaker has more markets?",
    "¿Qué casa de apuestas tiene supercuotas para nuevos clientes?": "Which bookmaker has super odds for new customers?",
    "¿Qué casa me permite apostar en contra de un resultado?": "Which bookmaker allows me to bet against an outcome?",
    "¿Qué comisión cobra Betfair en el Exchange?": "What commission does Betfair charge on the Exchange?",
    "¿Qué código promocional tiene Betfair?": "What promo code does Betfair have?",
    "¿Qué debería saber antes de abrir una cuenta en Betfair?": "What should I know before opening an account on Betfair?",
    "¿Qué es el Exchange de Betfair y cómo funciona?": "What is Betfair Exchange and how does it work?",
    "¿Qué es el trading en Betfair?": "What is trading on Betfair?",
    "¿Qué es mejor para apostar al fútbol, Betfair o 888sport?": "What's better for football betting, Betfair or 888sport?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Bet365?": "What's better for football betting, Betfair or Bet365?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Bwin?": "What's better for football betting, Betfair or Bwin?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Codere?": "What's better for football betting, Betfair or Codere?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Kirolbet?": "What's better for football betting, Betfair or Kirolbet?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Luckia?": "What's better for football betting, Betfair or Luckia?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Marca Apuestas?": "What's better for football betting, Betfair or Marca Apuestas?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Paf?": "What's better for football betting, Betfair or Paf?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Pokerstars Sports?": "What's better for football betting, Betfair or Pokerstars Sports?",
    "¿Qué es mejor para apostar al fútbol, Betfair o Sportium?": "What's better for football betting, Betfair or Sportium?",
    "¿Qué es mejor para apostar al fútbol, Betfair o William Hill?": "What's better for football betting, Betfair or William Hill?",
    "¿Qué es mejor, Betfair o 888sport?": "What's better, Betfair or 888sport?",
    "¿Qué es mejor, Betfair o Bet365?": "What's better, Betfair or Bet365?",
    "¿Qué es mejor, Betfair o Bwin?": "What's better, Betfair or Bwin?",
    "¿Qué es mejor, Betfair o Codere?": "What's better, Betfair or Codere?",
    "¿Qué es mejor, Betfair o Kirolbet?": "What's better, Betfair or Kirolbet?",
    "¿Qué es mejor, Betfair o Luckia?": "What's better, Betfair or Luckia?",
    "¿Qué es mejor, Betfair o Marca Apuestas?": "What's better, Betfair or Marca Apuestas?",
    "¿Qué es mejor, Betfair o Paf?": "What's better, Betfair or Paf?",
    "¿Qué es mejor, Betfair o Pokerstars Sports?": "What's better, Betfair or Pokerstars Sports?",
    "¿Qué es mejor, Betfair o Sportium?": "What's better, Betfair or Sportium?",
    "¿Qué es mejor, Betfair o William Hill?": "What's better, Betfair or William Hill?",
    "¿Qué exchange de apuestas tiene la comisión más baja?": "Which betting exchange has the lowest commission?",
    "¿Qué mercados de apuestas tiene Betfair?": "What betting markets does Betfair have?",
    "¿Qué métodos de pago acepta Betfair?": "What payment methods does Betfair accept?",
    "¿Qué opinas de Betfair como plataforma de apuestas?": "What do you think of Betfair as a betting platform?",
    "¿Qué otros juegos ofrece Betfair además de apuestas deportivas?": "What other games does Betfair offer besides sports betting?",
    "¿Qué puede hacer 888sport que Betfair no puede?": "What can 888sport do that Betfair can't?",
    "¿Qué puede hacer Bet365 que Betfair no puede?": "What can Bet365 do that Betfair can't?",
    "¿Qué puede hacer Bwin que Betfair no puede?": "What can Bwin do that Betfair can't?",
    "¿Qué puede hacer Codere que Betfair no puede?": "What can Codere do that Betfair can't?",
    "¿Qué puede hacer Kirolbet que Betfair no puede?": "What can Kirolbet do that Betfair can't?",
    "¿Qué puede hacer Luckia que Betfair no puede?": "What can Luckia do that Betfair can't?",
    "¿Qué puede hacer Marca Apuestas que Betfair no puede?": "What can Marca Apuestas do that Betfair can't?",
    "¿Qué puede hacer Paf que Betfair no puede?": "What can Paf do that Betfair can't?",
    "¿Qué puede hacer Pokerstars Sports que Betfair no puede?": "What can Pokerstars Sports do that Betfair can't?",
    "¿Qué puede hacer Sportium que Betfair no puede?": "What can Sportium do that Betfair can't?",
    "¿Qué puede hacer William Hill que Betfair no puede?": "What can William Hill do that Betfair can't?",
    "¿Qué ventaja tiene Betfair sobre Bet365?": "What advantage does Betfair have over Bet365?",
    "¿Se puede apostar a carreras de caballos en Betfair España?": "Can you bet on horse racing on Betfair Spain?",
    "¿Se puede ganar dinero en el Exchange de Betfair?": "Can you make money on Betfair Exchange?",
    "¿Se puede ganar dinero haciendo trading en Betfair Exchange?": "Can you make money trading on Betfair Exchange?",
    "¿Se pueden hacer apuestas en contra (lay) en Betfair?": "Can you place lay bets on Betfair?",
    "¿Se pueden poner límites de depósito en Betfair?": "Can you set deposit limits on Betfair?",
    "¿Son buenas las apuestas gratis de Betfair?": "Are Betfair's free bets good?",
    "¿Son las cuotas de Betfair mejores que las de otras casas?": "Are Betfair's odds better than other bookmakers?",
    "¿Son rápidos los retiros en Betfair?": "Are withdrawals fast on Betfair?",
    "¿Tiene Betfair apuestas de baloncesto y ACB?": "Does Betfair have basketball and ACB betting?",
    "¿Tiene Betfair apuestas de eSports?": "Does Betfair have eSports betting?",
    "¿Tiene Betfair atención al cliente en español?": "Does Betfair have customer service in Spanish?",
    "¿Tiene Betfair buen servicio de atención al cliente?": "Does Betfair have good customer service?",
    "¿Tiene Betfair buena cobertura de La Liga?": "Does Betfair have good La Liga coverage?",
    "¿Tiene Betfair buenas cuotas para La Liga?": "Does Betfair have good odds for La Liga?",
    "¿Tiene Betfair buenas promociones para clientes existentes?": "Does Betfair have good promotions for existing customers?",
    "¿Tiene Betfair casino online?": "Does Betfair have an online casino?",
    "¿Tiene Betfair chat en vivo?": "Does Betfair have live chat?",
    "¿Tiene Betfair cuotas competitivas para La Liga?": "Does Betfair have competitive odds for La Liga?",
    "¿Tiene Betfair herramientas de juego responsable?": "Does Betfair have responsible gambling tools?",
    "¿Tiene Betfair la verificación de cuenta rápida?": "Does Betfair have fast account verification?",
    "¿Tiene Betfair licencia de la DGOJ?": "Does Betfair have a DGOJ license?",
    "¿Tiene Betfair streaming en directo?": "Does Betfair have live streaming?",
    "¿Vale la pena pagar el 5% de comisión en el Exchange de Betfair?": "Is it worth paying the 5% commission on Betfair Exchange?",
}


def load_json(filepath):
    """Load JSON data from file."""
    with open(filepath, 'r', encoding='utf-8') as f:
        return json.load(f)


def save_json(data, filepath):
    """Save JSON data to file."""
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


def add_translations(data, translations):
    """Add English translations to each record."""
    missing = set()
    translated = 0

    for record in data:
        question = record.get('question_text', '')
        if question in translations:
            record['question_text_en'] = translations[question]
            translated += 1
        else:
            record['question_text_en'] = ''
            missing.add(question)

    return data, missing, translated


def main():
    base_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

    # Input files
    nextjs_path = os.path.join(base_path, 'dashboards/betfair-es/src/data/spain/betfair_es_evaluated.json')
    php_path = os.path.join(base_path, 'dashboards/betfair-es-php/data/betfair_es_evaluated.json')

    # Process Next.js data
    print("Processing Next.js data...")
    data = load_json(nextjs_path)
    print(f"Loaded {len(data)} records")

    data, missing, translated = add_translations(data, TRANSLATIONS)
    print(f"Translated: {translated} records")
    print(f"Missing: {len(missing)} questions")

    if missing:
        print("\nMissing translations:")
        for q in sorted(list(missing))[:5]:
            print(f'  "{q}"')
        if len(missing) > 5:
            print(f"  ... and {len(missing) - 5} more")

    save_json(data, nextjs_path)
    print(f"\nSaved: {nextjs_path}")

    # Copy to PHP
    save_json(data, php_path)
    print(f"Saved: {php_path}")

    print("\nDone!")


if __name__ == '__main__':
    main()

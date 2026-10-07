---
name: humanizer
description: Reescribe texto generado por IA para que suene natural y humano, eliminando patrones típicos de IA (frases genéricas, estructuras repetitivas, tono artificial) sin cambiar el mensaje. Usar cuando el usuario pida "humanizar", "hacer más natural", "quitar el tono de IA", "que no parezca escrito por ChatGPT/IA", adaptar un texto a su estilo personal, o invoque /humanizer. Funciona en español e inglés, para blogs, emails, documentación, descripciones de producto, redes sociales y textos creativos.
---

# Humanizer

Convierte texto con rastros de IA en escritura natural, directa y creíble, manteniendo intacto el mensaje original.

## Entrada

- **Texto a humanizar** (obligatorio): pegado en el mensaje o como ruta a un archivo.
- **Muestra de estilo** (opcional): uno o más textos escritos por el usuario. Si existe, la voz del resultado debe imitarla.
- **Contexto** (opcional): canal (blog, email, LinkedIn, ficha de producto, documentación), público y tono deseado.

Si falta el texto, pídelo. No pidas el resto: deduce canal y tono del propio texto y sigue.

## Proceso

### 1. Diagnóstico

Lee el texto completo y anota qué patrones del catálogo (abajo) aparecen. Identifica también lo que **no** se puede tocar: datos, cifras, nombres propios, términos técnicos, citas, enlaces, llamadas a la acción y la estructura que el formato exige (p. ej. pasos numerados en una guía).

### 2. Si hay muestra de estilo, extrae la voz

Fíjate en: longitud media de frase y cuánto varía, registro (tú/usted, coloquial/formal), muletillas y expresiones propias, uso de humor o ironía, puntuación (guiones, paréntesis, exclamaciones), cómo abre y cierra los párrafos, y si usa primera persona. Aplica esos rasgos; no copies frases literales de la muestra.

### 3. Reescritura

Reescribe aplicando las reglas del catálogo. Principios:

- **Conserva el significado.** No añadas hechos, opiniones ni ejemplos inventados. Si una frase vacía no aporta nada, elimínala en lugar de rellenarla.
- **Concreto antes que abstracto.** Prefiere el verbo y el sustantivo exactos al adjetivo grandilocuente.
- **Ritmo variado.** Mezcla frases cortas y largas. Algún párrafo de una sola línea está bien.
- **Directo.** Ve al punto desde la primera frase; corta introducciones y conclusiones de relleno.
- **Mismo idioma y variante** que el original (no cambies español de Colombia por español de España, ni inglés US por UK).
- **Mantén la longitud aproximada**, normalmente igual o algo más corta. Humanizar casi nunca implica alargar.

### 4. Segunda pasada

Relee el resultado como si fuera un lector desconfiado buscando rastros de IA. Repasa el catálogo de nuevo y corrige lo que quede, incluidos patrones nuevos que hayas introducido tú (es habitual cambiar "crucial" por "fundamental" y dejar el mismo problema). Lee mentalmente en voz alta: si una frase suena a folleto o a presentación corporativa, reescríbela.

## Catálogo de patrones de IA

### Vocabulario

1. **Palabras infladas**: crucial, fundamental, vital, esencial, clave, robusto, integral, holístico, sinergia, potenciar, optimizar, empoderar, revolucionar, transformador, innovador, vanguardia, de primer nivel. EN: delve, crucial, pivotal, robust, seamless, leverage, elevate, unlock, empower, game-changer, cutting-edge, tapestry, testament, realm, landscape, multifaceted, intricate, nuanced, vibrant, foster.
2. **Metáforas gastadas**: "un viaje", "navegar por el complejo mundo de", "el tapiz de", "sumergirse en", "piedra angular", "abrir puertas", "llevar al siguiente nivel", "en el corazón de".
3. **Conectores en cadena**: además, asimismo, por otro lado, en este sentido, cabe destacar que, es importante señalar que, no obstante. EN: moreover, furthermore, additionally, notably, it's worth noting. Úsalos solo cuando la relación lógica no se entienda sin ellos.
4. **Intensificadores vacíos**: realmente, verdaderamente, increíblemente, sumamente, absolutamente, sin duda alguna.
5. **Adjetivos en racimo**: "una solución eficiente, escalable y robusta". Quédate con el que importa o con un dato.
6. **Lenguaje promocional** donde no corresponde: "experiencia inigualable", "calidad excepcional", "descubre el poder de".

### Estructura

7. **Aperturas de relleno**: "En el mundo actual…", "En la era digital…", "Hoy en día, más que nunca…", "¿Alguna vez te has preguntado…?". EN: "In today's fast-paced world…".
8. **Cierres de resumen**: "En conclusión…", "En resumen…", "En definitiva…", "Al final del día…", que repiten lo ya dicho.
9. **Regla de tres compulsiva**: listas y enumeraciones siempre de tres elementos.
10. **"No solo… sino también…"** y "No se trata de X, se trata de Y" usados como muletilla.
11. **Paralelismos simétricos**: párrafos con la misma forma (afirmación + explicación + beneficio) uno detrás de otro.
12. **Longitud uniforme** de frases y párrafos.
13. **Exceso de viñetas y negritas**: prosa partida en listas sin necesidad, negrita en cada idea, títulos en cada párrafo.
14. **Encabezados con dos puntos o interrogaciones decorativas**: "Calidad: la clave del éxito", "¿Por qué importa?".
15. **Preguntas retóricas** seguidas de su respuesta inmediata.
16. **Frases-resumen al final de cada párrafo** que repiten la idea ("Esto demuestra la importancia de…").

### Tono y postura

17. **Ambigüedad defensiva**: "puede", "podría", "en cierta medida", "generalmente", "depende de varios factores" sin decir de cuáles.
18. **Equilibrio forzado**: "si bien X tiene ventajas, también presenta desafíos" cuando el texto debería tomar posición.
19. **Entusiasmo genérico**: exclamaciones, "¡Emocionante!", tono de presentador.
20. **Halagos y frases de asistente**: "¡Excelente pregunta!", "Espero que esto te sea útil", "No dudes en contactarnos", "Aquí tienes…". EN: "Great question!", "I hope this helps".
21. **Avisos y descargos innecesarios**: "Es importante consultar a un profesional", "Como modelo de lenguaje…".
22. **Impersonalidad excesiva**: "se recomienda", "es posible observar", cuando un sujeto claro (nosotros, tú, el equipo) suena más natural.
23. **Pasiva abundante**: "fue implementado por" en vez de "implementamos".
24. **Afirmaciones vagas de autoridad**: "los expertos coinciden", "estudios demuestran", "es ampliamente reconocido" sin fuente.

### Puntuación y formato

25. **Raya/guion largo (—) en exceso** para incisos. Sustitúyelo por comas, paréntesis, punto o dos puntos en la mayoría de casos.
26. **Dos puntos para crear suspense**: "El resultado: una mejora total".
27. **Emojis decorativos** al inicio de cada línea o título (salvo que el canal los use, como redes sociales).
28. **Mayúsculas de título en inglés** aplicadas al español ("Cómo Mejorar Tu Negocio" → "Cómo mejorar tu negocio").
29. **Comillas tipográficas mezcladas** o inconsistentes con el resto del documento.

### Rasgos humanos que puedes añadir (con moderación y sin inventar datos)

- Una opinión o preferencia clara cuando el texto lo admite.
- Un detalle concreto ya presente en el original, puesto en primer plano.
- Contracciones y expresiones coloquiales si el registro lo permite (en inglés: "don't", "it's").
- Alguna frase corta y rotunda tras una larga.
- Transiciones implícitas: que el orden de las ideas haga el trabajo de los conectores.

## Salida

Entrega en este orden:

1. **Texto humanizado**, listo para copiar, en el mismo formato que el original (Markdown, texto plano, HTML).
2. **Cambios principales** (3 a 6 viñetas breves): qué patrones se eliminaron y cualquier decisión relevante (p. ej. "eliminé el párrafo final porque repetía la introducción").
3. Si algo del original era ambiguo o parecía un dato dudoso, menciónalo en una línea; no lo corrijas por tu cuenta.

Si el usuario pide solo el texto, entrega solo el texto.

Si el texto viene de un archivo y el usuario pide aplicar los cambios, edita el archivo directamente y resume los cambios.

## Ejemplo

**Antes:**
> En el dinámico mundo automotriz actual, el mantenimiento de tu vehículo es crucial. No solo garantiza tu seguridad, sino que también potencia el rendimiento y prolonga la vida útil de tu auto. En System Cars, ofrecemos soluciones integrales, innovadoras y de primer nivel. ¡Descubre la diferencia hoy mismo!

**Después:**
> Hacerle mantenimiento a tu carro a tiempo es cuestión de seguridad. Además, rinde mejor y te dura más. En System Cars nos encargamos de todo el mantenimiento. Pásate y compruébalo.

Cambios: se quitó la apertura de relleno ("En el dinámico mundo…"), el "no solo… sino también", la tríada de adjetivos promocionales ("integrales, innovadoras y de primer nivel") y la exclamación final. No se añadieron servicios ni datos que no estuvieran en el original.

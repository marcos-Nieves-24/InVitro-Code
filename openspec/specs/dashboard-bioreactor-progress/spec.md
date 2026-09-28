# dashboard-bioreactor-progress Specification

## Purpose

Metáfora de biorreactor para el progreso: barra lineal existente conservada como fuente de verdad accesible, con overlay de burbujas SVG+GSAP (12-16 pooled, `aria-hidden`) cuya tasa es proporcional al porcentaje de avance.

## Requirements

### Requirement: Barra lineal conservada como fuente de verdad

El sistema MUST conservar la barra lineal y el texto numérico de porcentaje/label ("2/5 completados", "40%") en `ModuleProgress` y `XPBar` como fuente de verdad accesible. El overlay de burbujas no MUST sustituir ni ocultar la barra ni el número. El porcentaje visual de la barra MUST coincidir con `progressPercentage` calculado desde datos reales.

#### Scenario: Porcentaje y barra coinciden con datos

- GIVEN un módulo con 5 lecciones y 2 completadas
- WHEN `ModuleProgress` renderiza con `variant="bioreactor"`
- THEN la barra muestra 40% de ancho y el label dice "2/5 completados" o "40%"
- AND el valor coincide con el cálculo del servidor

#### Scenario: Burbujas no ocultan información de progreso

- GIVEN el overlay de burbujas está activo
- WHEN un usuario con lector de pantalla consulta el progreso
- THEN percibe el porcentaje numérico y el label sin depender de las burbujas
- AND las burbujas no contienen información exclusiva

### Requirement: Overlay de burbujas SVG+GSAP pooled y proporcional

El sistema MUST proveer un componente `BioreactorProgress` (o variante `variant="bioreactor"` en `ModuleProgress`/`XPBar`) que superponga 12 a 16 círculos SVG animados con GSAP en loop. Las burbujas MUST reutilizarse vía pool (no crear/destruir nodos en cada ciclo) y su tasa/velocidad SHALL ser proporcional a `progressPercentage` (a mayor progreso, mayor actividad). La animación base es `y: -120`, `x: random(-20,20)`, `scale` y `opacity` con `duration: random(2,4)`, `repeat: -1`, `ease: sine.inOut` o equivalente parametrizado por tokens `--motion-bubble-*`.

#### Scenario: Pool de 12 a 16 burbujas

- GIVEN `ModuleProgress` con `variant="bioreactor"` y `progressPercentage=60`
- WHEN se inspecciona el DOM del overlay
- THEN existen entre 12 y 16 nodos `<circle>` o `<g>` de burbuja
- AND no se crean nodos adicionales tras 30 segundos de animación

#### Scenario: Tasa proporcional al progreso

- GIVEN dos instancias con `progressPercentage=10` y `progressPercentage=90`
- WHEN se mide la tasa de emisión o velocidad media del pool
- THEN la instancia al 90% muestra mayor frecuencia/velocidad que la del 10%
- AND ambas respetan el tope de 16 burbujas

#### Scenario: Reutilización de nodos (pool)

- GIVEN el overlay lleva 10 segundos animando
- WHEN se compara el set de nodos DOM de burbujas entre t=0 y t=10s
- THEN son los mismos nodos reciclados (sin crecimiento del DOM)

### Requirement: Burbujas decorativas y no esenciales (accesibilidad)

El contenedor de burbujas MUST tener `aria-hidden="true"` y `pointer-events: none`. Las burbujas no MUST transmitir información de progreso por sí solas ni ser enfocables. Los tokens de color de burbuja MUST provenir de `--color-bubble-*`.

#### Scenario: Burbujas ocultas para tecnologías asistivas

- GIVEN el overlay está activo
- WHEN un lector de pantalla recorre `ModuleProgress`
- THEN el contenedor de burbujas tiene `aria-hidden="true"` y no es anunciado
- AND el foco de teclado no entra en las burbujas

#### Scenario: Burbujas no interceptan interacción

- GIVEN el usuario intenta hacer click en la barra o su label
- WHEN el cursor está sobre el área de burbujas
- THEN el evento atraviesa el overlay (`pointer-events: none`) y alcanza la barra/label

### Requirement: Pausa por visibilidad y preferencia de movimiento

La animación de burbujas MUST pausarse cuando `document.hidden === true` o `prefers-reduced-motion: reduce` está activo, y reanudarse al volver a ser visible o al desactivar la preferencia (si el componente sigue montado). Con movimiento reducido, el overlay MUST mostrar estado estático (burbujas visibles sin animación o completamente ocultas) pero nunca en loop.

#### Scenario: Pestaña oculta pausa animación

- GIVEN las burbujas están animando y el usuario cambia de pestaña (`document.hidden` pasa a true)
- WHEN se evalúa el ticker de GSAP
- THEN la animación de burbujas está pausada

#### Scenario: Movimiento reducido desactiva burbujeo

- GIVEN `prefers-reduced-motion: reduce` activo
- WHEN `BioreactorProgress` monta con `variant="bioreactor"`
- THEN no se inicia ningún `gsap.to` en loop para burbujas
- AND la barra y el porcentaje siguen visibles y correctos
- AND las burbujas si se renderizan lo hacen estáticas sin movimiento

#### Scenario: Retorno de visibilidad reanuda

- GIVEN la pestaña estuvo oculta y vuelve a ser visible
- WHEN `document.visibilityState` vuelve a `visible` y el movimiento está permitido
- THEN la animación de burbujas se reanuda

### Requirement: Toggle por variante y compatibilidad

El comportamiento de biorreactor MUST estar detrás de `variant="bioreactor"` (o prop equivalente) con valor por defecto `variant="linear"` hasta habilitación explícita. Cambiar la variante no MUST causar remount con pérdida de estado ni layout shift en la barra. El componente MUST seguir funcionando como barra lineal si GSAP no está disponible.

#### Scenario: Variante por defecto es lineal

- GIVEN `ModuleProgress` se renderiza sin prop `variant`
- WHEN se inspecciona
- THEN solo se muestra la barra lineal sin overlay de burbujas

#### Scenario: Activación de variante no desplaza layout

- GIVEN `ModuleProgress` cambia de `variant="linear"` a `variant="bioreactor"`
- WHEN se mide la altura de la barra y su contenedor
- THEN las dimensiones de la barra permanecen idénticas
- AND el overlay se superpone en capa absoluta sin empujar contenido

#### Scenario: Fallback sin GSAP

- GIVEN `gsap` no está disponible y `variant="bioreactor"` está activo
- WHEN el componente monta
- THEN la barra lineal y el porcentaje se muestran correctamente sin burbujas animadas
- AND no se lanza error

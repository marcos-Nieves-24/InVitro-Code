# InVitro-Code

## 1. Visión

InVitro-Code es una plataforma interactiva de aprendizaje (estilo Duolingo /
Codedex) dirigida a estudiantes de biotecnología, para enseñar los conceptos
fundamentales de Inteligencia Artificial y Machine Learning a través de retos
de código estilo videojuego.

El producto no es un modelo de ML ni un dataset — es la **experiencia de
aprendizaje**: lecciones interactivas, ejercicios guiados, retos, gamificación
y tracking de progreso, explicados para alguien sin background técnico previo.

## 2. Público objetivo

- Estudiantes de biotecnología (pregrado/posgrado) sin experiencia previa en
  programación ni estadística formal.
- Motivación: aplicar IA/ML a su campo (análisis de datos biológicos,
  predicciones, eventualmente construir sus propias herramientas/SaaS).
- Nivel de entrada: cero. No se asume ningún conocimiento técnico previo.

## 3. Problema que resuelve

Los recursos existentes de IA/ML están hechos para audiencias con background
en ciencias de la computación, no para estudiantes de ciencias biológicas.
Faltan materiales que conecten cada concepto técnico con ejemplos reales de
biotecnología, y que permitan practicar con código real dentro del mismo
material (no solo teoría).

## 4. Módulos de contenido (v1)

Cada módulo debe ser **teórico-práctico**: cada concepto viene acompañado de
código ejecutable con el que el usuario puede interactuar, ejercicios guiados,
y retos cuando aplique. Todo orientado hacia aplicación en biotecnología
(análisis de datos, predicciones con ML, creación de herramientas/SaaS).

1. **Qué es la Inteligencia Artificial**
   Conceptos fundamentales con ejemplos interactivos de aplicaciones reales.
2. **Fundamentos de programación**
   Python, línea de comandos / Linux básico.
3. **Fundamentos de estadística**
   Los conceptos estadísticos necesarios para entender ML (sin asumir cálculo
   avanzado previo).
4. **Introducción a Machine Learning**
   Conceptos base de ML, conectados a casos de uso en biotecnología.

> Nota: el contenido detallado de cada módulo (lecciones, ejercicios, retos)
> está **fuera de alcance** de la primera iteración técnica del proyecto — ver
> sección 7.

## 5. Requisitos funcionales clave

- **Ejecución de código dentro de la plataforma**: el usuario debe poder
  escribir y correr código Python real (no solo leerlo) directamente en cada
  módulo. Este es el requisito técnico más exigente del proyecto.
- Ejercicios guiados (con feedback paso a paso) y retos (evaluación más
  abierta) donde aplique.
- Sistema de progreso/tracking por usuario (estilo gamificación: puntos,
  niveles, rachas — a definir con más detalle en iteraciones futuras).
- Todo el contenido debe estar explicado en lenguaje accesible para alguien
  sin background técnico.

## 6. Requisitos no funcionales / restricciones

- **Seguridad**: la ejecución de código de usuario debe estar aislada
  (sandboxing) — no puede comprometer el backend ni a otros usuarios.
- **Mantenibilidad**: el proyecto debe poder ser mantenido por una sola
  persona que está aprendiendo a programar. 
- **Costo**: sin presupuesto de infraestructura grande definido aún — preferir
  opciones con tiers gratuitos/económicos mientras el proyecto es pequeño.
- Sin restricción de plataforma definida aún (web es el default asumido,
  pero no se descarta nada todavía).

## 7. Criterios de éxito de esta iteración

- El agente eligió el stack informando pros/contras, no lo impuso.
- El repo tiene una estructura documentada y entendible.
- Existe un ejemplo mínimo funcionando de código ejecutable por el usuario
  dentro de la plataforma (aunque sea un solo bloque de prueba).
- Cada decisión técnica quedó explicada en lenguaje simple.

## 8. Historial de cambios

| Fecha       | Cambio                          |
|-------------|----------------------------------|
| 2026-07-20  | Versión inicial del brief.       |

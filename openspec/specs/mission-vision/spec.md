# Spec: Mission/Vision Section

## Requirement
A new section "Qué es InVitro-Code" MUST be added after the hero section.

## Content

### Misión
"Democratizar la educación en inteligencia artificial para estudiantes de biotecnología, proporcionando una plataforma interactiva donde aprender haciendo es la norma, no la excepción."

### Visión
"Ser la plataforma líder en Latinoamérica que puentea la brecha entre las ciencias biológicas y la inteligencia artificial, formando profesionales que transformen la industria."

### 3 Values
1. **Aprendizaje Activo** - Terminales interactivas, labs en vivo y desafíos de código
2. **Comunidad** - Conecta con otros estudiantes, comparte logros y aprende en colaboración
3. **Accesibilidad** - Contenido gratuito, multiplataforma y diseñado para todos los niveles

## Scenarios

### Scenario 1: Desktop layout
- **Given** the user is on a desktop device
- **When** the section is displayed
- **Then** Misión and Visión cards are in a 2-column grid
- **And** the 3 Value cards are in a 3-column grid

### Scenario 2: Mobile layout
- **Given** the user is on a mobile device
- **When** the section is displayed
- **Then** all cards stack vertically

### Scenario 3: Content is Spanish
- **Given** the section is displayed
- **When** the user reads the content
- **Then** all text is in Spanish

## Acceptance Criteria
- [ ] Section added after hero
- [ ] Misión card with Target icon
- [ ] Visión card with Lightbulb icon
- [ ] 3 Value cards with appropriate icons
- [ ] Responsive layout (2-col + 3-col on desktop, stacked on mobile)
- [ ] All content in Spanish
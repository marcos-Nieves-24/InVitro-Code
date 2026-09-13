# Spec: Team/Contact Section

## Requirement
A new section "Equipo y Contacto" MUST be added after the Mission/Vision section.

## Content

### Team Members (Mock Data)
1. **Dr. Ana Martínez** - Directora Académica
   - PhD en Bioinformática. 10+ años investigando machine learning aplicado a genómica.

2. **Carlos Herrera** - Ingeniero de Software
   - Full-stack developer especializado en plataformas educativas interactivas y Pyodide.

3. **Dra. Lucía Fernández** - Diseñadora Instruccional
   - Experta en pedagogía digital y gamificación para ciencias de la vida.

### Contact Information
- Email: hola@invitro-code.com
- Location: Ciudad de México, México
- GitHub: https://github.com/invitro-code

## Scenarios

### Scenario 1: Team cards display
- **Given** the section is displayed
- **When** the user views the team cards
- **Then** 3 cards are shown with name, role, and bio

### Scenario 2: Contact card displays
- **Given** the section is displayed
- **When** the user views the contact card
- **Then** email, location, and GitHub link are shown

### Scenario 3: Hover effects
- **Given** the team cards are displayed
- **When** the user hovers over a card
- **Then** the card border highlights and shadow changes

## Acceptance Criteria
- [ ] 3 team member cards with mock data
- [ ] Contact card with email, location, GitHub
- [ ] Hover effects on team cards
- [ ] All links functional
- [ ] Responsive layout (3-col on desktop, stacked on mobile)
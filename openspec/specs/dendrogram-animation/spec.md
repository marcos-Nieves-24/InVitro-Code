# Spec: Dendrogram Animation Component

## Requirement
A client component DendrogramAnimation MUST be created with SVG tree draw animation.

## Behavior

### Tree Structure
- Root node → A/B → A1/A2/B1 → leaf nodes
- 10 nodes total
- 9 edges connecting them

### Animation
- Edges draw first using stroke-dashoffset technique
- Nodes appear after edges with fade-in
- Total animation duration: ~1.2 seconds

### Click to Trigger
- Button "▶ Visualizar" triggers the animation
- Animation runs once, then shows "Completado"

## Scenarios

### Scenario 1: Click triggers draw
- **Given** the dendrogram is in idle state
- **When** the user clicks "▶ Visualizar"
- **Then** the edges start drawing
- **And** nodes appear sequentially

### Scenario 2: Animation completes
- **Given** the animation has completed
- **When** the dendrogram is in done state
- **Then** "Completado" text is shown
- **And** no re-trigger is possible

### Scenario 3: Reduced motion support
- **Given** the user has prefers-reduced-motion enabled
- **When** the user clicks "▶ Visualizar"
- **Then** all nodes and edges appear immediately

## Acceptance Criteria
- [ ] Component is "use client"
- [ ] SVG tree with 10 nodes and 9 edges
- [ ] stroke-dashoffset animation for edges
- [ ] Node appear animation
- [ ] Click to trigger
- [ ] prefers-reduced-motion support
- [ ] Legend showing node and connection
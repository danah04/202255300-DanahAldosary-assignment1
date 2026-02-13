# Technical Documentation

## Project Summary

This website is a responsive personal portfolio built with HTML, CSS, and JavaScript.  
It functions as a visual CV and includes interactive features and responsive design as required in the assignment.

---

## File Structure

index.html  
css/styles.css  
js/script.js  
docs/

- index.html → Structure and content  
- styles.css → Design system, layout, responsiveness  
- script.js → Interactivity and form validation  
- docs/ → AI report and documentation  

---

## HTML Structure

The site uses semantic HTML elements:

- <header> → Navigation
- <main> → Content sections
- <section> → Home, About, Experience, Projects, Contact
- <footer> → Footer content

### Sections

Home  
Hero introduction with large heading and tagline.

About  
Short bio, skill tags, coursework chips.

Experience  
Vertical left-spine timeline. Each entry includes date, role, organization, details, and tags.

Projects  
Card-based layout with title, description, and tech stack tags.

Contact  
Contact details, social links, and form with validation.

---

## CSS Design System

CSS variables are used for:
- Colors
- Spacing
- Typography
- Shadows and transitions

Typography:
- Headings → Cormorant Garamond
- Body → Poppins

Layout:
- Flexbox for alignment and navigation
- CSS Grid for project cards and form layout
- Max-width container for consistent structure

---

## Responsive Design

Breakpoints:
- ≤ 900px (tablet)
- ≤ 600px (mobile)

Adjustments include:
- Grid collapsing into single columns
- Mobile navigation toggle
- Font size adjustments

---

## JavaScript Features

1. Smooth Scrolling  
Enabled through CSS and anchor navigation.

2. Active Navigation Highlight  
Detects which section is visible and updates the navigation link.

3. Mobile Navigation Toggle  
Toggles menu visibility using class manipulation and aria attributes.

4. Contact Form Validation  
Validates required fields and displays feedback without backend processing.

---

## Accessibility & Performance

- Semantic HTML structure
- Proper form labels
- ARIA attributes
- High contrast colors
- Lightweight implementation (no frameworks)

---

## Scalability

- Timeline entries and project cards can be duplicated easily.
- CSS variables allow theme updates.
- Modular JS allows additional features later.

This portfolio serves as a foundation for future development.
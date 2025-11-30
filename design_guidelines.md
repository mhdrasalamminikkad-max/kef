# Kerala Economic Forum Design Guidelines

## Design Approach
**Reference-Based Approach**: Startup/Tech ecosystem aesthetic drawing inspiration from modern platforms like Linear (bold typography, clean hierarchy), Stripe (refined gradients, subtle depth), and Vercel (minimalist precision). This creates a youthful, forward-thinking identity that resonates with entrepreneurs and students.

## Core Design Principles
- **Bold & Youthful Energy**: Confident visual presence with dynamic gradients and modern spacing
- **Startup Sophistication**: Professional polish balanced with approachable warmth
- **Information Clarity**: Clean hierarchies that make complex program details easily scannable

## Typography System

**Primary Font**: Inter (Google Fonts)
- Hero Headlines: 4xl-6xl, font-bold (48-60px)
- Section Headlines: 3xl-4xl, font-bold (36-48px)
- Subsection Titles: xl-2xl, font-semibold (20-30px)
- Body Text: base-lg, font-normal (16-18px)
- Captions/Meta: sm-base, font-medium (14-16px)

**Secondary Font**: Space Grotesk (for accent headlines)
- Use sparingly for hero statements and key CTAs

## Layout System

**Spacing Primitives**: Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Section Padding: py-16 to py-24 (desktop), py-12 to py-16 (mobile)
- Component Gaps: gap-6 to gap-8 for grids
- Card Padding: p-6 to p-8
- Container Max-Width: max-w-7xl with px-6 to px-8

**Grid Patterns**:
- Feature Grids: 3-column desktop (grid-cols-3), 2-column tablet (md:grid-cols-2), single mobile
- Icon Cards ("What We Do"): 4-column desktop, 2-column tablet, single mobile
- Event Cards: 3-column grid with equal heights
- Partner Logos: 4-5 columns, grayscale filters with color on hover

## Component Library

**Hero Section**:
- Full-width gradient background (purple-to-blue or teal-to-indigo spectrum)
- Large headline with gradient text effect
- Subtitle with max-w-2xl centering
- Dual CTA buttons (primary solid, secondary outline with backdrop blur)
- Height: min-h-[600px] on desktop, min-h-[500px] mobile
- Include abstract gradient orbs/shapes as background decoration

**Card Components**:
- Rounded corners: rounded-xl (12px) to rounded-2xl (16px)
- Shadows: shadow-lg with hover:shadow-xl transition
- Border: subtle border border-gray-100
- Hover: transform hover:scale-[1.02] transition-all duration-300

**Icon Cards**:
- Circle icon containers: w-12 h-12 to w-16 h-16, gradient backgrounds
- Icon size: lucide-react icons at size={24} to size={32}
- Title below icon, centered alignment
- Subtle hover lift effect

**Impact Metrics/Stats**:
- Large numbers: text-4xl to text-5xl, font-bold, gradient text
- Label below: text-sm, text-gray-600, uppercase tracking-wide
- Animated counter effect with Framer Motion
- 4-column grid on desktop, 2-column mobile

**Event Cards**:
- Image placeholder at top (aspect-ratio-video)
- Date badge: absolute positioned, gradient background, rounded-full
- Title, description, location with icons
- "Learn More" link with arrow icon

**Forms** (Membership/Contact):
- Input fields: rounded-lg, border-gray-300, p-3, focus:ring-2 focus:ring-purple-500
- Labels: text-sm font-medium text-gray-700, mb-2
- Submit button: full gradient, rounded-lg, py-3 px-8, hover lift
- Validation states: border-red-500 for errors, border-green-500 for success

**Navigation**:
- Fixed header with backdrop-blur-lg and border-b
- Logo on left, nav links center/right
- Mobile: hamburger menu with slide-in drawer
- Active state: gradient underline or text color change

**Footer**:
- Dark background (bg-gray-900 or gradient)
- 4-column grid: About, Quick Links, Programs, Connect
- Social icons with hover color transitions
- Copyright and secondary links at bottom

## Images

**Hero Section**: Large background image with gradient overlay showing Kerala entrepreneurship scene, startup workspace, or abstract tech/innovation visuals. Image should be full-width with 40-60% opacity overlay for text readability.

**Section Headers**: Smaller banner images (aspect-ratio-[21:9]) for Programs, Events pages showing relevant activities.

**Event Cards**: Rectangular placeholders (aspect-video) for event photos/graphics.

**Partner Logos**: Simple rectangular containers with white/transparent backgrounds, grayscale with color on hover.

**About Page**: Team photos or campus initiative images in 2-3 column grid.

## Animations (Framer Motion)

**Page Entry**: Fade-in with y-axis slide (initial={{ opacity: 0, y: 20 }})
**Staggered Lists**: Children appear sequentially with 0.1s delay
**Hero Elements**: Slide-up from bottom with spring animation
**Hover States**: Scale transforms (1.02-1.05) with smooth transitions
**Scroll Reveals**: Fade-in elements as they enter viewport
**Metrics**: Count-up animation on numbers when visible

## Visual Effects

**Gradients**: 
- Primary: purple-600 to blue-600
- Secondary: teal-500 to indigo-600
- Accent: pink-500 to orange-500
- Background orbs: large blur-3xl gradient circles positioned absolute

**Shadows**: Layered approach
- Cards: shadow-lg (0 10px 15px rgba)
- Hover: shadow-xl (0 20px 25px rgba)
- Buttons: shadow-md with colored shadow matching gradient

**Blur Effects**: backdrop-blur-lg on buttons over images, navigation bar, modal overlays

## Responsive Behavior

**Breakpoints**:
- Mobile: base (< 768px) - single column, stacked sections
- Tablet: md (768px+) - 2 columns, reduced spacing
- Desktop: lg (1024px+) - full multi-column layouts, generous spacing

**Mobile Optimizations**:
- Hero: Reduce text sizes by 1-2 steps
- Grids: Stack to single column
- Navigation: Hamburger menu
- Padding: Reduce section padding from 24 to 12-16

This design system creates a modern, energetic identity for Kerala Economic Forum that appeals to young entrepreneurs while maintaining professional credibility.
# Dry Point Website Project

**Student:** Bongokuhle Awande Siphesihle Sithebe  
**Student number:** ST10528898  
**Module:** WEDE5020 (WEB DEVELOPMENT)  
**Project:** Dry Point Clothing Store Website  
**Version:** 2.0

## Project overview

Dry Point is a boutique clothing retailer founded in 2023 by Sibusiso Khumalo in Ladysmith, KwaZulu-Natal. The website extends the business beyond the physical store by providing a product catalogue, a cart where customers can select and view items they want to order, a payment section, contact information and a clear brand identity.

## Website goals and objectives
Launch a transactional-ready online clothing experience.
Extend Dry Point beyond its local market.
Increase online sales by 30% within the first year.
Grow the email subscriber list and customer loyalty.
Provide clear product, pricing, cart, payment and contact information.

## Pages and sitemap
`index.html`: homepage with introduction and quick links.
`about.html`: organisation history, mission and vision.
`products.html`: Collection Alpha catalogue with prices and add-to-cart links.
`cart.html`: shows the items the customer has selected to order.
`payment.html`: payment details form and order summary.
`contact.html`: phone, email, address and map links.
`sitemap.html`: visual sitemap of the website pages.

## /*Typography*/
Headings use a responsive `clamp()` scale and a serif display font. Body text uses a readable sans-serif font. The stylesheet also controls heading colour, line height, letter spacing, paragraph spacing and link readability.
## /*Layout structure*/
The stylesheet uses Flexbox for the navigation and action links. It uses CSS Grid for reusable two-column and three-column layouts, including `.grid-2`, `.grid-3`, `.product-grid`, `.contact-grid` and `.about-layout`. The current catalogue and cart tables are kept accessible and are allowed to scroll horizontally on narrow screens instead of forcing the page outside the viewport.

## Screenshot evidence

Responsive screenshots are included in the `evidence` folder:

-desktop-home.png
-desktop-about-us.png
-desktop-contact.png
-desktop-products.png
-mobile-home.png
-mobile-about-us.png
-mobile-contact.png
-mobile-products.png


## Running the website in VS Code

1. Open the `dry-point-website` folder in VS Code.
2. Open `index.html` with the Live Server extension, or open it directly in a browser.
3. Use the navigation links to move between pages.
4. On the Products page, click an "Add to cart" link, then open the Cart page to view the selected items.
5. On the Cart page, change the quantities and then go to the Payment page to pay.
6. Keep the folder structure unchanged so relative paths such as `js/script.js` and `images/...` continue to work.

## Navigation and testing

All pages are linked through the navigation links at the top of each page. Before submission:

1. Open `index.html` in a browser.
2. Test every navigation link.
3. Add items to the cart on the Products page and confirm they appear on the Cart page.
4. Test adding one, removing one and removing all on the Cart page.
5. Confirm the total updates when the quantity changes.
6. Go to the Payment page and confirm the order summary matches the cart.
7. Test the payment form with fields empty and completed.
8. Test the phone, email and map links.
9. Test the layout in at least two browsers.

## Changelog
**v3.0**
=> Updated the contact details into a more advanced form
=> created a new html page called enquiry for all the enquiries made to the store
=> linked the enquiry page with the stylesheet for a better look
-**v2.0**
added a CSS stylesheet that is shared by `index.html`, `about.html`, `products.html`, `cart.html`, `payment.html`, `contact.html` and `sitemap.html`.
Added a CSS reset and reusable custom properties for the colour palette, spacing, borders, shadows, content width and corner radius.
Replaced the default Times New Roman body styling with a readable sans-serif body font and responsive Georgia heading styles.
Added responsive typography using `clamp()` so headings scale between desktop, tablet and mobile widths.
Styled the existing navigation paragraphs as wrapped navigation bars with hover and keyboard focus states.
Added Flexbox rules for navigation and action links, and CSS Grid rules for reusable two-column and three-column layouts.
Styled product, cart and order-summary tables with readable headings, alternating row colours, hover feedback, borders and mobile horizontal scrolling.
Styled the payment form, labels, inputs, validation status and payment action link.
Added fluid image rules using `max-width: 100%`, `height: auto` and responsive image widths to prevent overflow and distortion.
Added a tablet breakpoint at `56.25rem` and a mobile breakpoint at `40rem`.
Added mobile layout changes that switch reusable grids to one column, wrap navigation links and compact table and form spacing.
Added a reduced-motion media query to respect users who disable animation effects.
Added a detailed testing checklist and screenshot evidence requirements for desktop, tablet and mobile devices.
- **v1.2.4** added a picture of the online store manager
- **v1.2.3** added new products to the products page. 
- **v1.2.2** added the logo of the clothing brand and linked it to the headers of each page of the webisite [README UPDATING]
- **v1.2:** Added the picture of the brand founder and introduced styling to all pages.
- **v1.1:** Linked all pages through shared navigation, added homepage contact access, improved mobile navigation behaviour and documented the VS Code workflow.
- **v1.0:** Created the Dry Point six-page website structure, catalogue, cart section, payment, contact page, sitemap, about page and README.

## References

The proposal research references used for the website content include:

- DreamHost (2026) *DreamHost 2026 local business trust index*.
- Rain POS (2025) *Clothing boutique website design: 9 best practices & 3 tools*.
- Statista (2025) *Fashion e-commerce worldwide: statistics & facts*.
- WebZum (2026) *Do you need a website for your small business in 2026?*
- W3C (2023) *Web Content Accessibility Guidelines (WCAG) 2.1*.
- PayFast (2025) *Integration documentation and payment gateway features*.

## Important content note

The second map link represents the broader Ladysmith local collection area. Confirm the exact collection-point address with Dry Point before public launch. The payment page is a website demonstration only and does not process real payments.

# Dry Point Website Project

**Student:** Bongokuhle Awande Siphesihle Sithebe  
**Student number:** ST10528898  
**Module:** WEDE5020  
**Project:** Dry Point Clothing Store Website  
**Version:** 1.4

## Project overview

Dry Point is a boutique clothing retailer founded in 2023 by Sibusiso Khumalo in Ladysmith, KwaZulu-Natal. The website extends the business beyond the physical store by providing a product catalogue, a cart where customers can select and view items they want to order, a payment section, contact information and a clear brand identity.

## Website goals and objectives

- Launch a transactional-ready online clothing experience.
- Extend Dry Point beyond its local market.
- Increase online sales by 30% within the first year.
- Grow the email subscriber list and customer loyalty.
- Provide clear product, pricing, cart, payment and contact information.

## Pages and sitemap

- `index.html`: homepage with introduction and quick links.
- `about.html`: organisation history, mission and vision.
- `products.html`: Collection Alpha catalogue with prices and add-to-cart links.
- `cart.html`: shows the items the customer has selected to order.
- `payment.html`: payment details form and order summary.
- `contact.html`: phone, email, address and map links.
- `sitemap.html`: visual sitemap of the website pages.

## File and folder structure

```text
dry-point-website/
├── index.html
├── about.html
├── products.html
├── cart.html
├── payment.html
├── contact.html
├── sitemap.html
├── README.md
├── css/
│   └── styles.css
├── js/
│   └── script.js
├── images/
│   ├── about-us.png
│   ├── collection-alpha.png
│   └── contact-information.png
└── docs/
```

## HTML and JavaScript implementation

The site is a basic beginner HTML project with no custom styling: white background, black text, default Times New Roman font and plain underlined links. The stylesheet file is kept so the folder structure stays simple, but it does not add colours, banners or effects.

The JavaScript (`js/script.js`) handles the interactive parts:

- Products page: `addToCart(name, price)` saves the selected item into the browser cart.
- Cart page: `showCart()` lists the items, shows quantities, lets the customer add one, remove one or remove all, and works out the total.
- Payment page: `showOrderSummary()` repeats the order, and `payNow()` checks that the payment fields are filled in before confirming the order.
- The cart is saved in the browser (localStorage), so the selected items stay when the customer moves between the Products, Cart and Payment pages.

## Running the website in VS Code

1. Open the `dry-point-website` folder in VS Code.
2. Open `index.html` with the Live Server extension, or open it directly in a browser.
3. Use the navigation links to move between pages.
4. On the Products page, click an "Add to cart" link, then open the Cart page to view the selected items.
5. On the Cart page, change the quantities and then go to the Payment page to pay.
6. Keep the folder structure unchanged so relative paths such as `css/styles.css`, `js/script.js` and `images/...` continue to work.

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

## GitHub and submission checklist

- Create a private GitHub repository using the lecturer's link.
- Commit changes with descriptive messages.
- Push the website folder to the remote repository.
- Submit the repository link.
- Submit this website folder as a compressed ZIP file.
- Submit the project proposal and README with the website package.

## Changelog

- **v1.4:** Removed the enquiry page, added a cart page and a payment page, and removed all custom styling so the site looks like the basic foundation of an HTML project.
- **v1.3:** Removed the under-construction banner and all colours, restyled the site as a basic beginner HTML page with default fonts and plain links.
- **v1.2:** Restyled the site as still under construction, replaced all buttons with interactive text links and added the under-construction banner.
- **v1.1:** Linked all pages through shared navigation, added homepage contact access, connected product buttons to the enquiry form, improved mobile navigation behaviour and documented the VS Code workflow.
- **v1.0:** Created the Dry Point six-page website structure, responsive stylesheet, JavaScript interactions, catalogue, enquiry form, contact page, sitemap and README.

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

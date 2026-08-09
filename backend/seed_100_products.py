from database.db import db
from models.product import Product

# If your Flask application file is not named app.py, change this import.
from app import app


PRODUCTS = [

    ('Apple iPhone 15', '6.1-inch smartphone with A16 Bionic chip, dual camera system and 128GB storage.', 69999, 'https://placehold.co/600x600?text=Apple+iPhone+15', 'Mobiles', 25),
    ('Apple iPhone 15 Plus', '6.7-inch smartphone with A16 Bionic chip, advanced dual cameras and 128GB storage.', 79999, 'https://placehold.co/600x600?text=Apple+iPhone+15+Plus', 'Mobiles', 18),
    ('Apple iPhone 15 Pro', 'Pro smartphone with titanium design, A17 Pro chip and 48MP main camera.', 109999, 'https://placehold.co/600x600?text=Apple+iPhone+15+Pro', 'Mobiles', 12),
    ('Apple iPhone 15 Pro Max', 'Premium smartphone with A17 Pro chip, 5x telephoto camera and large display.', 129999, 'https://placehold.co/600x600?text=Apple+iPhone+15+Pro+Max', 'Mobiles', 10),
    ('Samsung Galaxy S24', 'Flagship Android smartphone with AMOLED display, powerful processor and triple camera.', 74999, 'https://placehold.co/600x600?text=Samsung+Galaxy+S24', 'Mobiles', 20),
    ('Samsung Galaxy S24 Plus', 'Large flagship smartphone with vivid AMOLED display and all-day battery.', 89999, 'https://placehold.co/600x600?text=Samsung+Galaxy+S24+Plus', 'Mobiles', 15),
    ('Samsung Galaxy S24 Ultra', 'Premium smartphone with S Pen, high-resolution camera system and large AMOLED display.', 124999, 'https://placehold.co/600x600?text=Samsung+Galaxy+S24+Ultra', 'Mobiles', 8),
    ('Samsung Galaxy A55', 'Mid-range smartphone with Super AMOLED display, 50MP camera and 5G connectivity.', 38999, 'https://placehold.co/600x600?text=Samsung+Galaxy+A55', 'Mobiles', 30),
    ('OnePlus 12', 'High-performance 5G smartphone with AMOLED display and flagship-grade processor.', 64999, 'https://placehold.co/600x600?text=OnePlus+12', 'Mobiles', 16),
    ('OnePlus 12R', 'Performance-focused smartphone with high-refresh-rate display and large battery.', 42999, 'https://placehold.co/600x600?text=OnePlus+12R', 'Mobiles', 22),
    ('OnePlus Nord CE 4', 'Affordable 5G smartphone with fast charging, AMOLED display and large battery.', 24999, 'https://placehold.co/600x600?text=OnePlus+Nord+CE+4', 'Mobiles', 35),
    ('Google Pixel 8', 'Google smartphone with advanced computational photography and clean Android experience.', 65999, 'https://placehold.co/600x600?text=Google+Pixel+8', 'Mobiles', 14),
    ('Google Pixel 8 Pro', 'Premium Google smartphone with Pro camera controls, Tensor processor and OLED display.', 99999, 'https://placehold.co/600x600?text=Google+Pixel+8+Pro', 'Mobiles', 9),
    ('Nothing Phone 2', 'Distinctive smartphone with Glyph interface, OLED display and dual cameras.', 44999, 'https://placehold.co/600x600?text=Nothing+Phone+2', 'Mobiles', 20),
    ('Nothing Phone 2a', 'Affordable smartphone with clean design, AMOLED display and efficient performance.', 23999, 'https://placehold.co/600x600?text=Nothing+Phone+2a', 'Mobiles', 28),
    ('Xiaomi 14', 'Compact flagship smartphone with Leica camera system and high-performance processor.', 69999, 'https://placehold.co/600x600?text=Xiaomi+14', 'Mobiles', 17),
    ('Xiaomi Redmi Note 13 Pro', 'Feature-rich 5G smartphone with high-resolution camera and AMOLED display.', 28999, 'https://placehold.co/600x600?text=Xiaomi+Redmi+Note+13+Pro', 'Mobiles', 32),
    ('Realme GT 6', 'Performance smartphone with fast processor, high-refresh-rate display and fast charging.', 39999, 'https://placehold.co/600x600?text=Realme+GT+6', 'Mobiles', 21),
    ('Motorola Edge 50 Pro', 'Premium Motorola smartphone with curved display, fast charging and versatile cameras.', 31999, 'https://placehold.co/600x600?text=Motorola+Edge+50+Pro', 'Mobiles', 19),
    ('Vivo V30 Pro', 'Slim 5G smartphone with AMOLED display, portrait cameras and fast charging.', 45999, 'https://placehold.co/600x600?text=Vivo+V30+Pro', 'Mobiles', 13),
    ('Apple MacBook Air M2', 'Lightweight 13-inch laptop powered by Apple M2 chip with long battery life.', 99999, 'https://placehold.co/600x600?text=Apple+MacBook+Air+M2', 'Laptops', 12),
    ('Apple MacBook Air M3', 'Thin and light laptop with Apple M3 chip, Retina display and all-day battery.', 114999, 'https://placehold.co/600x600?text=Apple+MacBook+Air+M3', 'Laptops', 10),
    ('Apple MacBook Pro 14', 'Professional 14-inch laptop with Apple silicon, Liquid Retina XDR display and premium build.', 169999, 'https://placehold.co/600x600?text=Apple+MacBook+Pro+14', 'Laptops', 6),
    ('Dell Inspiron 14', 'Everyday 14-inch laptop with modern processor, SSD storage and full HD display.', 64999, 'https://placehold.co/600x600?text=Dell+Inspiron+14', 'Laptops', 18),
    ('Dell XPS 13', 'Premium compact laptop with high-resolution display, fast processor and slim aluminum design.', 124999, 'https://placehold.co/600x600?text=Dell+XPS+13', 'Laptops', 7),
    ('HP Pavilion 15', 'Versatile 15.6-inch laptop for productivity, study and entertainment.', 59999, 'https://placehold.co/600x600?text=HP+Pavilion+15', 'Laptops', 20),
    ('HP Envy x360', 'Convertible touchscreen laptop with premium design and flexible 360-degree hinge.', 84999, 'https://placehold.co/600x600?text=HP+Envy+x360', 'Laptops', 11),
    ('Lenovo IdeaPad Slim 5', 'Slim productivity laptop with modern processor, SSD and comfortable keyboard.', 67999, 'https://placehold.co/600x600?text=Lenovo+IdeaPad+Slim+5', 'Laptops', 16),
    ('Lenovo LOQ Gaming', 'Gaming laptop with dedicated graphics, high-refresh-rate display and powerful cooling.', 89999, 'https://placehold.co/600x600?text=Lenovo+LOQ+Gaming', 'Laptops', 9),
    ('ASUS Vivobook 15', 'Slim everyday laptop with OLED display option, SSD storage and modern connectivity.', 62999, 'https://placehold.co/600x600?text=ASUS+Vivobook+15', 'Laptops', 15),
    ('ASUS ROG Strix G16', 'Gaming laptop with high-refresh-rate display, dedicated graphics and strong cooling.', 139999, 'https://placehold.co/600x600?text=ASUS+ROG+Strix+G16', 'Laptops', 5),
    ('Acer Aspire 5', 'Practical 15.6-inch laptop for work, study and everyday computing.', 55999, 'https://placehold.co/600x600?text=Acer+Aspire+5', 'Laptops', 23),
    ('Acer Nitro V', 'Gaming laptop with dedicated graphics, fast display and performance-oriented hardware.', 79999, 'https://placehold.co/600x600?text=Acer+Nitro+V', 'Laptops', 10),
    ('MSI Modern 14', 'Compact productivity laptop with lightweight design and fast SSD storage.', 57999, 'https://placehold.co/600x600?text=MSI+Modern+14', 'Laptops', 14),
    ('MSI Katana 15', 'Gaming laptop with dedicated graphics, high-refresh display and powerful processor.', 94999, 'https://placehold.co/600x600?text=MSI+Katana+15', 'Laptops', 8),
    ('Sony WH-1000XM5', 'Premium wireless noise-cancelling over-ear headphones with rich sound and long battery life.', 29999, 'https://placehold.co/600x600?text=Sony+WH-1000XM5', 'Headphones', 15),
    ('Sony WH-CH720N', 'Lightweight wireless noise-cancelling headphones with comfortable fit and clear audio.', 9999, 'https://placehold.co/600x600?text=Sony+WH-CH720N', 'Headphones', 30),
    ('Bose QuietComfort', 'Comfort-focused wireless headphones with active noise cancellation.', 24999, 'https://placehold.co/600x600?text=Bose+QuietComfort', 'Headphones', 12),
    ('JBL Live 660NC', 'Wireless over-ear headphones with adaptive noise cancellation and strong bass.', 11999, 'https://placehold.co/600x600?text=JBL+Live+660NC', 'Headphones', 25),
    ('JBL Tune 770NC', 'Foldable wireless headphones with adaptive noise cancellation and long battery life.', 7999, 'https://placehold.co/600x600?text=JBL+Tune+770NC', 'Headphones', 32),
    ('Sennheiser Momentum 4', 'Premium wireless headphones with detailed audio and extended battery life.', 29990, 'https://placehold.co/600x600?text=Sennheiser+Momentum+4', 'Headphones', 9),
    ('Boat Rockerz 550', 'Affordable wireless over-ear headphones with deep bass and comfortable earcups.', 1999, 'https://placehold.co/600x600?text=Boat+Rockerz+550', 'Headphones', 45),
    ('Boat Nirvana 751', 'Wireless active noise-cancelling headphones designed for everyday listening.', 4499, 'https://placehold.co/600x600?text=Boat+Nirvana+751', 'Headphones', 35),
    ('Nothing Ear', 'Compact true wireless earbuds with active noise cancellation and balanced sound.', 8999, 'https://placehold.co/600x600?text=Nothing+Ear', 'Headphones', 20),
    ('OnePlus Buds 3', 'True wireless earbuds with dual drivers, noise cancellation and low-latency audio.', 5499, 'https://placehold.co/600x600?text=OnePlus+Buds+3', 'Headphones', 28),
    ('Apple Watch Series 10', 'Premium smartwatch with health features, fitness tracking and bright display.', 45999, 'https://placehold.co/600x600?text=Apple+Watch+Series+10', 'Smart Watches', 14),
    ('Apple Watch SE', 'Versatile Apple smartwatch for activity tracking, notifications and everyday use.', 29999, 'https://placehold.co/600x600?text=Apple+Watch+SE', 'Smart Watches', 20),
    ('Samsung Galaxy Watch 7', 'Advanced smartwatch with fitness tracking, health monitoring and AMOLED display.', 34999, 'https://placehold.co/600x600?text=Samsung+Galaxy+Watch+7', 'Smart Watches', 16),
    ('Samsung Galaxy Watch Ultra', 'Rugged premium smartwatch designed for fitness, outdoor activities and health tracking.', 59999, 'https://placehold.co/600x600?text=Samsung+Galaxy+Watch+Ultra', 'Smart Watches', 7),
    ('Google Pixel Watch 2', 'Smartwatch with fitness tracking, health sensors and seamless Google integration.', 34999, 'https://placehold.co/600x600?text=Google+Pixel+Watch+2', 'Smart Watches', 11),
    ('OnePlus Watch 2', 'Long-lasting smartwatch with Wear OS, health tracking and premium build.', 24999, 'https://placehold.co/600x600?text=OnePlus+Watch+2', 'Smart Watches', 18),
    ('Amazfit GTR 4', 'Fitness smartwatch with GPS, health monitoring and long battery life.', 16999, 'https://placehold.co/600x600?text=Amazfit+GTR+4', 'Smart Watches', 25),
    ('Amazfit Active', 'Slim fitness smartwatch with AMOLED display, GPS and activity tracking.', 12999, 'https://placehold.co/600x600?text=Amazfit+Active', 'Smart Watches', 22),
    ('Noise ColorFit Pro', 'Affordable smartwatch with large display, fitness features and health tracking.', 3999, 'https://placehold.co/600x600?text=Noise+ColorFit+Pro', 'Smart Watches', 40),
    ('Fire-Boltt Phoenix', 'Budget smartwatch with calling support, fitness tracking and large display.', 2499, 'https://placehold.co/600x600?text=Fire-Boltt+Phoenix', 'Smart Watches', 45),
    ('Apple iPad 10th Gen', 'Versatile tablet with large Liquid Retina display and USB-C connectivity.', 39999, 'https://placehold.co/600x600?text=Apple+iPad+10th+Gen', 'Tablets', 18),
    ('Apple iPad Air M2', 'Powerful tablet with Apple M2 chip, vibrant display and support for productivity accessories.', 59999, 'https://placehold.co/600x600?text=Apple+iPad+Air+M2', 'Tablets', 10),
    ('Apple iPad Pro M4', 'Professional tablet with advanced Apple silicon, premium display and high performance.', 99999, 'https://placehold.co/600x600?text=Apple+iPad+Pro+M4', 'Tablets', 5),
    ('Samsung Galaxy Tab S9', 'Premium Android tablet with AMOLED display, S Pen support and strong performance.', 74999, 'https://placehold.co/600x600?text=Samsung+Galaxy+Tab+S9', 'Tablets', 9),
    ('Samsung Galaxy Tab S9 FE', 'Mid-range tablet with large display, S Pen support and durable design.', 44999, 'https://placehold.co/600x600?text=Samsung+Galaxy+Tab+S9+FE', 'Tablets', 15),
    ('OnePlus Pad 2', 'High-performance Android tablet with large display and productivity-focused features.', 39999, 'https://placehold.co/600x600?text=OnePlus+Pad+2', 'Tablets', 14),
    ('Lenovo Tab P12', 'Large-screen tablet for entertainment, study and everyday productivity.', 29999, 'https://placehold.co/600x600?text=Lenovo+Tab+P12', 'Tablets', 20),
    ('Xiaomi Pad 6', 'Performance-focused tablet with high-resolution display and fast processor.', 29999, 'https://placehold.co/600x600?text=Xiaomi+Pad+6', 'Tablets', 23),
    ('Realme Pad 2', 'Affordable tablet with large high-refresh-rate display and long battery life.', 22999, 'https://placehold.co/600x600?text=Realme+Pad+2', 'Tablets', 27),
    ('Redmi Pad SE', 'Budget-friendly tablet with large display, stereo speakers and reliable battery life.', 14999, 'https://placehold.co/600x600?text=Redmi+Pad+SE', 'Tablets', 35),
    ('Sony Bravia 55 4K', '55-inch 4K smart TV with vivid picture quality and smart streaming features.', 84999, 'https://placehold.co/600x600?text=Sony+Bravia+55+4K', 'TVs', 8),
    ('Sony Bravia 65 4K', '65-inch 4K smart TV with advanced picture processing and immersive sound support.', 124999, 'https://placehold.co/600x600?text=Sony+Bravia+65+4K', 'TVs', 5),
    ('Samsung Crystal 55 4K', '55-inch 4K smart TV with slim design, smart apps and vivid colors.', 54999, 'https://placehold.co/600x600?text=Samsung+Crystal+55+4K', 'TVs', 12),
    ('Samsung Neo QLED 65', 'Premium 65-inch QLED TV with high contrast, smart features and immersive visuals.', 149999, 'https://placehold.co/600x600?text=Samsung+Neo+QLED+65', 'TVs', 4),
    ('LG OLED C4 55', '55-inch OLED smart TV with deep blacks, vivid colors and gaming features.', 139999, 'https://placehold.co/600x600?text=LG+OLED+C4+55', 'TVs', 6),
    ('LG UHD 50 4K', '50-inch 4K smart TV with webOS, HDR support and versatile streaming options.', 44999, 'https://placehold.co/600x600?text=LG+UHD+50+4K', 'TVs', 15),
    ('OnePlus 55 Q1', '55-inch smart TV with 4K resolution, smart streaming and cinematic display.', 49999, 'https://placehold.co/600x600?text=OnePlus+55+Q1', 'TVs', 10),
    ('TCL C655 55', '55-inch QLED smart TV with 4K resolution and enhanced color reproduction.', 42999, 'https://placehold.co/600x600?text=TCL+C655+55', 'TVs', 18),
    ('Hisense 55 4K', '55-inch 4K smart TV with HDR support and built-in streaming applications.', 38999, 'https://placehold.co/600x600?text=Hisense+55+4K', 'TVs', 20),
    ('Acer Advanced I Series 43', '43-inch 4K smart TV with streaming apps and compact living-room design.', 29999, 'https://placehold.co/600x600?text=Acer+Advanced+I+Series+43', 'TVs', 22),
    ('Canon EOS R50', 'Compact mirrorless camera with interchangeable lenses and 4K video recording.', 69999, 'https://placehold.co/600x600?text=Canon+EOS+R50', 'Cameras', 10),
    ('Canon EOS R10', 'APS-C mirrorless camera with fast autofocus, burst shooting and 4K video.', 89999, 'https://placehold.co/600x600?text=Canon+EOS+R10', 'Cameras', 7),
    ('Nikon Z50', 'Compact mirrorless camera with APS-C sensor, fast autofocus and 4K video.', 84999, 'https://placehold.co/600x600?text=Nikon+Z50', 'Cameras', 6),
    ('Nikon Z5', 'Full-frame mirrorless camera designed for photography and high-quality video.', 119999, 'https://placehold.co/600x600?text=Nikon+Z5', 'Cameras', 5),
    ('Sony Alpha A6400', 'APS-C mirrorless camera with fast autofocus, compact body and 4K video.', 79999, 'https://placehold.co/600x600?text=Sony+Alpha+A6400', 'Cameras', 9),
    ('Sony Alpha A7 III', 'Full-frame mirrorless camera with excellent low-light performance and 4K video.', 139999, 'https://placehold.co/600x600?text=Sony+Alpha+A7+III', 'Cameras', 4),
    ('GoPro HERO12 Black', 'Action camera with stabilized 5.3K video, rugged design and versatile shooting modes.', 39999, 'https://placehold.co/600x600?text=GoPro+HERO12+Black', 'Cameras', 13),
    ('DJI Osmo Action 4', 'Rugged action camera with high-quality video, stabilization and waterproof design.', 34999, 'https://placehold.co/600x600?text=DJI+Osmo+Action+4', 'Cameras', 11),
    ('Fujifilm X-S20', 'Hybrid mirrorless camera with strong autofocus, stabilization and high-quality video.', 119999, 'https://placehold.co/600x600?text=Fujifilm+X-S20', 'Cameras', 5),
    ('Insta360 X4', '360-degree action camera capable of high-resolution immersive video and photos.', 49999, 'https://placehold.co/600x600?text=Insta360+X4', 'Cameras', 12),
    ('Apple MagSafe Charger', 'Wireless magnetic charger designed for compatible Apple devices.', 4499, 'https://placehold.co/600x600?text=Apple+MagSafe+Charger', 'Accessories', 40),
    ('Apple 20W USB-C Adapter', 'Compact 20W USB-C power adapter for fast and convenient charging.', 1999, 'https://placehold.co/600x600?text=Apple+20W+USB-C+Adapter', 'Accessories', 50),
    ('Samsung 45W Charger', 'High-speed USB-C charger for compatible Samsung and other USB-C devices.', 3499, 'https://placehold.co/600x600?text=Samsung+45W+Charger', 'Accessories', 35),
    ('OnePlus 100W Charger', 'High-power fast charger designed for compatible OnePlus devices and USB-C products.', 2999, 'https://placehold.co/600x600?text=OnePlus+100W+Charger', 'Accessories', 30),
    ('Anker Power Bank 20000mAh', 'High-capacity portable power bank with multiple charging ports.', 3999, 'https://placehold.co/600x600?text=Anker+Power+Bank+20000mAh', 'Accessories', 25),
    ('Mi Power Bank 10000mAh', 'Compact portable power bank for phones, tablets and other USB devices.', 1299, 'https://placehold.co/600x600?text=Mi+Power+Bank+10000mAh', 'Accessories', 50),
    ('SanDisk 128GB USB Drive', 'Compact USB flash drive for portable file storage and transfer.', 999, 'https://placehold.co/600x600?text=SanDisk+128GB+USB+Drive', 'Accessories', 60),
    ('Samsung 256GB microSD', 'High-capacity microSD card for smartphones, tablets and cameras.', 1999, 'https://placehold.co/600x600?text=Samsung+256GB+microSD', 'Accessories', 45),
    ('Logitech MX Master 3S', 'Premium wireless mouse with precision tracking and ergonomic design.', 8999, 'https://placehold.co/600x600?text=Logitech+MX+Master+3S', 'Accessories', 18),
    ('Logitech K380 Keyboard', 'Compact Bluetooth keyboard designed for multi-device productivity.', 2999, 'https://placehold.co/600x600?text=Logitech+K380+Keyboard', 'Accessories', 35),
    ('HP Wireless Mouse', 'Comfortable wireless mouse for everyday office and home computing.', 999, 'https://placehold.co/600x600?text=HP+Wireless+Mouse', 'Accessories', 50),
    ('Dell USB-C Hub', 'Multi-port USB-C hub with display, USB and connectivity expansion.', 3499, 'https://placehold.co/600x600?text=Dell+USB-C+Hub', 'Accessories', 25),
    ('Amazon Basics Laptop Stand', 'Adjustable laptop stand designed to improve desk ergonomics and airflow.', 1499, 'https://placehold.co/600x600?text=Amazon+Basics+Laptop+Stand', 'Accessories', 40),
    ('Portronics USB-C Cable', 'Durable USB-C charging and data cable for compatible devices.', 699, 'https://placehold.co/600x600?text=Portronics+USB-C+Cable', 'Accessories', 70),
    ('Spigen Phone Case', 'Protective smartphone case with shock absorption and raised edge protection.', 1299, 'https://placehold.co/600x600?text=Spigen+Phone+Case', 'Accessories', 55),
]

with app.app_context():

    existing_names = {
        name for (name,) in db.session.query(Product.name).all()
    }

    new_products = []

    for name, description, price, image, category, stock in PRODUCTS:

        if name in existing_names:
            print(f"SKIPPED: {name}")
            continue

        new_products.append(
            Product(
                name=name,
                description=description,
                price=price,
                image=image,
                category=category,
                stock=stock
            )
        )

    if new_products:
        db.session.add_all(new_products)
        db.session.commit()

    total = Product.query.count()

    print()
    print("=" * 50)
    print(f"NEW PRODUCTS INSERTED : {len(new_products)}")
    print(f"TOTAL PRODUCTS        : {total}")
    print("=" * 50)

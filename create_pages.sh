#!/bin/bash

# Create services directory if it doesn't exist
mkdir -p src/pages/services

# Create accounts.astro
cat > src/pages/services/accounts.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Accounts & Bookkeeping Services - JCS">
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-6">Accounts & Bookkeeping Services</h1>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">What We Offer</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Monthly bookkeeping and accounting</li>
        <li>Financial statement preparation</li>
        <li>Accounts payable/receivable management</li>
        <li>Bank reconciliation</li>
        <li>GST filing and compliance</li>
        <li>TDS returns and compliance</li>
      </ul>
    </section>

    <a href="/contact" class="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700">
      Get Started
    </a>
  </main>
</Layout>
EOF

# Create hr.astro
cat > src/pages/services/hr.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="HR & Payroll Services - JCS">
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-6">HR & Payroll Services</h1>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">What We Offer</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Payroll processing and management</li>
        <li>Employee onboarding and offboarding</li>
        <li>PF, ESI, and labor law compliance</li>
        <li>HR policy development</li>
      </ul>
    </section>

    <a href="/contact" class="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700">
      Get Started
    </a>
  </main>
</Layout>
EOF

# Create legal.astro
cat > src/pages/services/legal.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Legal & Compliance Services - JCS">
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-6">Legal & Compliance Services</h1>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">What We Offer</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Company registration and incorporation</li>
        <li>GST, PAN, TAN registration</li>
        <li>MSME/Udyam registration</li>
        <li>Legal compliance audits</li>
      </ul>
    </section>

    <a href="/contact" class="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700">
      Get Started
    </a>
  </main>
</Layout>
EOF

# Create hospitality.astro
cat > src/pages/services/hospitality.astro << 'EOF'
---
import Layout from '../../layouts/Layout.astro';
---

<Layout title="Hospitality Staffing Services - JCS">
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-6">Hospitality Staffing Services</h1>
    
    <section class="mb-8">
      <h2 class="text-2xl font-semibold mb-4">What We Offer</h2>
      <ul class="list-disc list-inside space-y-2">
        <li>Housekeeping staff placement</li>
        <li>Office support staff</li>
        <li>Temporary and permanent staffing</li>
        <li>Background verification</li>
      </ul>
    </section>

    <a href="/contact" class="bg-blue-600 text-white px-6 py-3 rounded-lg inline-block hover:bg-blue-700">
      Get Started
    </a>
  </main>
</Layout>
EOF

# Create contact.astro
cat > src/pages/contact.astro << 'EOF'
---
import Layout from '../layouts/Layout.astro';
---

<Layout title="Contact Us - JCS">
  <main class="container mx-auto px-4 py-16">
    <h1 class="text-4xl font-bold mb-6 text-center">Get In Touch</h1>
    
    <div class="max-w-2xl mx-auto">
      <form class="space-y-6" action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
        <div>
          <label for="name" class="block text-sm font-medium mb-2">Name</label>
          <input type="text" id="name" name="name" required class="w-full px-4 py-2 border rounded-lg">
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium mb-2">Email</label>
          <input type="email" id="email" name="email" required class="w-full px-4 py-2 border rounded-lg">
        </div>
        
        <div>
          <label for="service" class="block text-sm font-medium mb-2">Service</label>
          <select id="service" name="service" class="w-full px-4 py-2 border rounded-lg">
            <option>Accounts & Bookkeeping</option>
            <option>HR & Payroll</option>
            <option>Legal & Compliance</option>
            <option>Hospitality Staffing</option>
          </select>
        </div>
        
        <div>
          <label for="message" class="block text-sm font-medium mb-2">Message</label>
          <textarea id="message" name="message" rows="5" required class="w-full px-4 py-2 border rounded-lg"></textarea>
        </div>
        
        <button type="submit" class="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
          Send Message
        </button>
      </form>
    </div>
  </main>
</Layout>
EOF

echo "✅ All pages created successfully!"


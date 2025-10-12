(function() {
  let popupShown = false;
  if (sessionStorage.getItem('jcs_popup_shown')) return;

  const popupHTML = '<div id="jcsExitPopup" class="jcs-exit-popup"><div class="jcs-popup-overlay"></div><div class="jcs-popup-content"><button class="jcs-popup-close">&times;</button><div class="jcs-popup-body"><div class="jcs-popup-icon">📄</div><h2 class="jcs-popup-title">Wait! Before You Go...</h2><p class="jcs-popup-subtitle">Get Our FREE Compliance Resources</p><div class="jcs-popup-benefits"><div class="benefit-item">✓ GST Filing Checklist 2025</div><div class="benefit-item">✓ Payroll Setup Guide</div><div class="benefit-item">✓ Tax Saving Tips</div></div><form id="jcsPopupForm" class="jcs-popup-form"><input type="text" id="popupName" placeholder="Your Name" required class="jcs-input"/><input type="email" id="popupEmail" placeholder="Your Email" required class="jcs-input"/><input type="tel" id="popupPhone" placeholder="Phone (Optional)" class="jcs-input"/><button type="submit" class="jcs-submit-btn">Send Me Free Resources 🚀</button></form><p class="jcs-popup-note">🔒 We respect your privacy</p></div></div></div><style>.jcs-exit-popup{position:fixed;top:0;left:0;width:100%;height:100%;z-index:99999;display:none;animation:jcsFadeIn 0.3s}.jcs-exit-popup.show{display:flex;align-items:center;justify-content:center}@keyframes jcsFadeIn{from{opacity:0}to{opacity:1}}.jcs-popup-overlay{position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.7);backdrop-filter:blur(5px)}.jcs-popup-content{position:relative;background:white;max-width:500px;width:90%;border-radius:20px;box-shadow:0 20px 60px rgba(0,0,0,0.3);animation:jcsSlideUp 0.4s;max-height:90vh;overflow-y:auto}@keyframes jcsSlideUp{from{opacity:0;transform:translateY(50px) scale(0.9)}to{opacity:1;transform:translateY(0) scale(1)}}.jcs-popup-close{position:absolute;top:15px;right:15px;width:40px;height:40px;border:none;background:rgba(0,0,0,0.05);border-radius:50%;font-size:28px;cursor:pointer;color:#64748b;transition:all 0.3s;z-index:10}.jcs-popup-close:hover{background:rgba(0,0,0,0.1);transform:rotate(90deg)}.jcs-popup-body{padding:3rem 2.5rem;text-align:center}.jcs-popup-icon{font-size:4rem;margin-bottom:1rem}.jcs-popup-title{font-size:2rem;font-weight:800;color:#1e40af;margin-bottom:0.5rem}.jcs-popup-subtitle{font-size:1.2rem;color:#64748b;margin-bottom:2rem;font-weight:600}.jcs-popup-benefits{background:linear-gradient(135deg,#f0f9ff,#e0f2fe);border-radius:12px;padding:1.5rem;margin-bottom:2rem;text-align:left}.benefit-item{padding:0.75rem 0;font-size:1rem;color:#1e293b;font-weight:600;border-bottom:1px solid rgba(59,130,246,0.2)}.benefit-item:last-child{border-bottom:none}.jcs-popup-form{display:flex;flex-direction:column;gap:1rem}.jcs-input{padding:1rem;border:2px solid #e2e8f0;border-radius:8px;font-size:1rem;transition:all 0.3s;font-family:inherit}.jcs-input:focus{outline:none;border-color:#3b82f6;box-shadow:0 0 0 3px rgba(59,130,246,0.1)}.jcs-submit-btn{padding:1.2rem;background:linear-gradient(135deg,#3b82f6,#1e40af);color:white;border:none;border-radius:8px;font-size:1.1rem;font-weight:700;cursor:pointer;transition:all 0.3s}.jcs-submit-btn:hover{transform:translateY(-2px);box-shadow:0 10px 25px rgba(59,130,246,0.3)}.jcs-popup-note{margin-top:1.5rem;font-size:0.85rem;color:#64748b}@media (max-width:640px){.jcs-popup-content{width:95%;border-radius:15px}.jcs-popup-body{padding:2rem 1.5rem}.jcs-popup-title{font-size:1.5rem}}</style>';

  document.body.insertAdjacentHTML('beforeend', popupHTML);
  const popup = document.getElementById('jcsExitPopup');

  function closePopup() {
    popup.classList.remove('show');
    sessionStorage.setItem('jcs_popup_shown', 'true');
  }

  popup.querySelector('.jcs-popup-close').addEventListener('click', closePopup);
  popup.querySelector('.jcs-popup-overlay').addEventListener('click', closePopup);
  document.addEventListener('keydown', (e) => e.key === 'Escape' && closePopup());

  let mouseY = 0;
  document.addEventListener('mousemove', (e) => mouseY = e.clientY);
  document.addEventListener('mouseout', (e) => {
    if (e.clientY < 10 && mouseY > 10 && !popupShown) {
      popup.classList.add('show');
      popupShown = true;
    }
  });

  setTimeout(() => {
    if (!popupShown && !sessionStorage.getItem('jcs_popup_shown')) {
      popup.classList.add('show');
      popupShown = true;
    }
  }, 30000);

  document.getElementById('jcsPopupForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('popupName').value;
    const email = document.getElementById('popupEmail').value;
    const phone = document.getElementById('popupPhone').value;
    
    popup.querySelector('.jcs-popup-body').innerHTML = '<div style="padding:3rem 2rem;text-align:center"><div style="font-size:5rem;margin-bottom:1rem">✅</div><h2 style="font-size:2rem;font-weight:800;color:#10b981;margin-bottom:1rem">Thank You!</h2><p style="font-size:1.1rem;color:#64748b;margin-bottom:2rem">We sent the resources to <strong>' + email + '</strong><br><br>Check your inbox!<br><br>Our team will contact you within 24 hours.</p><button onclick="document.getElementById(\'jcsExitPopup\').classList.remove(\'show\')" style="padding:1rem 2rem;background:#10b981;color:white;border:none;border-radius:8px;font-weight:700;cursor:pointer">Got It!</button></div>';
    
    console.log('Lead captured:', {name, email, phone});
    sessionStorage.setItem('jcs_popup_shown', 'true');
  });
})();

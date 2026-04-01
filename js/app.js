/* ============================================
   XYZ Insurance Quote Page — Application Logic
   Personalisation Engine + UI Rendering
   ============================================ */

(function () {
  'use strict';

  let currentScenario = null;
  let selectedPlanId = null;
  let isDefaultView = false;
  let assistantMode = 'tia';    // 'tia', 'advisor-priya', 'advisor-rahul'
  let nameMode = 'no-name';     // 'no-name', 'name'
  let customerName = localStorage.getItem('customer_name') || '';

  // ── Voice Call State ──

  // ── DOM References ──
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // ── Customer email (captured at gate) ──
  let customerEmail = localStorage.getItem('customer_email') || '';

  // ── Initialise ──
  function init() {
    // Email gate logic
    const gate = $('#email-gate');
    const gateForm = $('#email-gate-form');
    if (gate && gateForm) {
      // If email already captured, skip the gate
      if (customerEmail) {
        gate.classList.add('hidden');
        setTimeout(() => gate.remove(), 500);
        // Activate name mode if name exists
        if (customerName) nameMode = 'name';
      } else {
        gateForm.addEventListener('submit', (e) => {
          e.preventDefault();
          const nameInput = $('#customer-name');
          const emailInput = $('#customer-email');
          if (emailInput && emailInput.value) {
            customerEmail = emailInput.value.trim();
            localStorage.setItem('customer_email', customerEmail);
            if (nameInput && nameInput.value) {
              customerName = nameInput.value.trim();
              localStorage.setItem('customer_name', customerName);
              nameMode = 'name';
            }
            gate.classList.add('hidden');
            setTimeout(() => gate.remove(), 500);
          }
        });
      }
    }

    // CRITICAL: Register help button handler FIRST (before anything that might throw)
    if ($('#help-btn')) {
      $('#help-btn').addEventListener('click', startVoiceCall);
    }

    const urlParams = new URLSearchParams(window.location.search);

    // Apply scenario only if ?s= is explicitly set (post-call personalisation)
    // Otherwise show default non-personalised view
    const sParam = urlParams.get('s');
    if (sParam) {
      const scenarioId = parseInt(sParam) || 20;
      if ($('#scenario-selector')) $('#scenario-selector').value = scenarioId;
      applyScenario(scenarioId);
    } else {
      applyDefault();
    }

    // Demo bar controls (safe — null-checked)
    if ($('#scenario-selector')) {
      $('#scenario-selector').addEventListener('change', (e) => {
        const val = parseInt(e.target.value);
        if (val === 0) {
          isDefaultView = true;
          applyDefault();
        } else {
          isDefaultView = false;
          if ($('#toggle-default')) {
            $('#toggle-default').classList.remove('active');
            $('#toggle-default').textContent = 'Show Default';
          }
          applyScenario(val);
        }
      });
    }

    if ($('#toggle-default')) {
      $('#toggle-default').addEventListener('click', () => {
        isDefaultView = !isDefaultView;
        const btn = $('#toggle-default');
        if (isDefaultView) {
          btn.classList.add('active');
          btn.textContent = 'Show Personalised';
          applyDefault();
        } else {
          btn.classList.remove('active');
          btn.textContent = 'Show Default';
          applyScenario(parseInt($('#scenario-selector').value));
        }
      });
    }

    // SI selector
    $$('.si-option').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.si-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Tenure toggle
    $$('.tenure-option').forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.tenure-option').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });

    // Cost converter tabs
    document.addEventListener('click', (e) => {
      if (e.target.classList.contains('conv-tab')) {
        $$('.conv-tab').forEach(t => t.classList.remove('active'));
        e.target.classList.add('active');
        updateCostConverter(e.target.dataset.period);
      }
    });

    // Assistant mode selector
    if ($('#assistant-mode')) {
      $('#assistant-mode').addEventListener('change', (e) => {
        assistantMode = e.target.value;
        updateAssistantAvatar();
        reapplyGreeting();
      });
    }

    // Name mode selector
    if ($('#name-mode')) {
      $('#name-mode').addEventListener('change', (e) => {
        nameMode = e.target.value;
        reapplyGreeting();
      });
    }

    // Initial avatar setup
    updateAssistantAvatar();
  }

  // ── Voice Call with TIA ──
  // Opens call.html in a new tab with the Daily room params from URL.

  function startVoiceCall() {
    const urlParams = new URLSearchParams(window.location.search);
    const room = urlParams.get('room');
    const token = urlParams.get('token');

    if (!room || !token) {
      alert(
        'To talk to TIA, start the bot first:\n\n' +
        '1. Run: python bot.py (in WSL)\n' +
        '2. Copy the URL it prints\n' +
        '3. Open that URL in your browser\n' +
        '4. Click "Need Help?" to start the call'
      );
      return;
    }

    // Clear any previous scenario from localStorage
    localStorage.removeItem('tia_scenario');

    // Open the call page in a new tab (pass email for bot to send quote)
    const callUrl = new URL('call.html', window.location.href);
    callUrl.searchParams.set('room', room);
    callUrl.searchParams.set('token', token);
    if (customerEmail) callUrl.searchParams.set('email', customerEmail);
    if (customerName) callUrl.searchParams.set('name', customerName);
    window.open(callUrl.toString(), '_blank');
  }

  // ── Listen for scenario updates from call tab (via localStorage) ──
  function applyScenarioFromData(data) {
    // Update customer name if bot captured it and we don't have one yet
    if (data.customer_name && !customerName) {
      customerName = data.customer_name;
      localStorage.setItem('customer_name', customerName);
      nameMode = 'name';
    }
    applyScenario(data.scenario_id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.addEventListener('storage', (e) => {
    if (e.key === 'tia_scenario' && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        if (data.scenario_id) {
          console.log('Scenario received from call tab:', data);
          applyScenarioFromData(data);
          localStorage.removeItem('tia_scenario');
        }
      } catch (err) {
        console.error('Failed to parse scenario data:', err);
      }
    }
  });

  // Also check when user switches back to this tab
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      const raw = localStorage.getItem('tia_scenario');
      if (raw) {
        try {
          const data = JSON.parse(raw);
          if (data.scenario_id) {
            applyScenarioFromData(data);
            localStorage.removeItem('tia_scenario');
          }
        } catch (err) { /* ignore */ }
      }
    }
  });

  // Run init immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // ── Apply Default (non-personalised) View ──
  function applyDefault() {
    // Header
    $('#tia-text').textContent = personaliseGreeting('Your personalised quote is ready!');
    $('#help-btn-text').textContent = 'Need Help?';

    // Hide all banners
    hideElement('scenario-banner');
    hideElement('referral-banner');
    hideElement('resumption-banner');

    // Policy config defaults
    $('#policy-for-text').textContent = 'Self - 400001';
    setSISelector('15');
    setTenureToggle('1');
    $('#tenure-badge').style.display = 'none';
    $('#find-value-link').textContent = 'Find Right Value';

    // Render default plan cards
    renderPlanCards(['select', 'premier', 'plus'], {
      preSelectedPlan: 'premier',
      recommendedBadgePlan: 'premier',
      planCardBadges: { select: 'Base Plan' },
      discountBadge: { text: '27% Off', percentage: 27 },
      featurePriority: [],
      priceDisplay: 'annual',
      planTaglines: {}
    });

    // Zone 4
    $('#comparison-link').style.display = '';
    hideElement('comparison-fatigue-banner');

    // Zone 5
    $('#decide-title').textContent = 'Unable to decide?';
    showDefaultDecideOptions();
    hideElement('trust-signals');

    // Zone 6
    $('#hospital-title').textContent = 'XYZ Insurance Network Hospitals - 400001';
    $('#view-all-hospitals').textContent = 'View all 180+ hospitals';

    // Zone 7
    $('#extra-discounts-text').textContent = 'To view Extra discounts - Check now';
    $('#cta-text').textContent = 'Proceed to optional covers';

    // Hide all Zone 8 elements
    hideAllZone8();

    // Remove lite mode
    document.body.classList.remove('lite-mode');
  }

  // ── Apply Scenario ──
  function applyScenario(id) {
    const sc = SCENARIOS[id];
    if (!sc) return;
    currentScenario = sc;

    // Lite mode for scenario 28
    if (sc.liteMode) {
      document.body.classList.add('lite-mode');
    } else {
      document.body.classList.remove('lite-mode');
    }

    // Zone 1: TIA greeting + Help button
    $('#tia-text').textContent = personaliseGreeting(sc.tiaGreeting);
    $('#help-btn-text').textContent = sc.helpButtonText;

    // Scenario banner
    if (sc.scenarioBanner) {
      const banner = $('#scenario-banner');
      banner.style.display = '';
      banner.className = 'scenario-banner';
      if (sc.scenarioBanner.bgColor && sc.scenarioBanner.bgColor !== 'blue') {
        banner.classList.add('bg-' + sc.scenarioBanner.bgColor);
      }
      $('#banner-headline').textContent = sc.scenarioBanner.headline;
      $('#banner-body').textContent = sc.scenarioBanner.body;
    } else {
      hideElement('scenario-banner');
    }

    // Referral banner (Zone 8)
    if (sc.newElements.includes('referralBanner') && sc.referralText) {
      $('#referral-banner').style.display = '';
      $('#referral-text').textContent = sc.referralText;
    } else {
      hideElement('referral-banner');
    }

    // Resumption banner (Zone 8)
    if (sc.newElements.includes('resumptionBanner')) {
      $('#resumption-banner').style.display = '';
    } else {
      hideElement('resumption-banner');
    }

    // Zone 2: Policy config
    if (sc.policyFor) {
      $('#policy-for-text').textContent = sc.policyFor;
    } else {
      $('#policy-for-text').textContent = 'Self - 400001';
    }

    setSISelector(sc.sumInsured);
    setTenureToggle(sc.policyTenure);

    if (sc.tenureBadge) {
      $('#tenure-badge').style.display = '';
      $('#tenure-badge').textContent = sc.tenureBadge;
    } else {
      $('#tenure-badge').style.display = 'none';
    }

    // Find value link personalisation
    if (sc.scenarioId === 5 || sc.scenarioId === 7 || sc.scenarioId === 22) {
      $('#find-value-link').textContent = 'See why this SI works for you';
    } else {
      $('#find-value-link').textContent = 'Find Right Value';
    }

    // Zone 3: Plan cards
    renderPlanCards(sc.recommendedPlans, sc);

    // Zone 4: Comparison link
    if (sc.hideComparison) {
      $('#comparison-link').style.display = 'none';
      $('#comparison-fatigue-banner').style.display = '';
      $('#fatigue-plan-name').textContent = PLANS[sc.preSelectedPlan].name;
    } else {
      $('#comparison-link').style.display = '';
      hideElement('comparison-fatigue-banner');
    }

    // Zone 5: Social proof
    renderSocialProof(sc);

    // Zone 6: Hospital network
    if (sc.hospitalTitle) {
      $('#hospital-title').textContent = sc.hospitalTitle;
    } else {
      $('#hospital-title').textContent = 'XYZ Insurance Network Hospitals - 400001';
    }
    const count = sc.hospitalCount || '180+';
    const city = sc.hospitalTitle ? sc.hospitalTitle.split(' - ')[1] : 'your area';
    $('#view-all-hospitals').textContent = `View all ${count} hospitals near ${city}`;

    // Zone 7: Footer
    renderFooter(sc);

    // Zone 8: New personalisation elements
    renderZone8(sc);
  }

  // ── Render Plan Cards ──
  function renderPlanCards(planIds, config) {
    const container = $('#plan-cards-container');
    container.innerHTML = '';
    container.classList.toggle('three-plans', planIds.length >= 3);

    selectedPlanId = config.preSelectedPlan;

    planIds.forEach((planId, index) => {
      const plan = PLANS[planId];
      if (!plan) return;

      const isRecommended = planId === config.recommendedBadgePlan;
      const isSelected = planId === config.preSelectedPlan;

      const card = document.createElement('div');
      card.className = 'plan-card' + (isRecommended ? ' recommended' : '') + (isSelected ? ' selected' : '');
      card.dataset.planId = planId;

      // Badges
      let badgesHtml = '<div class="plan-badge-row">';
      if (isRecommended) {
        badgesHtml += '<span class="plan-badge recommended-badge">Recommended</span>';
      }
      if (config.planCardBadges && config.planCardBadges[planId]) {
        const badgeText = config.planCardBadges[planId];
        if (badgeText.toLowerCase() !== 'recommended') {
          let badgeClass = 'custom-badge';
          if (badgeText.toLowerCase().includes('base')) badgeClass = 'base-badge';
          if (badgeText.toLowerCase().includes('discount') || badgeText.toLowerCase().includes('off') || badgeText.toLowerCase().includes('value')) badgeClass = 'discount-badge';
          badgesHtml += '<span class="plan-badge ' + badgeClass + '">' + badgeText + '</span>';
        }
      }
      if (config.discountBadge && (index === 0 || planId === config.preSelectedPlan)) {
        badgesHtml += '<span class="plan-badge discount-badge">' + config.discountBadge.text + '</span>';
      }
      badgesHtml += '</div>';

      // Tagline
      const tagline = (config.planTaglines && config.planTaglines[planId]) || plan.defaultTagline;

      // Pricing
      const price = plan.basePrice;
      const origPrice = plan.originalPrice;
      let priceHtml = '';
      let altPriceHtml = '';

      if (origPrice > price) {
        priceHtml += `<span class="plan-original-price">₹${origPrice.toLocaleString('en-IN')}</span>`;
      }

      if (config.priceDisplay === 'daily') {
        const daily = Math.round(price / 365);
        priceHtml += `<span class="plan-price">₹${daily}</span>`;
        priceHtml += `<span class="plan-price-period">/day</span>`;
        altPriceHtml = `<span class="plan-price-alt">₹${price.toLocaleString('en-IN')}/yr</span>`;
      } else if (config.priceDisplay === 'monthly') {
        const monthly = Math.round(price / 12);
        priceHtml += `<span class="plan-price">₹${monthly.toLocaleString('en-IN')}</span>`;
        priceHtml += `<span class="plan-price-period">/month</span>`;
        altPriceHtml = `<span class="plan-price-alt">₹${price.toLocaleString('en-IN')}/yr</span>`;
      } else {
        priceHtml += `<span class="plan-price">₹${price.toLocaleString('en-IN')}</span>`;
        priceHtml += `<span class="plan-price-period">/year</span>`;
      }
      priceHtml += '<span class="plan-gst">incl. 0% GST</span>';

      // Features — reorder based on priority
      let features = [...plan.features];
      if (config.featurePriority && config.featurePriority.length > 0) {
        const prioritised = [];
        const rest = [];
        config.featurePriority.forEach(f => {
          const idx = features.findIndex(feat => feat && feat.toLowerCase().includes(f.toLowerCase().substring(0, 20)));
          if (idx !== -1) {
            prioritised.push(features[idx]);
            features[idx] = null;
          }
        });
        features.forEach(f => { if (f) rest.push(f); });
        features = [...prioritised, ...rest];
      }

      // Show top 3 on mobile by default
      const visibleFeatures = features.slice(0, 3);
      const hiddenFeatures = features.slice(3);

      let featuresHtml = '<div class="plan-features">';
      visibleFeatures.forEach(f => {
        featuresHtml += `
          <div class="feature-item">
            <span class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span>
            <span>${f}</span>
          </div>`;
      });
      hiddenFeatures.forEach(f => {
        featuresHtml += `
          <div class="feature-item feature-hidden" style="display:none;">
            <span class="feature-check"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span>
            <span>${f}</span>
          </div>`;
      });
      featuresHtml += '</div>';

      const viewBenefitsId = `view-benefits-${planId}`;

      card.innerHTML = `
        ${badgesHtml}
        <div class="plan-header">
          <div class="plan-name">${plan.name}</div>
          <div class="plan-tagline">${tagline}</div>
        </div>
        <div class="plan-pricing">
          ${priceHtml}
          ${altPriceHtml}
        </div>
        ${featuresHtml}
        <a href="#" class="view-benefits" id="${viewBenefitsId}" data-expanded="false">View all benefits ▾</a>
        <div class="plan-select" data-plan="${planId}">
          <div class="plan-radio"><div class="plan-radio-inner"></div></div>
          <span class="plan-select-text">${isSelected ? 'Selected' : 'Select this plan'}</span>
        </div>
      `;

      container.appendChild(card);
    });

    // Plan selection — whole card is clickable
    $$('.plan-card').forEach(card => {
      card.addEventListener('click', (e) => {
        // Don't select if clicking a link (View benefits, etc.)
        if (e.target.closest('a')) return;
        const planId = card.dataset.planId;
        selectPlan(planId);
      });
    });

    // View benefits toggle
    $$('.view-benefits').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const card = link.closest('.plan-card');
        const hiddenItems = card.querySelectorAll('.feature-hidden');
        const isExpanded = link.dataset.expanded === 'true';

        hiddenItems.forEach(item => {
          item.style.display = isExpanded ? 'none' : '';
        });

        link.dataset.expanded = isExpanded ? 'false' : 'true';
        link.textContent = isExpanded ? 'View all benefits ▾' : 'Show less ▴';
      });
    });

    // Update footer amount
    updateFooterPrice();
  }

  function selectPlan(planId) {
    selectedPlanId = planId;
    $$('.plan-card').forEach(card => {
      const isSelected = card.dataset.planId === planId;
      card.classList.toggle('selected', isSelected);
      const text = card.querySelector('.plan-select-text');
      if (text) text.textContent = isSelected ? 'Selected' : 'Select this plan';
    });
    updateFooterPrice();
  }

  function updateFooterPrice() {
    if (selectedPlanId && PLANS[selectedPlanId]) {
      const price = PLANS[selectedPlanId].basePrice;
      $('#footer-amount').textContent = `₹${price.toLocaleString('en-IN')}`;
    }
  }

  // ── Render Social Proof (Zone 5) ──
  function renderSocialProof(sc) {
    // Decide options — post-call variant
    if (sc.helpButtonText && sc.helpButtonText !== 'Need Help?') {
      const agentName = sc.helpButtonText.replace('Talk to ', '').replace(' again', '');
      $('#decide-title').textContent = 'Still have questions?';
      $('#decide-options').innerHTML = `
        <a href="#" class="decide-option callback-cta">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" stroke-width="2"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6A19.79 19.79 0 012.12 4.18 2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.362 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg>
          <div>
            <strong>${sc.helpButtonText}</strong>
            <span>One-click callback to your advisor</span>
          </div>
        </a>
      `;
    } else {
      showDefaultDecideOptions();
    }

    // Trust signals
    if (sc.trustSignals && sc.trustSignals.length > 0) {
      $('#trust-signals').style.display = '';
      let html = '';
      sc.trustSignals.forEach(signal => {
        html += `
          <div class="trust-item">
            <div class="trust-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <span class="trust-text">${signal}</span>
          </div>
        `;
      });
      $('#trust-items').innerHTML = html;
    } else {
      hideElement('trust-signals');
    }
  }

  function showDefaultDecideOptions() {
    $('#decide-title').textContent = 'Unable to decide?';
    $('#decide-options').innerHTML = `
      <a href="#" class="decide-option">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
        <div><strong>In-person visit</strong><span>Meet an advisor near you</span></div>
      </a>
      <a href="#" class="decide-option">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>
        <div><strong>Video call support</strong><span>Talk face-to-face online</span></div>
      </a>
      <a href="#" class="decide-option">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#2E75B6" stroke-width="2"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>
        <div><strong>Online assistance</strong><span>Chat with our team</span></div>
      </a>
    `;
  }

  // ── Render Footer (Zone 7) ──
  function renderFooter(sc) {
    // Extra discounts text
    if (sc.scenarioId === 4) {
      $('#extra-discounts-text').textContent = '50% Cumulative Bonus per claim-free year — see how it grows';
    } else if (sc.scenarioId === 5) {
      $('#extra-discounts-text').textContent = '7.5% Professional Discount available';
    } else if (sc.discountBadge) {
      $('#extra-discounts-text').textContent = sc.discountBadge.text + ' — Check now';
    } else {
      $('#extra-discounts-text').textContent = 'To view Extra discounts - Check now';
    }

    // CTA text
    $('#cta-text').textContent = sc.primaryCTA;
  }

  // ── Render Zone 8 Elements ──
  function renderZone8(sc) {
    hideAllZone8();

    if (!sc.newElements || sc.newElements.length === 0) return;

    sc.newElements.forEach(element => {
      switch (element) {
        case 'costConverter':
          showElement('cost-converter');
          // Reset to daily tab
          $$('.conv-tab').forEach(t => t.classList.remove('active'));
          const dailyTab = document.querySelector('.conv-tab[data-period="daily"]');
          if (dailyTab) dailyTab.classList.add('active');
          updateCostConverter('daily');
          break;

        case 'gapVisualiser':
          showElement('gap-visualiser');
          break;

        case 'ncbCalculator':
          showElement('ncb-calculator');
          break;

        case 'maternityTimeline':
          showElement('maternity-timeline');
          break;

        case 'lapseCallout':
          showElement('lapse-callout');
          break;

        case 'diyChecker':
          showElement('diy-checker');
          break;

        case 'callbackScheduler':
          showElement('callback-scheduler');
          break;

        case 'referralBanner':
          // Handled in applyScenario
          break;

        case 'resumptionBanner':
          // Handled in applyScenario
          break;
      }
    });
  }

  // ── Cost Converter Logic ──
  function updateCostConverter(period) {
    if (!selectedPlanId || !PLANS[selectedPlanId]) return;
    const annual = PLANS[selectedPlanId].basePrice;
    let value, suffix, barWidth;

    switch (period) {
      case 'daily':
        value = Math.round(annual / 365);
        suffix = '/day';
        barWidth = '8%';
        break;
      case 'monthly':
        value = Math.round(annual / 12);
        suffix = '/month';
        barWidth = '45%';
        break;
      case 'annual':
        value = annual;
        suffix = '/year';
        barWidth = '100%';
        break;
      default:
        value = Math.round(annual / 365);
        suffix = '/day';
        barWidth = '8%';
    }

    $('#converter-value').textContent = value.toLocaleString('en-IN');
    $('#converter-period').textContent = suffix;
    $('#converter-bar-fill').style.width = barWidth;
  }

  // ── SI & Tenure Helpers ──
  function setSISelector(si) {
    $$('.si-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.si === si);
    });
  }

  function setTenureToggle(tenure) {
    $$('.tenure-option').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tenure === tenure);
    });
  }

  // ── Show/Hide Helpers ──
  function hideElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = 'none';
  }

  function showElement(id) {
    const el = document.getElementById(id);
    if (el) el.style.display = '';
  }

  function hideAllZone8() {
    [
      'cost-converter', 'gap-visualiser', 'ncb-calculator',
      'maternity-timeline', 'lapse-callout', 'diy-checker',
      'callback-scheduler', 'referral-banner', 'resumption-banner'
    ].forEach(hideElement);
  }

  // ── Assistant Avatar ──
  function updateAssistantAvatar() {
    const avatarEl = $('#avatar-visual');
    const labelEl = $('#tia-label');

    if (assistantMode === 'tia') {
      // AI Bot — sparkle icon
      avatarEl.className = 'avatar-circle avatar-ai';
      avatarEl.innerHTML = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#0066CC" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L14.5 9.5 22 12 14.5 14.5 12 22 9.5 14.5 2 12 9.5 9.5z"/></svg>';
      labelEl.className = 'tia-label';
      labelEl.textContent = 'TIA';
    } else {
      // Human advisor
      const isP = assistantMode === 'advisor-priya';
      const name = isP ? 'Priya' : 'Rahul';
      const initials = isP ? 'PS' : 'RK';
      avatarEl.className = 'avatar-circle avatar-human';
      avatarEl.innerHTML = initials;
      labelEl.className = 'tia-label advisor-name';
      labelEl.textContent = name + ', your advisor';
    }
  }

  // ── Greeting with name prefix ──
  function personaliseGreeting(greeting) {
    if (nameMode === 'name') {
      // Prefix with "Hi Name, " — handle existing "Hi " gracefully
      if (greeting.toLowerCase().startsWith('hi ')) return greeting;
      // Lower-case first letter of greeting when prefixing
      const lower = greeting.charAt(0).toLowerCase() + greeting.slice(1);
      return 'Hi ' + customerName + ', ' + lower;
    }
    return greeting;
  }

  function reapplyGreeting() {
    if (isDefaultView) {
      $('#tia-text').textContent = personaliseGreeting('Your personalised quote is ready!');
    } else if (currentScenario) {
      $('#tia-text').textContent = personaliseGreeting(currentScenario.tiaGreeting);
    }
  }

})();

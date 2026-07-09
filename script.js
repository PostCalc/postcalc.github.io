/* =========================================
   PART 1: CONFIGURATION & TABLES
   ========================================= */
const SCHEMES = {
    'sb': { name: "Savings Account", rate: 4.0, min: 500, tenure: 1 },
    'rd': { name: "Recurring Deposit", rate: 6.7, min: 100, tenure: 5 },
    'mis': { name: "Monthly Income Scheme", rate: 7.4, min: 1000, max: 900000, jointMax: 1500000, tenure: 5 },
    'scss': { name: "Senior Citizen Savings", rate: 8.2, min: 1000, max: 3000000, tenure: 5 },
    'ppf': { name: "Public Provident Fund", rate: 7.1, min: 500, max: 150000, tenure: 15 },
    'ssa': { name: "Sukanya Samriddhi", rate: 8.2, min: 250, max: 150000, tenure: 21 },
    'nsc': { name: "NSC (VIII Issue)", rate: 7.7, min: 1000, tenure: 5 },
    'kvp': { name: "Kisan Vikas Patra", rate: 7.5, min: 1000, tenure: 9.58 },
    'td': { name: "Time Deposit", rate: 7.5, rates: {1:6.9, 2:7.0, 3:7.1, 5:7.5}, min: 1000, tenure: 5 },
    'pli': { name: "PLI - Santosh", min: 20000, max: 5000000 },
    'rpli': { name: "RPLI - Gram Santosh", min: 10000, max: 1000000 }
};

const SCHEME_RULES = {
    'sb': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>4.0% per annum</td></tr><tr><th>Min/Max Deposit</th><td>₹500 / No Upper Limit</td></tr><tr><th>Tax Benefits</th><td>Interest tax-free up to ₹10,000 under Section 80TTA</td></tr><tr><th>Premature Closure</th><td>Allowed anytime by closing account</td></tr></table>`,
    'rd': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>6.7% compounded quarterly</td></tr><tr><th>Maturity Tenure</th><td>5 Years (60 Months)</td></tr><tr><th>Tax Benefits</th><td>No tax rebate; TDS applicable as per regular IT slabs</td></tr><tr><th>Premature Closure</th><td>Allowed after 3 years from opening date</td></tr></table>`,
    'mis': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.4% paid out monthly</td></tr><tr><th>Maturity Tenure</th><td>5 Years</td></tr><tr><th>Single Limit</th><td>Minimum ₹1,000 up to Maximum ₹9 Lakhs</td></tr><tr><th>Joint Limit</th><td>Maximum ₹15 Lakhs shared equally</td></tr><tr><th>Premature Closure</th><td>Allowed after 1 year (1% to 2% penalty deduction applies)</td></tr></table>`,
    'scss': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>8.2% paid out quarterly</td></tr><tr><th>Age Criteria</th><td>60 years or above (55 for VRS optomees)</td></tr><tr><th>Max Investment</th><td>₹30 Lakhs aggregated across accounts</td></tr><tr><th>Tax Benefits</th><td>Investment qualifies for Section 80C deductions</td></tr><tr><th>Premature Closure</th><td>Allowed with a penalty of 1% to 1.5% after 1 year</td></tr></table>`,
    'ppf': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.1% compounded annually</td></tr><tr><th>Lock-in Period</th><td>15 Financial Years</td></tr><tr><th>Limits</th><td>Minimum ₹500 to Maximum ₹1.5 Lakhs per fiscal year</td></tr><tr><th>Tax Benefits</th><td>EEE Category (Exempt Investment, Exempt Interest, Exempt Maturity)</td></tr><tr><th>Premature Closure</th><td>Allowed after 5 years for specific medical or educational grounds</td></tr></table>`,
    'ssa': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>8.2% compounded annually</td></tr><tr><th>Target Group</th><td>Girl child below 10 years of age</td></tr><tr><th>Maturity / Pay-term</th><td>Matures after 21 years; Deposits required for 15 years</td></tr><tr><th>Tax Status</th><td>EEE category under Section 80C rules</td></tr><tr><th>Partial Payout</th><td>50% withdrawal allowed after age 18 for higher studies</td></tr></table>`,
    'nsc': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.7% compounded annually, paid at maturity</td></tr><tr><th>Tenure</th><td>5 Years</td></tr><tr><th>Tax Rebate</th><td>Investment qualifies under Section 80C</td></tr><tr><th>Premature Closure</th><td>Prohibited except on court orders or death of holder</td></tr></table>`,
    'kvp': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.5% compounded annually</td></tr><tr><th>Maturity Rule</th><td>Amount doubles guaranteed in exactly 115 months</td></tr><tr><th>Taxation</th><td>Interest is fully taxable under other sources</td></tr><tr><th>Premature Closure</th><td>Allowed after 2 years and 6 months lock-in window</td></tr></table>`,
    'td': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Interest Engine</th><td>Compounded quarterly, paid out annually</td></tr><tr><th>Slab Rates</th><td>1Yr: 6.9%, 2Yr: 7.0%, 3Yr: 7.1%, 5Yr: 7.5%</td></tr><tr><th>Tax Deductions</th><td>Only the 5-Year TD option qualifies for Section 80C</td></tr><tr><th>Premature Closure</th><td>Allowed after 6 months with reduced baseline interest rates</td></tr></table>`,
    'pli': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Bonus Allotted</th><td>₹52 per ₹1,000 Sum Assured per year</td></tr><tr><th>Age Parameters</th><td>19 to 55 Years old</td></tr><tr><th>Tax Status</th><td>Premiums exempt under 80C; Payouts tax-free under 10(10D)</td></tr><tr><th>GST Rules</th><td>0% GST for payments after September 22, 2025</td></tr></table>`,
    'rpli': `<div class="info-section-title">Official Overview</div><table class="info-table"><tr><th>Bonus Allotted</th><td>₹48 per ₹1,000 Sum Assured per year</td></tr><tr><th>Domain Bounds</th><td>Open exclusively to residents of rural Indian sectors</td></tr><tr><th>Tax Status</th><td>Premiums exempt under 80C; Payouts tax-free under 10(10D)</td></tr><tr><th>GST Rules</th><td>0% GST for payments after September 22, 2025</td></tr></table>`
};

const PLI_TABLE = { 19: {35:52, 40:38, 45:30, 50:24, 55:20, 58:18, 60:18}, 20: {35:54, 40:40, 45:32, 50:26, 55:20, 58:20, 60:18}, 21: {35:58, 40:42, 45:32, 50:26, 55:22, 58:20, 60:18}, 22: {35:64, 40:44, 45:34, 50:28, 55:22, 58:20, 60:20}, 23: {35:70, 40:48, 45:36, 50:28, 55:24, 58:20, 60:20}, 24: {35:76, 40:52, 45:38, 50:30, 55:24, 58:22, 60:20}, 25: {35:84, 40:54, 45:40, 50:32, 55:26, 58:22, 60:22}, 26: {35:94, 40:58, 45:42, 50:32, 55:26, 58:24, 60:22}, 27: {35:106, 40:64, 45:44, 50:34, 55:28, 58:24, 60:24}, 28: {35:122, 40:70, 45:48, 50:36, 55:28, 58:26, 60:24}, 29: {35:144, 40:76, 45:52, 50:38, 55:30, 58:26, 60:26}, 30: {35:172, 40:84, 45:56, 50:40, 55:32, 58:28, 60:26}, 31: {40:96, 45:60, 50:44, 55:34, 58:30, 60:28}, 32: {40:106, 45:64, 50:46, 55:34, 58:30, 60:28}, 33: {40:122, 45:70, 50:48, 55:36, 58:32, 60:28}, 34: {40:144, 45:76, 50:52, 55:38, 58:34, 60:30}, 35: {40:172, 45:84, 50:56, 55:40, 58:34, 60:32}, 36: {45:94, 50:60, 55:44, 58:38, 60:34}, 37: {45:106, 50:64, 55:46, 58:40, 60:36}, 38: {45:122, 50:70, 55:50, 58:42, 60:38}, 39: {45:144, 50:78, 55:54, 58:44, 60:40}, 40: {45:174, 50:86, 55:56, 58:46, 60:42}, 41: {50:96, 55:60, 58:50, 60:44}, 42: {50:108, 55:66, 58:54, 60:48}, 43: {50:124, 55:72, 58:58, 60:50}, 44: {50:144, 55:78, 58:62, 60:54}, 45: {50:174, 55:86, 58:66, 60:58}, 46: {55:96, 58:72, 60:62}, 47: {55:110, 58:80, 60:68}, 48: {55:126, 58:88, 60:74}, 49: {55:146, 58:98, 60:80}, 50: {55:176, 58:110, 60:88}, 51: {58:126, 60:98}, 52: {58:150, 60:118}, 53: {58:178, 60:132}, 54: {60:152}, 55: {60:178} };
const RPLI_TABLE = { 19: {35:5.10, 40:3.75, 45:2.95, 50:2.40, 55:2.00, 58:1.85, 60:1.75}, 20: {35:5.45, 40:3.95, 45:3.10, 50:2.50, 55:2.05, 58:1.90, 60:1.80}, 21: {35:5.85, 40:4.20, 45:3.25, 50:2.60, 55:2.10, 58:1.95, 60:1.85}, 22: {35:6.35, 40:4.45, 45:3.40, 50:2.70, 55:2.20, 58:2.00, 60:1.90}, 23: {35:6.95, 40:4.75, 45:3.55, 50:2.80, 55:2.30, 58:2.05, 60:1.95}, 24: {35:7.65, 40:5.10, 45:3.75, 50:2.95, 55:2.40, 58:2.15, 60:2.00}, 25: {35:8.45, 40:5.45, 45:3.95, 50:3.10, 55:2.50, 58:2.25, 60:2.10}, 26: {35:9.40, 40:5.85, 45:4.20, 50:3.25, 55:2.60, 58:2.35, 60:2.20}, 27: {35:10.70, 40:6.35, 45:4.45, 50:3.40, 55:2.70, 58:2.45, 60:2.30}, 28: {35:12.30, 40:6.95, 45:4.75, 50:3.60, 55:2.85, 58:2.55, 60:2.40}, 29: {35:14.40, 40:7.65, 45:5.10, 50:3.80, 55:3.00, 58:2.65, 60:2.50}, 30: {35:17.40, 40:8.45, 45:5.45, 50:4.00, 55:3.15, 58:2.75, 60:2.60}, 31: {40:9.45, 45:5.90, 50:4.25, 55:3.30, 58:2.90, 60:2.70}, 32: {40:10.70, 45:6.40, 50:4.50, 55:3.45, 58:3.05, 60:2.80}, 33: {40:12.30, 45:6.95, 50:4.80, 55:3.65, 58:3.20, 60:2.95}, 34: {40:14.40, 45:7.65, 50:5.15, 55:3.85, 58:3.35, 60:3.05}, 35: {40:17.40, 45:8.45, 50:5.50, 55:4.05, 58:3.50, 60:3.20}, 36: {45:9.40, 50:6.00, 55:4.40, 58:3.80, 60:3.40}, 37: {45:10.60, 50:6.40, 55:4.60, 58:4.00, 60:3.60}, 38: {45:12.20, 50:7.00, 55:5.00, 58:4.20, 60:3.80}, 39: {45:14.40, 50:7.80, 55:5.40, 58:4.40, 60:4.00}, 40: {45:17.40, 50:8.55, 55:5.60, 58:4.60, 60:4.20}, 41: {50:9.60, 55:6.00, 58:5.00, 60:4.40}, 42: {50:10.80, 55:6.60, 58:5.40, 60:4.80}, 43: {50:12.40, 55:7.20, 58:5.80, 60:5.00}, 44: {50:14.40, 55:7.80, 58:6.20, 60:5.40}, 45: {50:17.40, 55:8.60, 58:6.60, 60:5.80}, 46: {55:9.60, 58:7.20, 60:6.20}, 47: {55:11.00, 58:8.00, 60:6.80}, 48: {55:12.60, 58:8.80, 60:7.40}, 49: {55:14.60, 58:9.80, 60:8.00}, 50: {55:17.60, 58:11.00, 60:8.6667}, 51: {58:12.60, 60:9.80}, 52: {58:15.00, 60:11.80}, 53: {58:17.80, 60:13.20}, 54: {60:15.20}, 55: {60:17.80} };

/* =========================================
   PART 2: UTILITIES & INSURANCE ENGINE
   ========================================= */
function numToWord(val, divId) {
    const div = document.getElementById(divId); if (!div) return;
    let n = parseInt(val); if (!n || n === 0) { div.innerText = ""; return; }
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    function convert(num) {
        if (num < 10) return units[num]; if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "");
        if (num < 1000) return units[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " and " + convert(num % 100) : ""); return "";
    }
    let str = ""; let amt = Math.floor(n);
    if (amt >= 10000000) { str += convert(Math.floor(amt / 10000000)) + " Crore "; amt %= 10000000; }
    if (amt >= 100000) { str += convert(Math.floor(amt / 100000)) + " Lakh "; amt %= 100000; }
    if (amt >= 1000) { str += convert(Math.floor(amt / 1000)) + " Thousand "; amt %= 1000; }
    if (amt > 0) { str += convert(amt); }
    div.innerText = str.trim() + " Rupees Only";
}

function getVal(id) { const el = document.getElementById(id); return el ? (parseFloat(el.value) || 0) : 0; }
function showWarn(msg) { const wb = document.getElementById('warningBox'); if (wb) { wb.innerText = msg; wb.style.display = 'block'; } }
function hideWarn() { const wb = document.getElementById('warningBox'); if (wb) wb.style.display = 'none'; }
function fmt(num) { return isNaN(num) ? "-" : "₹" + Math.round(num).toLocaleString('en-IN'); }

const getWordsGlobal = (num) => {
    if (!num || num === 0) return "Zero";
    const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    const convert = (n) => { if (n < 20) return a[n]; if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : ""); if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : ""); return ""; };
    let str = ""; let n = Math.floor(num);
    if (n >= 10000000) { str += convert(Math.floor(n / 10000000)) + " Crore "; n %= 10000000; }
    if (n >= 100000) { str += convert(Math.floor(n / 100000)) + " Lakh "; n %= 100000; }
    if (n >= 1000) { str += convert(Math.floor(n / 1000)) + " Thousand "; n %= 1000; }
    if (n > 0) { str += convert(n); }
    return str.trim();
};

function generateInsuranceGrid(sa, entryAge, type, d, mode) {
    const permittedMaturityAges = [35, 40, 45, 50, 55, 58, 60]; let rows = [];
    let matrix = type === 'pli' ? PLI_TABLE : RPLI_TABLE; let baseline = type === 'pli' ? 10000 : 1000; let bonusRate = type === 'pli' ? 52 : 48;
    let gstRate = 0.045; const reformDate = new Date("2025-09-22"); if (d >= reformDate) gstRate = 0.0; 
    let n = 1; if (mode === 'yearly') n = 12; else if (mode === 'half') n = 6; else if (mode === 'quarterly') n = 3;
    permittedMaturityAges.forEach(matAge => {
        let term = matAge - entryAge;
        if (term > 0 && matrix[entryAge] && matrix[entryAge][matAge]) {
            let tableRate = matrix[entryAge][matAge]; let monthlyGross = (sa / baseline) * tableRate; let totalDiscount = 0;
            if (type === 'pli') {
                let discountPer10k = 0;
                if (mode === 'yearly') discountPer10k = Math.floor(tableRate * 12 * 0.03 * 5) / 5; else if (mode === 'half') discountPer10k = Math.floor(tableRate * 6 * 0.015 * 5) / 5; else if (mode === 'quarterly') discountPer10k = Math.floor(tableRate * 3 * 0.0025 * 5) / 5;
                totalDiscount = discountPer10k * (sa / 10000);
            } else if (type === 'rpli') {
                let discountPer10k = 0;
                if (mode === 'yearly') discountPer10k = 20.5; else if (mode === 'half') discountPer10k = 5.5; else if (mode === 'quarterly') discountPer10k = 1.5;
                totalDiscount = discountPer10k * (sa / 10000);
            }
            let aggregatedGross = monthlyGross * n; let finalGrossPrem = Math.round(aggregatedGross - totalDiscount);
            let totalRebateRaw = (sa / 20000) * n; let displayRebate = Math.floor(totalRebateRaw); 
            let intermediatePremium = finalGrossPrem - totalRebateRaw; let basePremiumRounded = Math.floor(intermediatePremium);
            let taxAmt = Math.round(basePremiumRounded * gstRate); let netPremium = basePremiumRounded + taxAmt;
            let reversionaryBonus = (sa / 1000) * bonusRate * term; let finalMaturity = sa + reversionaryBonus;
            rows.push({ matAge: matAge, duration: term, premium: finalGrossPrem, rebate: displayRebate, tax: taxAmt, net: netPremium, bonus: reversionaryBonus, matAmt: finalMaturity });
        }
    }); return rows;
        }

/* =========================================
   PART 3: SAVINGS ENGINES
   ========================================= */
const Engines = {
    calcSB: (p, r, d) => { let yrs = parseInt(document.getElementById('sbTenure').value) || 1; let rows = []; let bal = p; let startMonth = (d.getDate() > 10) ? 1 : 0; let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + yrs); for (let i = 1; i <= yrs; i++) { let int = (i === 1 && startMonth === 1) ? Math.round(bal * (r/100) * (11/12)) : Math.round(bal * (r/100)); let op = bal; bal += int; rows.push({ lbl: `Year ${i}`, op: op, dep: 0, int: int, cl: bal }); } return { dep: p, int: bal - p, mat: bal, date: matDate, rows: rows, type: 'compound' }; },
    calcTD: (p, r, t, d) => { let ratePerQ = r / 400; let amtAfter1Year = p * Math.pow(1 + ratePerQ, 4); let annualPay = Math.round(amtAfter1Year - p); let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + t); let rows = []; for(let i=1; i<=t; i++) rows.push({ lbl: `Year ${i}`, op: p, dep: 0, int: annualPay, cl: p }); return { dep: p, int: annualPay * t, mat: p, payout: annualPay, date: matDate, rows: rows, type: 'payout', freq: ' / year' }; },
    calcPayout: (p, r, yrs, freq, d) => { let pay = Math.round((p * r / 100) / freq); let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + yrs); let rows = []; for (let i = 1; i <= yrs; i++) rows.push({ lbl: `Year ${i}`, op: p, dep: 0, int: pay * freq, cl: p }); return { dep: p, int: pay * freq * yrs, mat: p, payout: pay, date: matDate, rows: rows, type: 'payout', freq: (freq === 12) ? ' / month' : ' / quarter' }; },
    calcPPF_SSA: (p, r, d, type, mode, startAge = 0) => { let bal = 0, totDep = 0; let rows = []; let matDate = new Date(d); let depEndDate = new Date(d); if (type === 'ppf') { let fyEndMonth = d.getMonth() > 2 ? d.getFullYear() + 1 : d.getFullYear(); matDate = new Date(fyEndMonth + 15, 2, 31); depEndDate = matDate; } else { matDate.setFullYear(d.getFullYear() + 21); depEndDate = new Date(d); depEndDate.setFullYear(d.getFullYear() + 15); } let curr = new Date(d); curr.setDate(1); let yrData = { op: 0, dep: 0, int: 0, cl: 0 }; let accInt = 0; let openDay = d.getDate(); let yearsElapsed = 0; while (curr < matDate) { let m = curr.getMonth(); let y = curr.getFullYear(); let monDep = 0; if (curr < depEndDate) { if (mode === 'monthly') monDep = p; else if (mode === 'annual') { if (m === 3 || (y === d.getFullYear() && m === d.getMonth())) monDep = p; } } bal += monDep; totDep += monDep; yrData.dep += monDep; let qualifyingBal = bal; let isFirstMonth = (curr.getMonth() === d.getMonth() && curr.getFullYear() === d.getFullYear()); if (isFirstMonth && openDay > 5 && monDep > 0) qualifyingBal = bal - monDep; let int = (qualifyingBal * r) / 1200; accInt += int; if (m === 2 || (curr.getTime() + 2600000000 > matDate.getTime())) { let credit = Math.round(accInt); bal += credit; yrData.int = credit; yrData.cl = bal; if (yrData.dep > 0 || yrData.int > 0) { let fyStart = m <= 2 ? y - 1 : y; let fyEndStr = (fyStart + 1).toString().slice(-2); rows.push({ lbl: `${fyStart}-${fyEndStr}`, age: startAge + yearsElapsed, op: yrData.op, dep: yrData.dep, int: yrData.int, cl: yrData.cl }); yearsElapsed++; } yrData = { op: bal, dep: 0, int: 0, cl: 0 }; accInt = 0; } curr.setMonth(curr.getMonth() + 1); } return { dep: totDep, int: bal - totDep, mat: bal, date: matDate, rows: rows, type: type }; },
    calcRD: (p, r, d) => { let rows = [], bal = 0, bucket = 0, totDep = 0; let yrOp = 0, yrDep = 0; let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + 5); for (let i = 1; i <= 60; i++) { bal += p; totDep += p; yrDep += p; bucket += (bal * r) / 1200; if (i % 3 === 0) { bal += bucket; bucket = 0; } if (i % 12 === 0) { rows.push({ lbl: `Year ${i/12}`, op: yrOp, dep: yrDep, int: Math.round(bal - yrOp - yrDep), cl: Math.round(bal) }); yrOp = Math.round(bal); yrDep = 0; } } return { dep: totDep, int: Math.round(bal) - totDep, mat: Math.round(bal), date: matDate, rows: rows, type: 'compound' }; },
    calcNSC: (p, r, d) => { let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + 5); let rows = [], bal = p; for(let i=1; i<=5; i++) { let int = Math.round(bal * r / 100); rows.push({ lbl: `Year ${i}`, op: Math.round(bal), dep: 0, int: int, cl: Math.round(bal+int) }); bal += int; } return { dep: p, int: Math.round(bal)-p, mat: Math.round(bal), date: matDate, rows: rows, type: 'compound' }; },
    calcKVP: (p, r, d) => { let matDate = new Date(d); matDate.setMonth(d.getMonth() + 115); return { dep: p, int: p, mat: p*2, date: matDate, rows: [{lbl:'Maturity (115 Mo)', op:p, dep:0, int:p, cl:p*2}], type: 'compound' }; },
    calcRD_EXT: (p, r, extYrs, type, d) => { let qRate = r / 400; let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + 5 + extYrs); function getRDMaturity(dep, months, rate) { let mat = 0; for (let m = 1; m <= months; m++) mat += dep * Math.pow(1 + rate, (months - m + 1) / 3); return mat; } let rows = []; let totalDeposit = 0; let finalMaturity = 0; let baseMaturity = Math.round(getRDMaturity(p, 60, qRate)); let baseDeposit = p * 60; rows.push({ lbl: `Base (1-5 Yrs)`, op: 0, dep: baseDeposit, int: baseMaturity - baseDeposit, cl: baseMaturity }); let prevMaturity = baseMaturity; if (type === "with") { totalDeposit = baseDeposit; for (let y = 1; y <= extYrs; y++) { let currentMaturity = Math.round(getRDMaturity(p, 60 + (y * 12), qRate)); let yearlyDep = p * 12; totalDeposit += yearlyDep; rows.push({ lbl: `Year ${5 + y}`, op: prevMaturity, dep: yearlyDep, int: currentMaturity - prevMaturity - yearlyDep, cl: currentMaturity }); prevMaturity = currentMaturity; } } else { totalDeposit = baseDeposit; for (let y = 1; y <= extYrs; y++) { let currentMaturity = Math.round(baseMaturity * Math.pow(1 + qRate, y * 4)); rows.push({ lbl: `Year ${5 + y}`, op: prevMaturity, dep: 0, int: currentMaturity - prevMaturity, cl: currentMaturity }); prevMaturity = currentMaturity; } } return { dep: totalDeposit, int: prevMaturity - totalDeposit, mat: prevMaturity, date: matDate, rows: rows, type: 'compound' }; }
};
                                                                                                                                                                                                                                                                                                                                                   
/* =========================================
   PART 4: CALCULATOR UI & RENDERING
   ========================================= */
function openModal() { const s = document.getElementById('schemeSelector').value; updateInfoContent(s); document.getElementById('infoModal').classList.add('show'); }
function closeModal() { document.getElementById('infoModal').classList.remove('show'); }
function updateInfoContent(scheme) { const container = document.getElementById('ruleContent'); container.innerHTML = (scheme && SCHEME_RULES[scheme]) ? SCHEME_RULES[scheme] : "<p style='text-align:center; padding:20px;'>Select a scheme.</p>"; }

function toggleInputs() {
    const s = document.getElementById('schemeSelector').value; 
    document.querySelectorAll('.input-group').forEach(el => el.classList.add('hidden')); document.getElementById('resultsCard').classList.add('hidden');
    if (!s) { document.getElementById('inputCard').classList.add('hidden'); document.getElementById('btnInfo').classList.add('hidden'); return; }
    document.getElementById('inputCard').classList.remove('hidden'); document.getElementById('btnInfo').classList.remove('hidden');
    if(SCHEMES[s]) document.getElementById('printSchemeName').innerText = SCHEMES[s].name;
    if (s === 'ssa') unhide('input-ssa'); else if (s === 'ppf') unhide('input-ppf'); else if (s === 'td') unhide('input-td'); else if (document.getElementById('input-'+s)) unhide('input-'+s);
}
function unhide(id) { document.getElementById(id).classList.remove('hidden'); }

window.setSSAMode = function(mode) { document.querySelectorAll('#input-ssa .toggle-btn').forEach(btn => btn.classList.remove('active')); if(window.event && window.event.target) window.event.target.classList.add('active'); document.getElementById('input-ssa').dataset.mode = mode; if (mode === 'annual') { unhide('ssa-annual-inputs'); document.getElementById('ssa-monthly-inputs').classList.add('hidden'); } else { unhide('ssa-monthly-inputs'); document.getElementById('ssa-annual-inputs').classList.add('hidden'); } };
window.setPPFMode = function(mode) { document.querySelectorAll('#input-ppf .toggle-btn').forEach(btn => btn.classList.remove('active')); if(window.event && window.event.target) window.event.target.classList.add('active'); document.getElementById('input-ppf').dataset.mode = mode; if (mode === 'annual') { unhide('ppf-annual-inputs'); document.getElementById('ppf-monthly-inputs').classList.add('hidden'); } else { unhide('ppf-monthly-inputs'); document.getElementById('ppf-annual-inputs').classList.add('hidden'); } };
window.setMISMode = function(type) { document.querySelectorAll('#input-mis .toggle-btn').forEach(btn => btn.classList.remove('active')); if(window.event && window.event.target) window.event.target.classList.add('active'); document.getElementById('input-mis').dataset.type = type; };

function handleCalculate() {
    const s = document.getElementById('schemeSelector').value; const dStr = document.getElementById('dateOpen').value; const d = dStr ? new Date(dStr) : new Date(); const conf = SCHEMES[s];
    hideWarn(); let p = 0, mode = 'annual';

    if (s === 'ssa') { mode = document.getElementById('input-ssa').dataset.mode || 'annual'; p = (mode === 'annual') ? getVal('ssaDepositAnnual') : getVal('ssaDepositMonthly'); if (getVal('ssaAge') > 10) return showWarn("Girl's age must be 10 or less."); } 
    else if (s === 'ppf') { mode = document.getElementById('input-ppf').dataset.mode || 'annual'; p = (mode === 'annual') ? getVal('ppfDepositAnnual') : getVal('ppfDepositMonthly'); }
    else if (s === 'mis') { p = getVal('misDeposit'); const type = document.getElementById('input-mis').dataset.type || 'single'; const limit = (type === 'single') ? 900000 : 1500000; if (p > limit) return showWarn(`Maximum limit is ₹${limit}`); }
    else if (s === 'td') { p = getVal('tdDeposit'); } else if (s === 'rd_ext') { p = getVal('rdExtDeposit'); } else if (s === 'pli') { p = getVal('pliDeposit'); } else if (s === 'rpli') { p = getVal('rpliDeposit'); }
    else { let id = s + 'Deposit'; p = document.getElementById(id) ? getVal(id) : getVal('rdDeposit'); }
    if (p < conf.min) return showWarn(`Minimum deposit is ₹${conf.min}`);
    if (s !== 'mis' && conf.max && p > conf.max) return showWarn(`Maximum limit is ₹${conf.max}`);

    let res = null;
    if (s === 'pli' || s === 'rpli') {
        let entryAge = parseInt(document.getElementById(s + 'EntryAge').value); let pMode = document.getElementById(s + 'PaymentMode').value;
        if (!entryAge || entryAge < 19 || entryAge > 55) return showWarn("Age must be between 19 and 55.");
        let gridData = generateInsuranceGrid(p, entryAge, s, d, pMode); if (gridData.length === 0) return showWarn("No actuarial rates available.");
        document.getElementById('printSchemeSub').innerText = "Endowment Assurance Quote"; document.getElementById('resTotalDep').innerText = fmt(p); document.getElementById('resTotalInt').innerText = "Varies by Term"; document.getElementById('resMaturity').innerText = "See Grid Below"; document.getElementById('resMatDate').innerText = "-"; document.getElementById('rowPayout').classList.add('hidden');
        document.getElementById('lblTotalDep').innerText = "Sum Assured"; document.getElementById('lblTotalInt').innerText = "Bonus Status"; document.getElementById('lblMaturity').innerText = "Maturity Estimate"; document.getElementById('lblMatDate').innerText = "Maturity Event";
        let modeLabel = (pMode === 'yearly') ? 'Yearly' : (pMode === 'half') ? 'Half-Yr' : (pMode === 'quarterly') ? 'Qtrly' : 'Monthly';
        document.getElementById('resHead').innerHTML = `<tr><th>Mat. Age</th><th>Term</th><th>Prem.</th><th>Rebate</th><th>Tax</th><th>Net ${modeLabel}</th><th>Total Bonus</th><th>Maturity Amt</th></tr>`;
        let buildHtml = ''; gridData.forEach(r => { buildHtml += `<tr><td style="text-align:left; font-weight:800;">${r.matAge} Yrs</td><td>${r.duration} Y</td><td>₹${r.premium}</td><td>₹${r.rebate}</td><td>₹${r.tax}</td><td style="color:#059669; font-weight:800;">₹${r.net}</td><td>${fmt(r.bonus)}</td><td style="color:var(--ip-ruby); font-weight:800;">${fmt(r.matAmt)}</td></tr>`; });
        document.getElementById('resBody').innerHTML = buildHtml;
        const ext = document.getElementById('rdExtendSection'); if (ext) ext.classList.add('hidden');
        document.getElementById('resultsCard').classList.remove('hidden'); document.getElementById('resultsCard').scrollIntoView({behavior:'smooth'}); return; 
    }
    if (s === 'sb') res = Engines.calcSB(p, conf.rate, d); else if (s === 'ppf') res = Engines.calcPPF_SSA(p, conf.rate, d, 'ppf', mode); else if (s === 'ssa') res = Engines.calcPPF_SSA(p, conf.rate, d, 'ssa', mode, parseInt(document.getElementById('ssaAge').value) || 0); else if (s === 'rd') res = Engines.calcRD(p, conf.rate, d); else if (s === 'mis') res = Engines.calcPayout(p, conf.rate, 5, 12, d); else if (s === 'scss') res = Engines.calcPayout(p, conf.rate, 5, 4, d); else if (s === 'td') { let t = parseInt(document.getElementById('tdTenure').value); res = Engines.calcTD(p, conf.rates[t], t, d); } else if (s === 'nsc') res = Engines.calcNSC(p, conf.rate, d); else if (s === 'kvp') res = Engines.calcKVP(p, conf.rate, d);
    
    const extendSection = document.getElementById('rdExtendSection'); const btnShowExt = document.getElementById('btnShowExtend');
    if (extendSection && btnShowExt) { if (s === 'rd') { extendSection.classList.remove('hidden'); btnShowExt.classList.remove('hidden'); document.getElementById('rdExtendInputs').classList.add('hidden'); } else { extendSection.classList.add('hidden'); } }
    document.getElementById('printSchemeSub').innerText = "Interest Estimate Statement"; document.getElementById('lblTotalDep').innerText = "Total Deposit"; document.getElementById('lblTotalInt').innerText = "Total Interest"; document.getElementById('lblMaturity').innerText = "Maturity Amount"; document.getElementById('lblMatDate').innerText = "Maturity Date"; const lblPayout = document.getElementById('lblPayout'); if (lblPayout) lblPayout.innerText = "Regular Payout";
    if(res) renderSimple(res);
}

function renderSimple(data) {
    document.getElementById('resTotalDep').innerText = fmt(data.dep); document.getElementById('resTotalInt').innerText = fmt(data.int); document.getElementById('resMaturity').innerText = fmt(data.mat);
    if (data.date) document.getElementById('resMatDate').innerText = data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    if (data.payout) { document.getElementById('rowPayout').classList.remove('hidden'); document.getElementById('resPayout').innerText = fmt(data.payout) + (data.freq || ''); } else { document.getElementById('rowPayout').classList.add('hidden'); }
    const head = document.getElementById('resHead');
    if (data.type === 'payout') head.innerHTML = `<tr><th>Year</th><th>Invested</th><th>Interest Payout</th><th>Balance</th></tr>`; else if (data.type === 'ssa') head.innerHTML = `<tr><th>Period (FY)</th><th style="text-align:center;">Age</th><th>Opening</th><th>Deposit</th><th>Interest</th><th>Closing</th></tr>`; else if (data.type === 'ppf') head.innerHTML = `<tr><th>Period (FY)</th><th>Opening</th><th>Deposit</th><th>Interest</th><th>Closing</th></tr>`; else head.innerHTML = `<tr><th>Period</th><th>Opening</th><th>Deposit</th><th>Interest</th><th>Closing</th></tr>`;
    document.getElementById('resBody').innerHTML = data.rows.map(r => {
        if(data.type === 'payout') return `<tr><td>${r.lbl}</td><td>${fmt(r.op)}</td><td>${fmt(r.int)}</td><td>${fmt(r.cl)}</td></tr>`;
        else if (data.type === 'ssa') return `<tr><td>${r.lbl}</td><td style="text-align:center;">${r.age}</td><td>${fmt(r.op)}</td><td>${fmt(r.dep)}</td><td>${fmt(r.int)}</td><td>${fmt(r.cl)}</td></tr>`;
        return `<tr><td>${r.lbl}</td><td>${fmt(r.op)}</td><td>${fmt(r.dep)}</td><td>${fmt(r.int)}</td><td>${fmt(r.cl)}</td></tr>`;
    }).join('');
    document.getElementById('resultsCard').classList.remove('hidden'); document.getElementById('resultsCard').scrollIntoView({behavior:'smooth'});
}

function captureAndShare() {
    const btn = document.getElementById('btnShare'); const originalText = btn.innerText; btn.innerText = "Processing..."; btn.disabled = true;
    const source = document.getElementById('resultsCard'); const clone = source.cloneNode(true);
    if(clone.querySelector('.download-actions')) clone.querySelector('.download-actions').style.display = 'none';
    if(clone.querySelector('#rdExtendSection')) clone.querySelector('#rdExtendSection').style.display = 'none';
    clone.style.width = '794px'; clone.style.minHeight = '1123px'; clone.style.padding = '40px'; clone.style.background = 'white'; clone.style.position = 'fixed'; clone.style.top = '0'; clone.style.left = '0'; clone.style.zIndex = '-100';
    const tableWrap = clone.querySelector('.table-wrapper'); if(tableWrap) { tableWrap.style.overflow = 'visible'; tableWrap.style.border = 'none'; }
    const table = clone.querySelector('table'); if(table) table.style.width = '100%';
    clone.querySelectorAll('th, td').forEach(cell => cell.style.whiteSpace = 'nowrap');
    document.body.appendChild(clone);
    html2canvas(clone, { scale: 2, useCORS: true }).then(canvas => {
        document.body.removeChild(clone); btn.innerText = originalText; btn.disabled = false;
        canvas.toBlob(blob => {
            if (!blob) return; const file = new File([blob], "PostCalc_Statement.png", { type: "image/png" });
            if (navigator.canShare && navigator.canShare({ files: [file] })) { navigator.share({ title: document.getElementById('printSchemeName').innerText, text: 'PostCalc Savings Estimate', files: [file] }).catch(console.error); } 
            else { const link = document.createElement('a'); link.download = 'PostCalc_Statement.png'; link.href = canvas.toDataURL('image/png'); link.click(); }
        }, 'image/png');
    }).catch(err => { document.body.removeChild(clone); btn.innerText = originalText; btn.disabled = false; console.error("Error rendering image:", err); });
        }
    /* =========================================
   PART 5: INIT & APP NAVIGATION
   ========================================= */
function initNavigation() {
    const viewHome = document.getElementById('viewHome'); const viewCalc = document.getElementById('viewCalculator'); const viewTreasury = document.getElementById('viewTreasury'); const btnBack = document.getElementById('btnBackHome');
    function switchView(viewId, isInsurance = false) {
        if(viewHome) viewHome.classList.add('hidden-view'); if(viewCalc) viewCalc.classList.add('hidden-view'); if(viewTreasury) viewTreasury.classList.add('hidden-view'); if(btnBack) btnBack.classList.remove('hidden');
        if (viewId === 'calc' && viewCalc) {
            viewCalc.classList.remove('hidden-view'); const catBtn = document.querySelector(`.toggle-btn[data-cat="${isInsurance ? 'insurance' : 'savings'}"]`); if(catBtn) catBtn.click();
        } else if (viewId === 'treasury' && viewTreasury) {
            viewTreasury.classList.remove('hidden-view'); const tDate = document.getElementById('treasuryDate');
            if(tDate) { tDate.valueAsDate = new Date(); tDate.dispatchEvent(new Event('change')); }
        }
    }
    document.getElementById('navSavings')?.addEventListener('click', () => switchView('calc', false));
    document.getElementById('navInsurance')?.addEventListener('click', () => switchView('calc', true));
    document.getElementById('navTreasury')?.addEventListener('click', () => switchView('treasury'));
    btnBack?.addEventListener('click', () => {
        if(viewHome) viewHome.classList.remove('hidden-view'); if(viewCalc) viewCalc.classList.add('hidden-view'); if(viewTreasury) viewTreasury.classList.add('hidden-view'); btnBack.classList.add('hidden');
    });
}

function initCalculator() {
    const d = new Date(); const dOpen = document.getElementById('dateOpen'); if(dOpen) dOpen.valueAsDate = d;
    const pDate = document.getElementById('printDate'); if(pDate) pDate.innerText += d.toLocaleDateString();
    const realSelector = document.getElementById('schemeSelector'); if(realSelector) realSelector.addEventListener('change', (e) => { toggleInputs(); updateInfoContent(e.target.value); });
    const categoryBtns = document.querySelectorAll('#mainCategoryToggle .toggle-btn'); const dropdownItems = document.querySelectorAll('#dropdownList li'); const ddHeaderText = document.querySelector('#dropdownHeader span');
    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => b.classList.remove('active')); e.target.classList.add('active'); const selectedCategory = e.target.getAttribute('data-cat');
                dropdownItems.forEach(item => { if (item.getAttribute('data-category') === selectedCategory) item.classList.remove('hidden'); else item.classList.add('hidden'); });
                if (realSelector) { realSelector.value = ''; realSelector.dispatchEvent(new Event('change')); }
                dropdownItems.forEach(i => i.classList.remove('selected')); if (ddHeaderText) ddHeaderText.innerHTML = selectedCategory === 'insurance' ? "-- Choose Insurance Plan --" : "-- Choose Saving Scheme --";
            });
        });
    }
    const header = document.getElementById('dropdownHeader'); const list = document.getElementById('dropdownList');
    if (header && list) {
        header.addEventListener('click', () => { list.classList.toggle('open'); header.classList.toggle('active'); });
        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                if(ddHeaderText) ddHeaderText.innerHTML = item.innerHTML; dropdownItems.forEach(i => i.classList.remove('selected')); item.classList.add('selected');
                list.classList.remove('open'); header.classList.remove('active');
                if(realSelector) { realSelector.value = item.getAttribute('data-value'); realSelector.dispatchEvent(new Event('change')); }
            });
        });
        document.addEventListener('click', (e) => { const dDrop = document.getElementById('customSchemeDropdown'); if (dDrop && !dDrop.contains(e.target)) { list.classList.remove('open'); header.classList.remove('active'); } });
    }
    document.getElementById('btnCalculate')?.addEventListener('click', handleCalculate);
    document.getElementById('btnInfo')?.addEventListener('click', openModal);
    document.getElementById('closeInfo')?.addEventListener('click', closeModal);
    document.getElementById('infoModal')?.addEventListener('click', (e) => { if(e.target.id === 'infoModal') closeModal(); });
    document.getElementById('btnShare')?.addEventListener('click', captureAndShare);
    document.getElementById('btnShowExtend')?.addEventListener('click', () => { document.getElementById('btnShowExtend').classList.add('hidden'); document.getElementById('rdExtendInputs').classList.remove('hidden'); });
    document.getElementById('btnCalcExtend')?.addEventListener('click', () => {
        let p = getVal('rdDeposit'); if (p < 100) return showWarn("Minimum deposit is ₹100");
        const dStr = document.getElementById('dateOpen').value; const dX = dStr ? new Date(dStr) : new Date();
        let extRate = getVal('rdExtRate') || 6.7; let extYrs = parseInt(document.getElementById('rdExtYears').value) || 1; let extType = document.getElementById('rdExtType').value || 'with';
        hideWarn(); let res = Engines.calcRD_EXT(p, extRate, extYrs, extType, dX); document.getElementById('printSchemeName').innerText = "RD (Extension)"; if(res) renderSimple(res);
    });
                }
/* =========================================
   PART 6: TREASURY MANAGER & PDF GENERATORS
   ========================================= */
function initTreasury() {
    // Explicitly matched exact headers requested
    const DEFAULT_RECEIPTS = ["Cash from AO", "SB", "RD", "RD Default", "SSA", "IPPB", "PLI / RPLI", "VPP / COD", "TD", "EMO"];
    const DEFAULT_PAYMENTS = ["Cash to AO", "SB Withdrawals", "IPPB Withdrawals", "EMO"];
    
    const treasuryDate = document.getElementById('treasuryDate');
    const valOpeningBal = document.getElementById('valOpeningBal');
    const valClosingBal = document.getElementById('valClosingBal');
    const receiptsList = document.getElementById('receiptsList');
    const paymentsList = document.getElementById('paymentsList');

    // Rename the button via JS to avoid HTML updates
    const btnExecuteExcel = document.getElementById('btnExecuteExcel');
    if (btnExecuteExcel) {
        btnExecuteExcel.innerText = "Download Monthly PDF";
        const optExcel = document.getElementById('optExcel');
        if(optExcel) optExcel.innerText = "Monthly PDF Summary";
    }

    if (treasuryDate) { treasuryDate.addEventListener('change', () => loadLedgerData(treasuryDate.value)); }

    function renderRows(container, items, isPayment, isLocked) {
        if(!container) return; container.innerHTML = '';
        items.forEach(item => {
            const div = document.createElement('div'); div.className = 'trans-row';
            const isCustom = !DEFAULT_RECEIPTS.includes(item.label) && !DEFAULT_PAYMENTS.includes(item.label);
            const labelHtml = isCustom ? `<input type="text" value="${item.label}" class="custom-label" placeholder="Description" style="flex:1; margin-right:10px; font-weight:normal;" ${isLocked ? 'disabled' : ''}>` : `<label>${item.label}</label>`;
            div.innerHTML = `${labelHtml}<input type="number" class="${isPayment ? 'val-payment' : 'val-receipt'}" placeholder="0" value="${item.val > 0 ? item.val : ''}" style="width:120px;" ${isLocked ? 'disabled' : ''}>`;
            container.appendChild(div);
        }); setupTreasuryCalc();
    }

    function setLockState(isLocked) {
        if(valOpeningBal) valOpeningBal.disabled = isLocked;
        const addR = document.getElementById('btnAddReceipt'); if(addR) addR.style.display = isLocked ? 'none' : 'block';
        const addP = document.getElementById('btnAddPayment'); if(addP) addP.style.display = isLocked ? 'none' : 'block';
        const btnSave = document.getElementById('btnSaveLedger');
        if (btnSave) { btnSave.disabled = isLocked; btnSave.innerText = isLocked ? "Saved (Locked)" : "Save Entry"; }
    }

    function loadLedgerData(dateStr) {
        const db = JSON.parse(localStorage.getItem('postcalc_treasury_db')) || {};
        let defaultR = DEFAULT_RECEIPTS.map(lbl => ({label: lbl, val: 0})); 
        let defaultP = DEFAULT_PAYMENTS.map(lbl => ({label: lbl, val: 0}));

        if (db[dateStr]) {
            const entry = db[dateStr]; if(valOpeningBal) valOpeningBal.value = entry.opening;
            renderRows(receiptsList, entry.receipts || defaultR, false, true); 
            renderRows(paymentsList, entry.payments || defaultP, true, true); 
            setLockState(true);
        } else {
            let dates = Object.keys(db).sort(); let prevDate = dates.filter(d => d < dateStr).pop();
            if(valOpeningBal) valOpeningBal.value = prevDate ? db[prevDate].closing : 0;
            renderRows(receiptsList, defaultR, false, false); renderRows(paymentsList, defaultP, true, false); setLockState(false);
        }
        setupTreasuryCalc();
    }

    function calculateTreasuryBalance() {
        let op = parseFloat(valOpeningBal?.value) || 0;
        let receipts = Array.from(document.querySelectorAll('.val-receipt')).reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);
        let payments = Array.from(document.querySelectorAll('.val-payment')).reduce((sum, el) => sum + (parseFloat(el.value) || 0), 0);
        let closing = op + receipts - payments; 
        if(valClosingBal) valClosingBal.innerText = "₹" + closing.toLocaleString('en-IN', {minimumFractionDigits: 2});
    }

    function setupTreasuryCalc() {
        document.querySelectorAll('.val-receipt, .val-payment, #valOpeningBal').forEach(input => {
            input.removeEventListener('input', calculateTreasuryBalance); input.addEventListener('input', calculateTreasuryBalance);
        }); calculateTreasuryBalance();
    }

    document.getElementById('btnSaveLedger')?.addEventListener('click', () => {
        const dateStr = treasuryDate?.value; if (!dateStr) return alert("Please select a date first.");
        let receiptsData = []; document.querySelectorAll('#receiptsList .trans-row').forEach(row => { let labelEl = row.querySelector('label') || row.querySelector('.custom-label'); let label = labelEl.innerText || labelEl.value || "Other Receipt"; let val = parseFloat(row.querySelector('.val-receipt').value) || 0; receiptsData.push({label, val}); });
        let paymentsData = []; document.querySelectorAll('#paymentsList .trans-row').forEach(row => { let labelEl = row.querySelector('label') || row.querySelector('.custom-label'); let label = labelEl.innerText || labelEl.value || "Other Payment"; let val = parseFloat(row.querySelector('.val-payment').value) || 0; paymentsData.push({label, val}); });
        const closingNum = parseFloat(valClosingBal?.innerText.replace(/[^0-9.-]+/g,"")) || 0;
        const db = JSON.parse(localStorage.getItem('postcalc_treasury_db')) || {};
        db[dateStr] = { opening: parseFloat(valOpeningBal?.value) || 0, closing: closingNum, receipts: receiptsData, payments: paymentsData, timestamp: new Date().getTime() };
        localStorage.setItem('postcalc_treasury_db', JSON.stringify(db));
        alert("Daily Account Saved & Locked for " + dateStr); loadLedgerData(dateStr); 
    });

    document.getElementById('btnAddReceipt')?.addEventListener('click', () => { renderRows(receiptsList, [...getFormState(receiptsList), {label: "", val: 0}], false, false); });
    document.getElementById('btnAddPayment')?.addEventListener('click', () => { renderRows(paymentsList, [...getFormState(paymentsList), {label: "", val: 0}], true, false); });
    function getFormState(container) { let data = []; if(!container) return data; container.querySelectorAll('.trans-row').forEach(row => { let labelEl = row.querySelector('label') || row.querySelector('.custom-label'); let label = labelEl.innerText || labelEl.value || ""; let val = parseFloat(row.querySelector('input[type="number"]').value) || 0; data.push({label, val}); }); return data; }

    const menuBtn = document.getElementById('btnTreasuryMenu'); const menuDropdown = document.getElementById('treasuryDropdown');
    const toolsModal = document.getElementById('toolsModal'); const uiPastBoda = document.getElementById('uiPastBoda'); const uiExcel = document.getElementById('uiExcel'); const toolsTitle = document.getElementById('toolsModalTitle');
    
    menuBtn?.addEventListener('click', (e) => { e.stopPropagation(); menuDropdown?.classList.toggle('hidden'); });
    document.addEventListener('click', () => { if(menuDropdown && !menuDropdown.classList.contains('hidden')) menuDropdown.classList.add('hidden'); });
    
    document.getElementById('optPastBoda')?.addEventListener('click', () => { uiPastBoda?.classList.remove('hidden'); uiExcel?.classList.add('hidden'); if(toolsTitle) toolsTitle.innerText = "Download Past BODA"; toolsModal?.classList.add('show'); });
    document.getElementById('optExcel')?.addEventListener('click', () => { uiPastBoda?.classList.add('hidden'); uiExcel?.classList.remove('hidden'); if(toolsTitle) toolsTitle.innerText = "Monthly PDF Report"; toolsModal?.classList.add('show'); });
    document.getElementById('closeTools')?.addEventListener('click', () => { toolsModal?.classList.remove('show'); });

    document.getElementById('btnExecutePastBoda')?.addEventListener('click', () => {
        const pDate = document.getElementById('inputPastBoda')?.value; if(!pDate) return alert("Select a date.");
        const db = JSON.parse(localStorage.getItem('postcalc_treasury_db')) || {}; if(!db[pDate]) return alert("No saved data found for " + pDate);
        toolsModal?.classList.remove('show'); if(treasuryDate) treasuryDate.value = pDate; loadLedgerData(pDate); setTimeout(() => { document.getElementById('btnGenerateBODA')?.click(); }, 300);
    });

    // NEW MONTHLY PDF GENERATOR
    document.getElementById('btnExecuteExcel')?.addEventListener('click', () => {
        const monthStr = document.getElementById('inputExcelMonth')?.value; if(!monthStr) return alert("Select a month.");
        const db = JSON.parse(localStorage.getItem('postcalc_treasury_db')) || {};
        
        let boName = localStorage.getItem('pc_bo_name') || "Your B.O";
        let aoName = localStorage.getItem('pc_ao_name') || "Your S.O";
        
        let htmlRows = ''; let found = false;
        let totals = {ob:0, cfromao:0, sbR:0, rd:0, rdDef:0, ssa:0, ippbR:0, pli:0, vpp:0, td:0, emoR:0, ctoao:0, sbP:0, ippbP:0, emoP:0, cb:0};

        const [yyyy, mm] = monthStr.split('-');
        const daysInMonth = new Date(yyyy, mm, 0).getDate();
        
        for(let d=1; d<=daysInMonth; d++) {
            let dateKey = `${yyyy}-${mm}-${("0"+d).slice(-2)}`;
            if(db[dateKey]) {
                found = true; const entry = db[dateKey];
                const getR = (lbl) => (entry.receipts || []).find(i => i.label === lbl)?.val || 0;
                const getP = (lbl) => (entry.payments || []).find(i => i.label === lbl)?.val || 0;

                let ob = entry.opening || 0; let cfromao = getR("Cash from AO"); let sbR = getR("SB"); let rd = getR("RD"); let rdDef = getR("RD Default"); let ssa = getR("SSA"); let ippbR = getR("IPPB"); let pli = getR("PLI / RPLI"); let vpp = getR("VPP / COD"); let td = getR("TD"); let emoR = getR("EMO");
                let ctoao = getP("Cash to AO"); let sbP = getP("SB Withdrawals") || getP("SB"); let ippbP = getP("IPPB Withdrawals") || getP("IPPB"); let emoP = getP("EMO"); let cb = entry.closing || 0;

                totals.ob += ob; totals.cfromao += cfromao; totals.sbR += sbR; totals.rd += rd; totals.rdDef += rdDef; totals.ssa += ssa; totals.ippbR += ippbR; totals.pli += pli; totals.vpp += vpp; totals.td += td; totals.emoR += emoR; totals.ctoao += ctoao; totals.sbP += sbP; totals.ippbP += ippbP; totals.emoP += emoP; totals.cb += cb;

                htmlRows += `<tr><td style="border:1px solid black; padding:3px;">${("0"+d).slice(-2)}-${mm}-${yyyy}</td><td style="border:1px solid black; padding:3px;">${ob.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${cfromao.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${sbR.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${rd.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${rdDef.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${ssa.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${ippbR.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${pli.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${vpp.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${td.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${emoR.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${ctoao.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${sbP.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${ippbP.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${emoP.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${cb.toFixed(1)}</td></tr>`;
            }
        }
        if(!found) return alert("No data found for this month.");

        htmlRows += `<tr style="font-weight:bold; background:#eee;"><td style="border:1px solid black; padding:3px;">TOTAL</td><td style="border:1px solid black; padding:3px;">-</td><td style="border:1px solid black; padding:3px;">${totals.cfromao.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.sbR.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.rd.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.rdDef.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.ssa.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.ippbR.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.pli.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.vpp.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.td.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.emoR.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.ctoao.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.sbP.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.ippbP.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">${totals.emoP.toFixed(1)}</td><td style="border:1px solid black; padding:3px;">-</td></tr>`;

        const btn = document.getElementById('btnExecuteExcel'); const originalText = btn.innerText; btn.innerText = "Generating..."; btn.disabled = true;

        const printDiv = document.createElement('div');
        printDiv.style.width = '1200px'; printDiv.style.padding = '30px'; printDiv.style.background = 'white'; printDiv.style.position = 'fixed'; printDiv.style.top = '-10000px'; printDiv.style.color = 'black'; printDiv.style.fontFamily = 'Arial, sans-serif'; printDiv.style.fontSize = '10px';

        printDiv.innerHTML = `
            <div style="text-align: center; margin-bottom: 20px;">
                <h2 style="margin: 0; font-size: 16px;">DEPARTMENT OF POSTS, INDIA</h2>
                <h3 style="margin: 5px 0; font-size: 14px;">Monthly Treasury Summary</h3>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 12px; font-weight: bold;">
                <div>Branch Office: ${boName}</div><div>Account Office: ${aoName}</div><div>Month: ${monthStr}</div>
            </div>
            <table style="width: 100%; border-collapse: collapse; border: 1px solid black; text-align: right;">
                <thead>
                    <tr style="background:#f8f9fa;">
                        <th rowspan="2" style="border:1px solid black; padding:4px; text-align:center;">Date</th>
                        <th rowspan="2" style="border:1px solid black; padding:4px; text-align:center;">OB</th>
                        <th colspan="10" style="border:1px solid black; padding:4px; text-align:center;">Receipts</th>
                        <th colspan="4" style="border:1px solid black; padding:4px; text-align:center;">Payments</th>
                        <th rowspan="2" style="border:1px solid black; padding:4px; text-align:center;">CB</th>
                    </tr>
                    <tr style="background:#f8f9fa;">
                        <th style="border:1px solid black; padding:4px; text-align:center;">Cash FM AO</th><th style="border:1px solid black; padding:4px; text-align:center;">SB</th><th style="border:1px solid black; padding:4px; text-align:center;">RD</th><th style="border:1px solid black; padding:4px; text-align:center;">RD Def</th><th style="border:1px solid black; padding:4px; text-align:center;">SSA</th><th style="border:1px solid black; padding:4px; text-align:center;">IPPB</th><th style="border:1px solid black; padding:4px; text-align:center;">PLI/RPLI</th><th style="border:1px solid black; padding:4px; text-align:center;">VPP/COD</th><th style="border:1px solid black; padding:4px; text-align:center;">TD</th><th style="border:1px solid black; padding:4px; text-align:center;">EMO</th>
                        <th style="border:1px solid black; padding:4px; text-align:center;">Cash TO AO</th><th style="border:1px solid black; padding:4px; text-align:center;">SB</th><th style="border:1px solid black; padding:4px; text-align:center;">IPPB</th><th style="border:1px solid black; padding:4px; text-align:center;">EMO</th>
                    </tr>
                </thead>
                <tbody>${htmlRows}</tbody>
            </table>
        `;

        document.body.appendChild(printDiv);
        html2canvas(printDiv, { scale: 2 }).then(canvas => {
            document.body.removeChild(printDiv); btn.innerText = originalText; btn.disabled = false;
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf; const pdf = new jsPDF('l', 'mm', 'a4'); // LANDSCAPE
            const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); pdf.save(`Monthly_Summary_${monthStr}.pdf`);
            if (toolsModal) toolsModal.classList.remove('show');
        }).catch(e => { alert("PDF Engine error: " + e.message); btn.innerText = originalText; btn.disabled = false; });
    });

    document.getElementById('btnGenerateBODA')?.addEventListener('click', () => {
        const btn = document.getElementById('btnGenerateBODA'); const originalText = btn.innerText; btn.innerText = "Generating..."; btn.disabled = true;
        let boName = localStorage.getItem('pc_bo_name') || prompt("Enter Branch Office Name:", "Digras BK B.O"); if(boName) localStorage.setItem('pc_bo_name', boName); else boName = "Your B.O";
        let aoName = localStorage.getItem('pc_ao_name') || prompt("Enter Account Office Name:", "Deulgaon Mahi S.O"); if(aoName) localStorage.setItem('pc_ao_name', aoName); else aoName = "Your S.O";
        let userName = localStorage.getItem('pc_user_name') || prompt("Enter BPM Name & ID:", "SUNIL (50041216)"); if(userName) localStorage.setItem('pc_user_name', userName); else userName = "BPM Name (ID)";
        try {
            const getWords = (num) => {
                if (!num || num === 0) return "Zero";
                const a = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
                const b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
                const convert = (n) => { if (n < 20) return a[n]; if (n < 100) return b[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + a[n % 10] : ""); if (n < 1000) return a[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convert(n % 100) : ""); return ""; };
                let str = ""; let n = Math.floor(num); if (n >= 10000000) { str += convert(Math.floor(n / 10000000)) + " Crore "; n %= 10000000; } if (n >= 100000) { str += convert(Math.floor(n / 100000)) + " Lakh "; n %= 100000; } if (n >= 1000) { str += convert(Math.floor(n / 1000)) + " Thousand "; n %= 1000; } if (n > 0) { str += convert(n); } return str.trim();
            };
            const printDiv = document.createElement('div'); printDiv.style.width = '800px'; printDiv.style.padding = '40px'; printDiv.style.background = 'white'; printDiv.style.position = 'fixed'; printDiv.style.top = '-10000px'; printDiv.style.color = 'black'; printDiv.style.fontFamily = 'Arial, sans-serif'; printDiv.style.fontSize = '12px';
            let totalReceipts = 0; let totalPayments = 0; let tableRows = ''; let sno = 1;
            document.querySelectorAll('#receiptsList .trans-row').forEach(row => { let label = row.querySelector('label') ? row.querySelector('label').innerText : row.querySelector('input[type="text"]').value; let val = parseFloat(row.querySelector('.val-receipt').value) || 0; if (val > 0) { totalReceipts += val; tableRows += `<tr><td style="border: 1px solid black; padding: 6px; text-align: center;">${sno++}</td><td style="border: 1px solid black; padding: 6px; font-weight: bold;">${label} - Receipts</td><td style="border: 1px solid black; padding: 6px; text-align: right;">${val.toFixed(2)}</td><td style="border: 1px solid black; padding: 6px;"></td></tr>`; } });
            document.querySelectorAll('#paymentsList .trans-row').forEach(row => { let label = row.querySelector('label') ? row.querySelector('label').innerText : row.querySelector('input[type="text"]').value; let val = parseFloat(row.querySelector('.val-payment').value) || 0; if (val > 0) { totalPayments += val; tableRows += `<tr><td style="border: 1px solid black; padding: 6px; text-align: center;">${sno++}</td><td style="border: 1px solid black; padding: 6px; font-weight: bold;">${label} - Payments</td><td style="border: 1px solid black; padding: 6px;"></td><td style="border: 1px solid black; padding: 6px; text-align: right;">${val.toFixed(2)}</td></tr>`; } });
            const openingBal = parseFloat(valOpeningBal?.value) || 0; const closingBalRaw = openingBal + totalReceipts - totalPayments; const reportDate = document.getElementById('treasuryDate')?.value.split('-').reverse().join('-') || ""; const now = new Date(); const genDate = `${("0"+now.getDate()).slice(-2)}-${("0"+(now.getMonth()+1)).slice(-2)}-${now.getFullYear()} ${("0"+now.getHours()).slice(-2)}:${("0"+now.getMinutes()).slice(-2)}`;
            
            printDiv.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
                    <div style="width: 20%;"><img src="icon-192.png" style="width: 45px;"></div>
                    <div style="width: 60%; text-align: center;"><h2 style="margin: 0; font-size: 16px;">DEPARTMENT OF POSTS, INDIA</h2><h3 style="margin: 5px 0; font-size: 14px;">Branch Office Daily Account</h3></div>
                    <div style="width: 20%; text-align: right; font-size: 10px; font-weight: bold;">A.C.G-22 (A)<br>Preservation Period - 2 Yr</div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 25px; align-items: center;">
                    <div style="flex: 1;"><div style="font-weight:bold;">To,</div><div style="margin-top: 25px; display: flex; align-items: flex-end;"><div style="border-bottom: 1px solid black; width: 280px; text-align: center; padding-bottom: 2px; font-weight:bold; font-size: 13px;">${aoName}</div><div style="margin-left: 10px; font-weight: bold; font-size:13px;">H.O / S.O</div></div><div style="text-align: center; width: 280px; font-size: 11px;">(Name of Account Office)</div></div>
                    <div style="width: 90px; height: 90px; border: 2px solid black; border-radius: 50%; display: flex; align-items: center; justify-content: center; text-align: center; font-size: 11px; font-weight: bold;">Date Stamp of<br>Branch Office</div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px; font-size: 13px;">
                    <div style="line-height: 1.6;"><div>Office Name: <strong>${boName}</strong></div><div>User Name: <strong>${userName}</strong></div><div>Opening Balance: <strong>${openingBal.toFixed(1)}</strong></div></div>
                    <div style="line-height: 1.6; text-align: right;"><div>Generation Date: ${genDate}</div><div>Report Date: ${reportDate}</div></div>
                </div>
                <table style="width: 100%; border-collapse: collapse; border: 1px solid black; margin-bottom: 40px; font-size: 13px;">
                    <tr style="border: 1px solid black;"><td colspan="2" style="border: 1px solid black; padding: 6px;">Min. Balance: 12000</td><td colspan="2" style="border: 1px solid black; padding: 6px; text-align: right;">Max. Balance: 20000</td></tr>
                    <tr style="border: 1px solid black; font-weight: bold;"><th style="border: 1px solid black; padding: 6px; width: 8%;">SNo</th><th style="border: 1px solid black; padding: 6px; width: 52%; text-align: center;">Details of Transactions</th><th style="border: 1px solid black; padding: 6px; width: 20%; text-align: right;">Receipts</th><th style="border: 1px solid black; padding: 6px; width: 20%; text-align: right;">Payments</th></tr>
                    ${tableRows}
                    <tr style="border: 1px solid black;"><td colspan="2" style="border: 1px solid black; padding: 6px; text-align: center;">Total</td><td style="border: 1px solid black; padding: 6px; text-align: right;">${totalReceipts.toFixed(2)}</td><td style="border: 1px solid black; padding: 6px; text-align: right;">${totalPayments.toFixed(2)}</td></tr>
                    <tr style="border: 1px solid black;"><td colspan="2" style="border: 1px solid black; padding: 6px;">Balance due to Account Office:</td><td colspan="2" style="border: 1px solid black; padding: 6px; text-align: center;">0</td></tr>
                    <tr style="border: 1px solid black;"><td colspan="2" style="border: 1px solid black; padding: 6px; text-align: center;">Closing Balance:</td><td colspan="2" style="border: 1px solid black; padding: 6px; text-align: center; font-weight: bold;">${closingBalRaw.toFixed(2)}</td></tr>
                    <tr style="border: 1px solid black;"><td style="border: 1px solid black; padding: 6px;">In Words:</td><td colspan="3" style="border: 1px solid black; padding: 6px; text-align: center;">${getWords(closingBalRaw)} Rupees</td></tr>
                </table>
                <div style="text-align: right; margin-top: 40px; margin-bottom: 30px; font-size: 13px;">Branch Postmaster, ${boName}</div>
                <div style="text-align: right; font-size: 11px; font-weight: bold;">Page 1 of 1</div>
            `;
            document.body.appendChild(printDiv);
            html2canvas(printDiv, { scale: 2 }).then(canvas => {
                document.body.removeChild(printDiv); btn.innerText = originalText; btn.disabled = false;
                const imgData = canvas.toDataURL('image/png');
                const { jsPDF } = window.jspdf; const pdf = new jsPDF('p', 'mm', 'a4');
                const pdfWidth = pdf.internal.pageSize.getWidth(); const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight); pdf.save(`BODA_${document.getElementById('treasuryDate').value}.pdf`);
            });
        } catch(e) { alert("PDF Engine error: " + e.message); btn.innerText = originalText; btn.disabled = false; }
    });
}

// BOOTSTRAP PIPELINE
document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initCalculator();
    initTreasury();
});

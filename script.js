/* =========================================
   PART 1: CONFIGURATION & RULES
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
    'pli': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Bonus Rate</th><td>Rs. 52 per 1000 SA per year</td></tr><tr><th>Entry Age</th><td>19 to 55 Years</td></tr><tr><th>Min Sum Assured</th><td>₹20,000</td></tr><tr><th>Max Sum Assured</th><td>₹50 Lakhs</td></tr></table><div class="info-section-title">Calculation & Rules</div><table class="info-table"><tr><th>GST Rules</th><td>0% for payments on/after Sept 22, 2025. Legacy payments bear 4.5% (Yr 1).</td></tr><tr><th>HSA Rebate</th><td>Re. 1 per month per ₹20,000 block or part thereof.</td></tr></table>`,
    'rpli': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Bonus Rate</th><td>Rs. 48 per 1000 SA per year</td></tr><tr><th>Entry Age</th><td>19 to 55 Years</td></tr><tr><th>Min Sum Assured</th><td>₹10,000</td></tr><tr><th>Max Sum Assured</th><td>₹10 Lakhs</td></tr></table><div class="info-section-title">Calculation & Rules</div><table class="info-table"><tr><th>GST Rules</th><td>0% for payments on/after Sept 22, 2025. Legacy payments bear 4.5% (Yr 1).</td></tr><tr><th>HSA Rebate</th><td>Re. 1 per month per ₹20,000 block or part thereof.</td></tr></table>`,
    'sb': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>4.0% per annum</td></tr><tr><th>Tenure</th><td>Continuing Account</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹500</td></tr><tr><th>Max Deposit</th><td>No Limit</td></tr></table>`,
    'rd': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>6.7% per annum</td></tr><tr><th>Tenure</th><td>5 Years (Extendable)</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹100 per month</td></tr><tr><th>Max Deposit</th><td>No Limit</td></tr></table>`,
    'ssa': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>8.2% per annum</td></tr><tr><th>Tenure</th><td>21 Years</td></tr><tr><th>Eligibility</th><td>Girl Child (Below 10)</td></tr><tr><th>Min Deposit</th><td>₹250 per year</td></tr><tr><th>Max Deposit</th><td>₹1.5 Lakh per year</td></tr></table>`,
    'ppf': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.1% per annum</td></tr><tr><th>Tenure</th><td>15 Years</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹500 per year</td></tr><tr><th>Max Deposit</th><td>₹1.5 Lakh per year</td></tr></table>`,
    'mis': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.4% per annum</td></tr><tr><th>Tenure</th><td>5 Years</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹1,000</td></tr><tr><th>Max Deposit</th><td>₹9L (Single)/₹15L (Joint)</td></tr></table>`,
    'td': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>1Y:6.9%, 2Y:7.0%, 3Y:7.1%, 5Y:7.5%</td></tr><tr><th>Tenure</th><td>1, 2, 3, or 5 Years</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹1,000</td></tr><tr><th>Max Deposit</th><td>No Limit</td></tr></table>`,
    'scss': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>8.2% per annum</td></tr><tr><th>Tenure</th><td>5 Years</td></tr><tr><th>Eligibility</th><td>Age 60+ (55+ for VRS)</td></tr><tr><th>Min Deposit</th><td>₹1,000</td></tr><tr><th>Max Deposit</th><td>₹30 Lakh</td></tr></table>`,
    'nsc': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.7% per annum</td></tr><tr><th>Tenure</th><td>5 Years</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹1,000</td></tr><tr><th>Max Deposit</th><td>No Limit</td></tr></table>`,
    'kvp': `<div class="info-section-title">Overview</div><table class="info-table"><tr><th>Interest Rate</th><td>7.5% per annum</td></tr><tr><th>Tenure</th><td>115 Months</td></tr><tr><th>Eligibility</th><td>Resident Individual</td></tr><tr><th>Min Deposit</th><td>₹1,000</td></tr><tr><th>Max Deposit</th><td>No Limit</td></tr></table>`
};

function numToWord(val, divId) {
    const div = document.getElementById(divId); if (!div) return;
    let n = parseInt(val);
    if (!n || n === 0) { div.innerText = ""; return; }
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
    const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    function convert(num) {
        if (num < 10) return units[num];
        if (num < 20) return teens[num - 10];
        if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 !== 0 ? " " + units[num % 10] : "");
        if (num < 1000) return units[Math.floor(num / 100)] + " Hundred" + (num % 100 !== 0 ? " " + convert(num % 100) : "");
        return "";
    }
    let str = "";
    if (n >= 10000000) { str += convert(Math.floor(n / 10000000)) + " Crore "; n %= 10000000; }
    if (n >= 100000) { str += convert(Math.floor(n / 100000)) + " Lakh "; n %= 100000; }
    if (n >= 1000) { str += convert(Math.floor(n / 1000)) + " Thousand "; n %= 1000; }
    if (n > 0) { str += convert(n); }
    div.innerText = str + " Rupees Only";
}

const PLI_TABLE = {
    19: {35:52, 40:38, 45:30, 50:24, 55:20, 58:18, 60:18},
    20: {35:54, 40:40, 45:32, 50:26, 55:20, 58:20, 60:18},
    21: {35:58, 40:42, 45:32, 50:26, 55:22, 58:20, 60:18},
    22: {35:64, 40:44, 45:34, 50:28, 55:22, 58:20, 60:20},
    23: {35:70, 40:48, 45:36, 50:28, 55:24, 58:20, 60:20},
    24: {35:76, 40:52, 45:38, 50:30, 55:24, 58:22, 60:20},
    25: {35:84, 40:54, 45:40, 50:32, 55:26, 58:22, 60:22},
    26: {35:94, 40:58, 45:42, 50:32, 55:26, 58:24, 60:22},
    27: {35:106, 40:64, 45:44, 50:34, 55:28, 58:24, 60:24},
    28: {35:122, 40:70, 45:48, 50:36, 55:28, 58:26, 60:24},
    29: {35:144, 40:76, 45:52, 50:38, 55:30, 58:26, 60:26},
    30: {35:172, 40:84, 45:56, 50:40, 55:32, 58:28, 60:26},
    31: {40:96, 45:60, 50:44, 55:34, 58:30, 60:28},
    32: {40:106, 45:64, 50:46, 55:34, 58:30, 60:28},
    33: {40:122, 45:70, 50:48, 55:36, 58:32, 60:28},
    34: {40:144, 45:76, 50:52, 55:38, 58:34, 60:30},
    35: {40:172, 45:84, 50:56, 55:40, 58:34, 60:32},
    36: {45:94, 50:60, 55:44, 58:38, 60:34},
    37: {45:106, 50:64, 55:46, 58:40, 60:36},
    38: {45:122, 50:70, 55:50, 58:42, 60:38},
    39: {45:144, 50:78, 55:54, 58:44, 60:40},
    40: {45:174, 50:86, 55:56, 58:46, 60:42},
    41: {50:96, 55:60, 58:50, 60:44},
    42: {50:108, 55:66, 58:54, 60:48},
    43: {50:124, 55:72, 58:58, 60:50},
    44: {50:144, 55:78, 58:62, 60:54},
    45: {50:174, 55:86, 58:66, 60:58},
    46: {55:96, 58:72, 60:62},
    47: {55:110, 58:80, 60:68},
    48: {55:126, 58:88, 60:74},
    49: {55:146, 58:98, 60:80},
    50: {55:176, 58:110, 60:88},
    51: {58:126, 60:98},
    52: {58:150, 60:118},
    53: {58:178, 60:132},
    54: {60:152},
    55: {60:178}
};

const RPLI_TABLE = {
    19: {35:5.10, 40:3.75, 45:2.95, 50:2.40, 55:2.00, 58:1.85, 60:1.75},
    20: {35:5.45, 40:3.95, 45:3.10, 50:2.50, 55:2.05, 58:1.90, 60:1.80},
    21: {35:5.85, 40:4.20, 45:3.25, 50:2.60, 55:2.10, 58:1.95, 60:1.85},
    22: {35:6.35, 40:4.45, 45:13.40, 50:2.70, 55:2.20, 58:2.00, 60:1.90}, 
    23: {35:6.95, 40:4.75, 45:3.55, 50:2.80, 55:2.30, 58:2.05, 60:1.95},
    24: {35:7.65, 40:5.10, 45:3.75, 50:2.95, 55:2.40, 58:2.15, 60:2.00},
    25: {35:8.45, 40:5.45, 45:3.95, 50:3.10, 55:2.50, 58:2.25, 60:2.10},
    26: {35:9.45, 40:5.85, 45:4.20, 50:3.25, 55:2.60, 58:2.35, 60:2.20},
    27: {35:10.70, 40:6.35, 45:4.45, 50:3.40, 55:2.70, 58:2.45, 60:2.30},
    28: {35:12.30, 40:6.95, 45:4.75, 50:3.60, 55:2.85, 58:2.55, 60:2.40},
    29: {35:14.40, 40:7.65, 45:5.10, 50:3.80, 55:3.00, 58:2.65, 60:2.50},
    30: {35:17.40, 40:8.45, 45:5.45, 50:4.00, 55:3.15, 58:2.75, 60:2.60},
    31: {40:9.45, 45:5.90, 50:4.25, 55:3.30, 58:2.90, 60:2.70},
    32: {40:10.70, 45:6.40, 50:4.50, 55:3.45, 58:3.05, 60:2.80},
    33: {40:12.30, 45:6.95, 50:4.80, 55:3.65, 58:3.20, 60:2.95},
    34: {40:14.40, 45:7.65, 50:5.15, 55:3.85, 58:3.35, 60:3.05},
    35: {40:17.40, 45:8.45, 50:5.50, 55:4.05, 58:3.50, 60:3.20}
};

function generateInsuranceGrid(sa, entryAge, type, d, mode) {
    const permittedMaturityAges = [35, 40, 45, 50, 55, 58, 60];
    let rows = [];
    
    let matrix = type === 'pli' ? PLI_TABLE : RPLI_TABLE;
    let baseline = type === 'pli' ? 10000 : 1000;
    let bonusRate = type === 'pli' ? 52 : 48;
    
    let gstRate = 0.045; 
    const reformDate = new Date("2025-09-22");
    if (d >= reformDate) gstRate = 0.0; 

    let n = 1;
    let discountPct = 0;
    if (mode === 'yearly') { n = 12; discountPct = 0.02; }
    else if (mode === 'half') { n = 6; discountPct = 0.01; }
    else if (mode === 'quarterly') { n = 3; discountPct = type === 'rpli' ? 0.005 : 0; }

    permittedMaturityAges.forEach(matAge => {
        let term = matAge - entryAge;
        if (term > 0 && matrix[entryAge] && matrix[entryAge][matAge]) {
            
            let tableRate = matrix[entryAge][matAge];
            let monthlyGross = (sa / baseline) * tableRate;
            
            let totalRebateRaw = (sa / 20000) * n;
            let displayRebate = Math.floor(totalRebateRaw); 
            let actualRebate = Math.ceil(totalRebateRaw); 
            
            let aggregatedGross = monthlyGross * n;
            let finalGrossPrem = Math.round(aggregatedGross - (aggregatedGross * discountPct));
            
            // Scaled Quirk Match for Official App
            if (type === 'pli') {
                if (mode === 'quarterly') finalGrossPrem = Math.round(monthlyGross * 3) - Math.round((sa/150000) * 9);
                if (mode === 'half') finalGrossPrem = Math.round(monthlyGross * 6) - Math.round((sa/150000) * 126);
                if (mode === 'yearly') finalGrossPrem = Math.round(monthlyGross * 12) - Math.round((sa/150000) * 507);
            }

            let intermediatePremium = finalGrossPrem - actualRebate;
            let taxAmt = Math.round(intermediatePremium * gstRate);
            let netPremium = intermediatePremium + taxAmt;
            
            let reversionaryBonus = (sa / 1000) * bonusRate * term;
            let totalBonus = reversionaryBonus; 
            let finalMaturity = sa + totalBonus;

            rows.push({
                matAge: matAge,
                duration: term,
                premium: finalGrossPrem,
                rebate: displayRebate,
                tax: taxAmt,
                net: netPremium,
                bonus: totalBonus,
                matAmt: finalMaturity
            });
        }
    });
    return rows;
}

const Engines = {
    calcSB: (p, r, d) => {
        let yrs = parseInt(document.getElementById('sbTenure').value) || 1;
        let rows = []; let bal = p; let startMonth = (d.getDate() > 10) ? 1 : 0; 
        let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + yrs);
        for (let i = 1; i <= yrs; i++) {
            let int = 0;
            if (i === 1 && startMonth === 1) int = Math.round(bal * (r/100) * (11/12)); else int = Math.round(bal * (r/100));
            let op = bal; bal += int; rows.push({ lbl: `Year ${i}`, op: op, dep: 0, int: int, cl: bal });
        }
        return { dep: p, int: bal - p, mat: bal, date: matDate, rows: rows, type: 'compound' };
    },
    calcTD: (p, r, t, d) => {
        let ratePerQ = r / 400; let amtAfter1Year = p * Math.pow(1 + ratePerQ, 4); let annualPay = Math.round(amtAfter1Year - p);
        let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + t); let rows = [];
        for(let i=1; i<=t; i++) rows.push({ lbl: `Year ${i}`, op: p, dep: 0, int: annualPay, cl: p });
        return { dep: p, int: annualPay * t, mat: p, payout: annualPay, date: matDate, rows: rows, type: 'payout', freq: ' / year' };
    },
    calcPayout: (p, r, yrs, freq, d) => {
        let pay = Math.round((p * r / 100) / freq); let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + yrs); let rows = [];
        for (let i = 1; i <= yrs; i++) rows.push({ lbl: `Year ${i}`, op: p, dep: 0, int: pay * freq, cl: p });
        let freqLabel = (freq === 12) ? ' / month' : ' / quarter';
        return { dep: p, int: pay * freq * yrs, mat: p, payout: pay, date: matDate, rows: rows, type: 'payout', freq: freqLabel };
    },
    calcPPF_SSA: (p, r, d, type, mode, startAge = 0) => {
        let bal = 0, totDep = 0; let rows = []; let matDate = new Date(d); let depEndDate = new Date(d);
        if (type === 'ppf') { let fyEndMonth = d.getMonth() > 2 ? d.getFullYear() + 1 : d.getFullYear(); matDate = new Date(fyEndMonth + 15, 2, 31); depEndDate = matDate; } 
        else { matDate.setFullYear(d.getFullYear() + 21); depEndDate = new Date(d); depEndDate.setFullYear(d.getFullYear() + 15); }
        let curr = new Date(d); curr.setDate(1); let yrData = { op: 0, dep: 0, int: 0, cl: 0 }; let accInt = 0; let openDay = d.getDate();
        let yearsElapsed = 0;
        while (curr < matDate) {
            let m = curr.getMonth(); let y = curr.getFullYear(); let monDep = 0;
            if (curr < depEndDate) {
                if (mode === 'monthly') monDep = p;
                else if (mode === 'annual') { if (m === 3 || (y === d.getFullYear() && m === d.getMonth())) monDep = p; }
            }
            bal += monDep; totDep += monDep; yrData.dep += monDep;
            let qualifyingBal = bal; let isFirstMonth = (curr.getMonth() === d.getMonth() && curr.getFullYear() === d.getFullYear());
            if (isFirstMonth && openDay > 5 && monDep > 0) qualifyingBal = bal - monDep;
            let int = (qualifyingBal * r) / 1200; accInt += int;
            if (m === 2 || (curr.getTime() + 2600000000 > matDate.getTime())) {
                let credit = Math.round(accInt); bal += credit; yrData.int = credit; yrData.cl = bal; 
                if (yrData.dep > 0 || yrData.int > 0) {
                    let fyStart = m <= 2 ? y - 1 : y; 
                    let fyEndStr = (fyStart + 1).toString().slice(-2);
                    rows.push({ lbl: `${fyStart}-${fyEndStr}`, age: startAge + yearsElapsed, op: yrData.op, dep: yrData.dep, int: yrData.int, cl: yrData.cl });
                    yearsElapsed++;
                }
                yrData = { op: bal, dep: 0, int: 0, cl: 0 }; accInt = 0;
            }
            curr.setMonth(curr.getMonth() + 1);
        }
        return { dep: totDep, int: bal - totDep, mat: bal, date: matDate, rows: rows, type: type };
    },
    calcRD: (p, r, d) => {
        let rows = [], bal = 0, bucket = 0, totDep = 0; let yrOp = 0, yrDep = 0; let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + 5);
        for (let i = 1; i <= 60; i++) {
            bal += p; totDep += p; yrDep += p; bucket += (bal * r) / 1200;
            if (i % 3 === 0) { bal += bucket; bucket = 0; }
            if (i % 12 === 0) { rows.push({ lbl: `Year ${i/12}`, op: yrOp, dep: yrDep, int: Math.round(bal - yrOp - yrDep), cl: Math.round(bal) }); yrOp = Math.round(bal); yrDep = 0; }
        }
        return { dep: totDep, int: Math.round(bal) - totDep, mat: Math.round(bal), date: matDate, rows: rows, type: 'compound' };
    },
    calcNSC: (p, r, d) => {
        let matDate = new Date(d); matDate.setFullYear(d.getFullYear() + 5); let rows = [], bal = p;
        for(let i=1; i<=5; i++) { let int = Math.round(bal * r / 100); rows.push({ lbl: `Year ${i}`, op: Math.round(bal), dep: 0, int: int, cl: Math.round(bal+int) }); bal += int; }
        return { dep: p, int: Math.round(bal)-p, mat: Math.round(bal), date: matDate, rows: rows, type: 'compound' };
    },
    calcKVP: (p, r, d) => {
        let matDate = new Date(d); matDate.setMonth(d.getMonth() + 115);
        return { dep: p, int: p, mat: p*2, date: matDate, rows: [{lbl:'Maturity (115 Mo)', op:p, dep:0, int:p, cl:p*2}], type: 'compound' };
    },
    calcRD_EXT: (p, r, extYrs, type, d) => {
        let quarterlyRate = r / 400;
        let matDate = new Date(d);
        matDate.setFullYear(d.getFullYear() + 5 + extYrs);

        function getRDMaturity(dep, months, qRate) {
            let mat = 0;
            for (let m = 1; m <= months; m++) {
                let quarters = (months - m + 1) / 3;
                mat += dep * Math.pow(1 + qRate, quarters);
            }
            return mat; 
        }

        let rows = [];
        let totalDeposit = 0;
        let finalMaturity = 0;

        let baseMaturity = Math.round(getRDMaturity(p, 60, quarterlyRate));
        let baseDeposit = p * 60;
        rows.push({ lbl: `Base (1-5 Yrs)`, op: 0, dep: baseDeposit, int: baseMaturity - baseDeposit, cl: baseMaturity });

        let previousMaturity = baseMaturity;

        if (type === "with") {
            totalDeposit = baseDeposit;
            for (let y = 1; y <= extYrs; y++) {
                let currentMonths = 60 + (y * 12);
                let currentMaturity = Math.round(getRDMaturity(p, currentMonths, quarterlyRate));
                let yearlyDep = p * 12;
                totalDeposit += yearlyDep;
                let yearlyInt = currentMaturity - previousMaturity - yearlyDep;
                rows.push({ lbl: `Year ${5 + y}`, op: previousMaturity, dep: yearlyDep, int: yearlyInt, cl: currentMaturity });
                previousMaturity = currentMaturity;
            }
            finalMaturity = previousMaturity;

        } else {
            totalDeposit = baseDeposit;
            for (let y = 1; y <= extYrs; y++) {
                let currentMaturity = Math.round(baseMaturity * Math.pow(1 + quarterlyRate, y * 4));
                let yearlyInt = currentMaturity - previousMaturity;
                rows.push({ lbl: `Year ${5 + y}`, op: previousMaturity, dep: 0, int: yearlyInt, cl: currentMaturity });
                previousMaturity = currentMaturity;
            }
            finalMaturity = previousMaturity;
        }

        return { dep: totalDeposit, int: finalMaturity - totalDeposit, mat: finalMaturity, date: matDate, rows: rows, type: 'compound' };
    }
};
/* =========================================
   PART 2: UI CONTROLLER & RENDER LOGIC
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {
    const d = new Date();
    if(document.getElementById('dateOpen')) document.getElementById('dateOpen').valueAsDate = d;
    if(document.getElementById('printDate')) document.getElementById('printDate').innerText += d.toLocaleDateString();

    const realSelector = document.getElementById('schemeSelector');
    
    if(realSelector) {
        realSelector.addEventListener('change', (e) => { 
            toggleInputs(); 
            updateInfoContent(e.target.value); 
        });
    }
    
    const categoryBtns = document.querySelectorAll('#mainCategoryToggle .toggle-btn');
    const dropdownItems = document.querySelectorAll('#dropdownList li');
    const ddHeaderText = document.querySelector('#dropdownHeader span');

    if (categoryBtns.length > 0) {
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                categoryBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const selectedCategory = e.target.getAttribute('data-cat');

                dropdownItems.forEach(item => {
                    if (item.getAttribute('data-category') === selectedCategory) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                });

                if (realSelector) {
                    realSelector.value = ''; 
                    realSelector.dispatchEvent(new Event('change'));
                }
                dropdownItems.forEach(i => i.classList.remove('selected'));
                
                if (selectedCategory === 'insurance') {
                    ddHeaderText.innerHTML = "-- Choose Insurance Plan --";
                } else {
                    ddHeaderText.innerHTML = "-- Choose Saving Scheme --";
                }
            });
        });
    }
    
    const header = document.getElementById('dropdownHeader');
    const list = document.getElementById('dropdownList');
    if (header && list) {
        header.addEventListener('click', () => {
            list.classList.toggle('open');
            header.classList.toggle('active');
        });

        dropdownItems.forEach(item => {
            item.addEventListener('click', () => {
                ddHeaderText.innerHTML = item.innerHTML;
                dropdownItems.forEach(i => i.classList.remove('selected'));
                item.classList.add('selected');
                list.classList.remove('open');
                header.classList.remove('active');

                if(realSelector) {
                    realSelector.value = item.getAttribute('data-value');
                    realSelector.dispatchEvent(new Event('change'));
                }
            });
        });

        document.addEventListener('click', (e) => {
            if (!document.getElementById('customSchemeDropdown').contains(e.target)) {
                list.classList.remove('open');
                header.classList.remove('active');
            }
        });
    }

    const btnCalc = document.getElementById('btnCalculate');
    if(btnCalc) btnCalc.addEventListener('click', handleCalculate);
    
    const btnInfo = document.getElementById('btnInfo');
    if(btnInfo) btnInfo.addEventListener('click', openModal);
    
    const btnCloseInfo = document.getElementById('closeInfo');
    if(btnCloseInfo) btnCloseInfo.addEventListener('click', closeModal);
    
    const infoModal = document.getElementById('infoModal');
    if(infoModal) {
        infoModal.addEventListener('click', (e) => { 
            if(e.target.id === 'infoModal') closeModal(); 
        });
    }
    
    const btnShare = document.getElementById('btnShare');
    if(btnShare) btnShare.addEventListener('click', captureAndShare);

    const btnShowExt = document.getElementById('btnShowExtend');
    if(btnShowExt) {
        btnShowExt.addEventListener('click', () => {
            btnShowExt.classList.add('hidden'); 
            document.getElementById('rdExtendInputs').classList.remove('hidden'); 
        });
    }

    const btnCalcExt = document.getElementById('btnCalcExtend');
    if(btnCalcExt) {
        btnCalcExt.addEventListener('click', () => {
            let p = getVal('rdDeposit'); 
            if (p < 100) return showWarn("Minimum deposit is ₹100");
            const dStr = document.getElementById('dateOpen').value;
            const d = dStr ? new Date(dStr) : new Date();
            let extRate = getVal('rdExtRate') || 6.7;
            let extYrs = parseInt(document.getElementById('rdExtYears').value) || 1;
            let extType = document.getElementById('rdExtType').value || 'with';
            
            hideWarn();
            let res = Engines.calcRD_EXT(p, extRate, extYrs, extType, d);
            document.getElementById('printSchemeName').innerText = "RD (Extension)";
            if(res) renderSimple(res);
        });
    }
});

function openModal() { 
    const s = document.getElementById('schemeSelector').value; 
    updateInfoContent(s); 
    document.getElementById('infoModal').classList.add('show'); 
}

function closeModal() { 
    document.getElementById('infoModal').classList.remove('show'); 
}

function updateInfoContent(scheme) {
    const container = document.getElementById('ruleContent');
    container.innerHTML = (scheme && SCHEME_RULES[scheme]) ? SCHEME_RULES[scheme] : "<p style='text-align:center; color:#666; padding:20px;'>Please select a scheme to view its official rules.</p>";
}

function toggleInputs() {
    const s = document.getElementById('schemeSelector').value; 
    
    document.querySelectorAll('.input-group').forEach(el => el.classList.add('hidden'));
    document.getElementById('resultsCard').classList.add('hidden');
    
    if (!s) {
        document.getElementById('inputCard').classList.add('hidden');
        document.getElementById('btnInfo').classList.add('hidden');
        return;
    }
    
    document.getElementById('inputCard').classList.remove('hidden');
    document.getElementById('btnInfo').classList.remove('hidden');

    if(SCHEMES[s]) document.getElementById('printSchemeName').innerText = SCHEMES[s].name;
    
    if (s === 'ssa') unhide('input-ssa'); 
    else if (s === 'ppf') unhide('input-ppf'); 
    else if (s === 'td') unhide('input-td'); 
    else if (document.getElementById('input-'+s)) unhide('input-'+s);
}

function unhide(id) { document.getElementById(id).classList.remove('hidden'); }

function setSSAMode(mode) {
    document.querySelectorAll('#input-ssa .toggle-btn').forEach(btn => btn.classList.remove('active')); 
    event.target.classList.add('active');
    document.getElementById('input-ssa').dataset.mode = mode;
    if (mode === 'annual') { 
        unhide('ssa-annual-inputs'); 
        document.getElementById('ssa-monthly-inputs').classList.add('hidden'); 
    } else { 
        unhide('ssa-monthly-inputs'); 
        document.getElementById('ssa-annual-inputs').classList.add('hidden'); 
    }
}

function setPPFMode(mode) {
    document.querySelectorAll('#input-ppf .toggle-btn').forEach(btn => btn.classList.remove('active')); 
    event.target.classList.add('active');
    document.getElementById('input-ppf').dataset.mode = mode;
    if (mode === 'annual') { 
        unhide('ppf-annual-inputs'); 
        document.getElementById('ppf-monthly-inputs').classList.add('hidden'); 
    } else { 
        unhide('ppf-monthly-inputs'); 
        document.getElementById('ppf-annual-inputs').classList.add('hidden'); 
    }
}

function setMISMode(type) {
    document.querySelectorAll('#input-mis .toggle-btn').forEach(btn => btn.classList.remove('active')); 
    event.target.classList.add('active');
    document.getElementById('input-mis').dataset.type = type;
}
/* =========================================
   PART 3: CALCULATION EXECUTION
   ========================================= */

function handleCalculate() {
    const s = document.getElementById('schemeSelector').value;
    const dStr = document.getElementById('dateOpen').value;
    const d = dStr ? new Date(dStr) : new Date();
    const conf = SCHEMES[s];
    
    hideWarn(); 
    let p = 0; 
    let mode = 'annual';

    if (s === 'ssa') {
        mode = document.getElementById('input-ssa').dataset.mode || 'annual';
        p = (mode === 'annual') ? getVal('ssaDepositAnnual') : getVal('ssaDepositMonthly');
        if (getVal('ssaAge') > 10) return showWarn("Girl's age must be 10 or less.");
    } 
    else if (s === 'ppf') {
        mode = document.getElementById('input-ppf').dataset.mode || 'annual';
        p = (mode === 'annual') ? getVal('ppfDepositAnnual') : getVal('ppfDepositMonthly');
    }
    else if (s === 'td') {
        p = getVal('tdDeposit');
    }
    else if (s === 'mis') {
        p = getVal('misDeposit');
        const type = document.getElementById('input-mis').dataset.type || 'single';
        const limit = (type === 'single') ? 900000 : 1500000;
        if (p > limit) return showWarn(`Maximum limit for ${type} account is ₹${limit}`);
    }
    else if (s === 'rd_ext') {
        p = getVal('rdExtDeposit');
    }
    else if (s === 'pli') { p = getVal('pliDeposit'); }
    else if (s === 'rpli') { p = getVal('rpliDeposit'); }
    else { 
        let id = s + 'Deposit';
        p = document.getElementById(id) ? getVal(id) : getVal('rdDeposit'); 
    }

    if (p < conf.min) return showWarn(`Minimum deposit is ₹${conf.min}`);
    if (s !== 'mis' && conf.max && p > conf.max) return showWarn(`Maximum limit is ₹${conf.max}`);

    let res = null;
    
    if (s === 'pli' || s === 'rpli') {
        let entryAge = parseInt(document.getElementById(s + 'EntryAge').value);
        let pMode = document.getElementById(s + 'PaymentMode').value;
        if (!entryAge || entryAge < 19 || entryAge > 55) return showWarn("Age must be between 19 and 55.");
        
        let gridData = generateInsuranceGrid(p, entryAge, s, d, pMode);
        if (gridData.length === 0) return showWarn("No actuarial rates available for this age combination.");
        
        document.getElementById('printSchemeSub').innerText = "Endowment Assurance Quote";
        document.getElementById('resTotalDep').innerText = fmt(p);
        document.getElementById('resTotalInt').innerText = "Varies by Term";
        document.getElementById('resMaturity').innerText = "See Grid Below";
        document.getElementById('resMatDate').innerText = "-";
        document.getElementById('rowPayout').classList.add('hidden');
        
        document.getElementById('lblTotalDep').innerText = "Sum Assured";
        document.getElementById('lblTotalInt').innerText = "Bonus Status";
        document.getElementById('lblMaturity').innerText = "Maturity Estimate";
        document.getElementById('lblMatDate').innerText = "Maturity Event";
        
        let head = document.getElementById('resHead');
        let modeLabel = (pMode === 'yearly') ? 'Yearly' : (pMode === 'half') ? 'Half-Yr' : (pMode === 'quarterly') ? 'Qtrly' : 'Monthly';
        head.innerHTML = `<tr><th>Mat. Age</th><th>Term</th><th>Prem.</th><th>Rebate</th><th>Tax</th><th>Net ${modeLabel}</th><th>Total Bonus</th><th>Maturity Amt</th></tr>`;
        
        document.getElementById('resBody').innerHTML = gridData.map(r => {
            return `<tr>
                <td style="text-align:left; font-weight:800;">${r.matAge} Yrs</td>
                <td>${r.duration} Y</td>
                <td>₹${r.premium}</td>
                <td>₹${r.rebate}</td>
                <td>₹${r.tax}</td>
                <td style="color:#059669; font-weight:800;">₹${r.net}</td>
                <td>${fmt(r.bonus)}</td>
                <td style="color:var(--ip-ruby); font-weight:800;">${fmt(r.matAmt)}</td>
            </tr>`;
        }).join('');
        
        const extendSection = document.getElementById('rdExtendSection');
        if (extendSection) extendSection.classList.add('hidden');
        
        document.getElementById('resultsCard').classList.remove('hidden');
        document.getElementById('resultsCard').scrollIntoView({behavior:'smooth'});
        return; 
    }

    if (s === 'sb') res = Engines.calcSB(p, conf.rate, d);
    else if (s === 'ppf') res = Engines.calcPPF_SSA(p, conf.rate, d, 'ppf', mode);
    else if (s === 'ssa') {
        let currentAge = parseInt(document.getElementById('ssaAge').value) || 0;
        res = Engines.calcPPF_SSA(p, conf.rate, d, 'ssa', mode, currentAge);
    }
    else if (s === 'rd') res = Engines.calcRD(p, conf.rate, d);
    else if (s === 'mis') res = Engines.calcPayout(p, conf.rate, 5, 12, d);
    else if (s === 'scss') res = Engines.calcPayout(p, conf.rate, 5, 4, d);
    else if (s === 'td') {
        let t = parseInt(document.getElementById('tdTenure').value);
        res = Engines.calcTD(p, conf.rates[t], t, d);
    }
    else if (s === 'nsc') res = Engines.calcNSC(p, conf.rate, d);
    else if (s === 'kvp') res = Engines.calcKVP(p, conf.rate, d);
    else if (s === 'rd_ext') {
        let extRate = getVal('rdExtRate') || 6.7;
        let extYrs = parseInt(document.getElementById('rdExtYears').value) || 1;
        let extType = document.getElementById('rdExtType').value || 'with';
        res = Engines.calcRD_EXT(p, extRate, extYrs, extType, d);
    }
    
    const extendSection = document.getElementById('rdExtendSection');
    const extendInputs = document.getElementById('rdExtendInputs');
    const btnShowExt = document.getElementById('btnShowExtend');
    
    if (extendSection && btnShowExt && extendInputs) {
        if (s === 'rd') {
            extendSection.classList.remove('hidden'); 
            btnShowExt.classList.remove('hidden');    
            extendInputs.classList.add('hidden');     
        } else {
            extendSection.classList.add('hidden');    
        }
    }

    document.getElementById('printSchemeSub').innerText = "Interest Estimate Statement";
    document.getElementById('lblTotalDep').innerText = "Total Deposit";
    document.getElementById('lblTotalInt').innerText = "Total Interest";
    document.getElementById('lblMaturity').innerText = "Maturity Amount";
    document.getElementById('lblMatDate').innerText = "Maturity Date";
    document.getElementById('lblPayout').innerText = "Regular Payout";
    
    if(res) renderSimple(res);
}

function renderSimple(data) {
    document.getElementById('resTotalDep').innerText = fmt(data.dep);
    document.getElementById('resTotalInt').innerText = fmt(data.int);
    document.getElementById('resMaturity').innerText = fmt(data.mat);
    
    if (data.date) {
        document.getElementById('resMatDate').innerText = data.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
    }

    if (data.payout) {
        document.getElementById('rowPayout').classList.remove('hidden');
        document.getElementById('resPayout').innerText = fmt(data.payout) + (data.freq || '');
    } else {
        document.getElementById('rowPayout').classList.add('hidden');
    }

    const head = document.getElementById('resHead');
    if (data.type === 'payout') {
        head.innerHTML = `<tr><th>Year</th><th>Invested</th><th>Interest Payout</th><th>Balance</th></tr>`;
    } else if (data.type === 'ssa') {
        head.innerHTML = `<tr><th>Period (FY)</th><th style="text-align:center;">Age</th><th>Opening</th><th>Deposit</th><th>Interest</th><th>Closing</th></tr>`;
    } else if (data.type === 'ppf') {
        head.innerHTML = `<tr><th>Period (FY)</th><th>Opening</th><th>Deposit</th><th>Interest</th><th>Closing</th></tr>`;
    } else {
        head.innerHTML = `<tr><th>Period</th><th>Opening</th><th>Deposit</th><th>Interest</th><th>Closing</th></tr>`;
    }

    document.getElementById('resBody').innerHTML = data.rows.map(r => {
        if(data.type === 'payout') {
            return `<tr><td>${r.lbl}</td><td>${fmt(r.op)}</td><td>${fmt(r.int)}</td><td>${fmt(r.cl)}</td></tr>`;
        } else if (data.type === 'ssa') {
            return `<tr><td>${r.lbl}</td><td style="text-align:center;">${r.age}</td><td>${fmt(r.op)}</td><td>${fmt(r.dep)}</td><td>${fmt(r.int)}</td><td>${fmt(r.cl)}</td></tr>`;
        }
        return `<tr><td>${r.lbl}</td><td>${fmt(r.op)}</td><td>${fmt(r.dep)}</td><td>${fmt(r.int)}</td><td>${fmt(r.cl)}</td></tr>`;
    }).join('');

    document.getElementById('resultsCard').classList.remove('hidden');
    document.getElementById('resultsCard').scrollIntoView({behavior:'smooth'});
}

function captureAndShare() {
    const btn = document.getElementById('btnShare');
    const originalText = btn.innerText;
    
    btn.innerText = "⏳ Processing..."; 
    btn.disabled = true;

    const source = document.getElementById('resultsCard');
    const clone = source.cloneNode(true);
    
    if(clone.querySelector('.download-actions')) {
        clone.querySelector('.download-actions').style.display = 'none';
    }
    
    if(clone.querySelector('#rdExtendSection')) {
        clone.querySelector('#rdExtendSection').style.display = 'none';
    }

    clone.style.width = '794px'; 
    clone.style.minHeight = '1123px';
    clone.style.padding = '40px';
    clone.style.background = 'white';
    clone.style.position = 'fixed'; 
    clone.style.top = '0'; 
    clone.style.left = '0';
    clone.style.zIndex = '-100';
    
    const tableWrap = clone.querySelector('.table-wrapper');
    if(tableWrap) { 
        tableWrap.style.overflow = 'visible'; 
        tableWrap.style.border = 'none'; 
    }
    const table = clone.querySelector('table');
    if(table) table.style.width = '100%';
    
    clone.querySelectorAll('th, td').forEach(cell => {
        cell.style.whiteSpace = 'nowrap';
    });

    document.body.appendChild(clone);

    html2canvas(clone, { 
        scale: 4, 
        useCORS: true, 
        scrollY: -window.scrollY 
    }).then(async canvas => {
        document.body.removeChild(clone); 
        
        canvas.toBlob(async (blob) => {
            const file = new File([blob], "PostCalc-Report.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                try {
                    await navigator.share({
                        title: 'PostCalc Report',
                        text: 'Here is the India Post scheme calculation.',
                        files: [file],
                    });
                } catch (err) { console.log("Share cancelled", err); }
            } else {
                const link = document.createElement('a');
                link.download = 'PostCalc-Report.png';
                link.href = URL.createObjectURL(blob);
                link.click();
            }
            
            btn.innerText = originalText;
            btn.disabled = false;
        });
    }).catch(err => {
        console.error(err);
        btn.innerText = originalText;
        btn.disabled = false;
        alert("Error generating image.");
    });
}

function getVal(id) { 
    const el = document.getElementById(id); 
    return el ? (parseFloat(el.value)||0) : 0; 
}

function fmt(n) { 
    return '₹' + Math.round(n).toLocaleString('en-IN'); 
}

function showWarn(m) { 
    const w = document.getElementById('warningBox'); 
    w.innerText = '⚠️ ' + m; 
    w.style.display = 'block'; 
}

function hideWarn() { 
    document.getElementById('warningBox').style.display = 'none'; 
}

/* =========================================
   PART 4: SILENT AUTO-UPDATE LOGIC
   ========================================= */

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
            window.location.reload();
            refreshing = true;
        }
    });
}

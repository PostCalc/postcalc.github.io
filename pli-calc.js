/* pli-calc.js */
const PLI_Engine = {
    calculate: (schemeCode, dobStr, sa, matAge) => {
        const data = PLI_DATA[schemeCode];
        if (!data) return { error: "Scheme data not found." };

        // 1. Calculate Age on Next Birthday (ANB)
        const dob = new Date(dobStr);
        const today = new Date();
        
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        
        // Exact age check
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--; 
        }
        
        const anb = age + 1; // India Post Logic: Next Birthday
        
        if (anb < 19 || anb > 55) return { error: `Age ${anb} is outside eligibility (19-55 years).` };

        // 2. Get Premium Rate
        const maturityRates = data.rates[matAge];
        if (!maturityRates) return { error: `Maturity Age ${matAge} not available for this plan.` };
        
        let rate = maturityRates[anb];
        // Fallback for missing exact ages in demo data
        if (!rate) return { error: `Rate for Age ${anb} (Mat ${matAge}) is missing in data file.` };

        // 3. Math Logic (Base Premium)
        let basePremium = (sa / 1000) * rate;

        // Rebate Calculation (₹1 per 20k)
        let rebate = 0;
        if (sa >= data.rebate_step) {
            rebate = Math.floor(sa / data.rebate_step) * data.rebate_val;
        }

        // GST Logic (Sep 2025: Exempt/0%)
        let netPremium = basePremium - rebate;
        if(netPremium < 0) netPremium = 0;

        // 4. Bonus Calculation
        let term = matAge - anb;
        if(term <= 0) return { error: "Maturity Age must be greater than Current Age." };
        
        let totalBonus = (sa / 1000) * data.bonus_rate * term;

        // Terminal Bonus (If Term >= 20 Years)
        let terminalBonus = 0;
        if (term >= 20 && (schemeCode === 'pli-ea' || schemeCode === 'pli-wla')) {
            terminalBonus = (sa / 10000) * 20; 
            if (terminalBonus > 1000) terminalBonus = 1000; // Max Cap
        }
        
        let totalMaturity = sa + totalBonus + terminalBonus;

        // 5. Generate Rows for Table
        let rows = [];
        rows.push({ lbl: `Base Premium (Age ${anb})`, op: '-', dep: basePremium.toFixed(2), int: '-', cl: '-' });
        rows.push({ lbl: 'Rebate', op: '-', dep: `-${rebate.toFixed(2)}`, int: '-', cl: '-' });
        rows.push({ lbl: 'GST (Exempt 0%)', op: '-', dep: '0.00', int: '-', cl: '-' });
        
        return {
            dep: netPremium, // Monthly Pay
            int: totalBonus + terminalBonus,
            mat: totalMaturity,
            date: new Date(new Date().setFullYear(new Date().getFullYear() + term)),
            rows: rows,
            type: 'insurance',
            anb: anb
        };
    }
};

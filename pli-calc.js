/* pli-calc.js - Full Table Logic Engine */
const PLI_Engine = {
    // Generates the full comparison table for all maturity ages
    generateTable: (schemeCode, dobStr, sa, freqMode = 1) => {
        const data = PLI_DATA[schemeCode];
        if (!data) return { error: "Scheme data not found." };

        // 1. Calculate Age Next Birthday (ANB)
        const dob = new Date(dobStr);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--; 
        const anb = age + 1; // Postal Age Rule (Next Birthday)

        if (anb < 19 || anb > 55) return { error: `Age ${anb} is not eligible (19-55).` };

        let tableRows = [];

        // 2. Loop through ALL Maturity Ages (35, 40... 60)
        data.maturity_ages.forEach(matAge => {
            let term = matAge - anb;
            
            // Only show rows where term is valid (e.g. at least 5 years)
            if (term >= 5) {
                // Get Rate (Handle missing ages with fallback)
                let rateTable = data.rates[matAge];
                let rate = rateTable ? rateTable[anb] : null;

                // Fallback: If exact age missing, use closest (Demo purpose)
                if (!rate && rateTable) {
                    let keys = Object.keys(rateTable).map(Number);
                    if(keys.length > 0) {
                        let closest = keys.reduce((prev, curr) => Math.abs(curr - anb) < Math.abs(prev - anb) ? curr : prev);
                        rate = rateTable[closest];
                    }
                }

                if (rate) {
                    // 3. Math Logic
                    let basePrem = (sa / 1000) * rate;
                    
                    // Frequency: 1=Month, 3=Quart, 6=Half, 12=Year
                    let freqPrem = basePrem * freqMode;

                    // Rebate: ₹1 per 20k per month (Standard Rule)
                    let rebatePerMonth = 0;
                    if (sa >= data.rebate_step) {
                        rebatePerMonth = Math.floor(sa / data.rebate_step) * data.rebate_val;
                    }
                    let totalRebate = rebatePerMonth * freqMode;

                    // Net Premium (0% GST)
                    let netPrem = freqPrem - totalRebate;
                    if(netPrem < 0) netPrem = 0;

                    // Bonus
                    let totalBonus = (sa / 1000) * data.bonus_rate * term;
                    let maturityVal = sa + totalBonus;

                    tableRows.push({
                        matAge: matAge,
                        term: term,
                        base: freqPrem,
                        rebate: totalRebate,
                        net: netPrem,
                        bonus: totalBonus,
                        maturity: maturityVal
                    });
                }
            }
        });

        return { anb: anb, rows: tableRows, sa: sa };
    }
};

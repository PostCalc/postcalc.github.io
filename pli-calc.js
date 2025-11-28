/* pli-calc.js */
const PLI_Engine = {
    // Main function: Generates the full comparison table
    generateTable: (schemeCode, dobStr, sa, freqMode = 1) => {
        const data = PLI_DATA[schemeCode];
        if (!data) return { error: "Scheme data not found." };

        // 1. Calculate Age Next Birthday (ANB)
        const dob = new Date(dobStr);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--; 
        const anb = age + 1; // Postal Age Rule

        if (anb < 19 || anb > 55) return { error: `Age ${anb} is not eligible (19-55).` };

        let tableRows = [];

        // 2. Loop through ALL Maturity Ages (35, 40, 45, 50...)
        data.maturity_ages.forEach(matAge => {
            // Check validity (Must be > current age)
            let term = matAge - anb;
            if (term < 5) return; // Minimum term check

            // Get Rate
            let rateTable = data.rates[matAge];
            let rate = rateTable ? rateTable[anb] : null;

            // Use Fallback if exact age missing (for demo purposes)
            if (!rate && rateTable) {
                // Find nearest age key
                let keys = Object.keys(rateTable).map(Number);
                let closest = keys.reduce((prev, curr) => Math.abs(curr - anb) < Math.abs(prev - anb) ? curr : prev);
                rate = rateTable[closest];
            }

            if (rate) {
                // 3. Calculate Premium (Monthly Base)
                let basePrem = (sa / 1000) * rate;
                
                // Frequency Logic (Monthly=1, Quarterly=3, Half=6, Yearly=12)
                let freqMult = freqMode; 
                let freqPrem = basePrem * freqMult;

                // Rebate Logic (1 Re per 20k per month)
                let rebatePerMonth = 0;
                if (sa >= data.rebate_step) {
                    rebatePerMonth = Math.floor(sa / data.rebate_step) * data.rebate_val;
                }
                let totalRebate = rebatePerMonth * freqMult;

                // Net Premium
                let netPrem = freqPrem - totalRebate;
                if(netPrem < 0) netPrem = 0;

                // GST (0%)
                let gst = 0; 

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
        });

        return {
            anb: anb,
            rows: tableRows,
            sa: sa
        };
    }
};

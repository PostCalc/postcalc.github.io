/* pli-calc.js - Precise Dak Sewa Logic */
const PLI_Engine = {
    generateTable: (schemeCode, dobStr, sa, freqMode = 1) => {
        const data = PLI_DATA[schemeCode];
        if (!data) return { error: "Scheme data not found." };

        // 1. AGE LOGIC (Age Next Birthday - ANB)
        const dob = new Date(dobStr);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--; 
        }
        const anb = age + 1; 

        if (anb < 19 || anb > 55) return { error: `Age ${anb} is not eligible (19-55 years).` };

        let tableRows = [];

        // 2. Loop through all Maturity Ages
        if(data.maturity_ages) {
            data.maturity_ages.forEach(matAge => {
                let term = matAge - anb;
                if (term >= 5) { // Minimum term check
                    let rateTable = data.rates[matAge];
                    let rate = rateTable ? rateTable[anb] : null;

                    // Fallback for missing specific ages in demo data
                    if (!rate && rateTable) {
                        let keys = Object.keys(rateTable).map(Number);
                        if(keys.length > 0) {
                            let closest = keys.reduce((prev, curr) => Math.abs(curr - anb) < Math.abs(prev - anb) ? curr : prev);
                            rate = rateTable[closest];
                        }
                    }

                    if (rate) {
                        // 3. BASE PREMIUM CALCULATION
                        let basePrem = (sa / 1000) * rate;
                        
                        /* --- DAK SEWA PRECISE MULTIPLIERS --- */
                        // Derived from Official PDF Sources (Ver 8)
                        // This logic accounts for the specific discounts India Post applies
                        let multiplier = freqMode;
                        
                        if (freqMode === 12) {
                            multiplier = 11.645; // Yearly Discount (~2.96%)
                        } else if (freqMode === 6) {
                            multiplier = 5.914;  // Half-Yearly Discount (~1.43%)
                        } else if (freqMode === 3) {
                            multiplier = 2.996;  // Quarterly Discount (~0.13%)
                        }
                        // Monthly remains 1.0

                        let freqPrem = Math.round(basePrem * multiplier);

                        /* --- REBATE LOGIC --- */
                        // Rule: ₹1 per ₹20k per MONTH. 
                        // The app calculates total rebate by multiplying the monthly rebate by frequency.
                        let rebatePerMonth = 0;
                        if (sa >= data.rebate_step) {
                            rebatePerMonth = Math.floor(sa / data.rebate_step) * data.rebate_val;
                        }
                        let totalRebate = rebatePerMonth * freqMode; 

                        /* --- NET PREMIUM --- */
                        let netPrem = freqPrem - totalRebate;
                        if(netPrem < 0) netPrem = 0;

                        /* --- BONUS --- */
                        // Bonus = (SA/1000) * Rate * Years
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
        }

        return { anb: anb, rows: tableRows, sa: sa };
    }
};

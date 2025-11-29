/* pli-calc.js - Universal Dak Sewa Logic */
const PLI_Engine = {
    generateTable: (schemeCode, dobStr, sa, freqMode = 1) => {
        const data = PLI_DATA[schemeCode];
        if (!data) return { error: "Scheme data not found." };

        // 1. AGE LOGIC (Next Birthday)
        const dob = new Date(dobStr);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--; 
        const anb = age + 1; 

        if (anb < 19 || anb > 55) return { error: `Age ${anb} is not eligible (19-55 years).` };

        let tableRows = [];

        if(data.maturity_ages) {
            data.maturity_ages.forEach(matAge => {
                let term = matAge - anb;
                if (term >= 5) {
                    let rateTable = data.rates[matAge];
                    let rate = rateTable ? rateTable[anb] : null;

                    // Fallback for missing ages (Demo purposes)
                    if (!rate && rateTable) {
                        let keys = Object.keys(rateTable).map(Number);
                        if(keys.length > 0) {
                            let closest = keys.reduce((prev, curr) => Math.abs(curr - anb) < Math.abs(prev - anb) ? curr : prev);
                            rate = rateTable[closest];
                        }
                    }

                    if (rate) {
                        // 1. BASE MONTHLY PREMIUM (Gross Rate)
                        // Rate from pli-data.js is already Gross (includes rebate value)
                        let baseMonthly = (sa / 1000) * rate;
                        
                        // 2. FREQUENCY MULTIPLIERS (The "Dak Sewa" Factors) 
                        // These factors create the specific discounts seen in the app
                        let multiplier = 1;
                        
                        if (freqMode === 12) {
                            multiplier = 11.64444444; // Yearly (Derived: 2096/180)
                        } else if (freqMode === 6) {
                            multiplier = 5.91111111;  // Half-Yearly (Derived: 1064/180)
                        } else if (freqMode === 3) {
                            multiplier = 3.0;         // Quarterly (Derived: 540/180) - No discount
                        }
                        // Monthly = 1.0

                        // Calculate Gross Premium for Frequency
                        let freqPrem = Math.round(baseMonthly * multiplier);

                        // 3. REBATE LOGIC
                        // Rule: ₹1 per ₹20k per MONTH.
                        // Dak Sewa multiplies the monthly rebate by the frequency (e.g. 12).
                        let rebatePerMonth = 0;
                        if (sa >= data.rebate_step) {
                            rebatePerMonth = Math.floor(sa / data.rebate_step) * data.rebate_val;
                        }
                        let totalRebate = rebatePerMonth * freqMode; 

                        // 4. NET PREMIUM (0% GST)
                        // Net = Gross - Rebate
                        let netPrem = freqPrem - totalRebate;
                        if(netPrem < 0) netPrem = 0;

                        // 5. BONUS CALCULATION
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

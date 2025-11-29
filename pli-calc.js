/* pli-calc.js - Official Percentage Discount Logic */
const PLI_Engine = {
    generateTable: (schemeCode, dobStr, sa, freqMode = 1) => {
        const data = PLI_DATA[schemeCode];
        if (!data) return { error: "Scheme data not found." };

        // 1. Age Calculation (Next Birthday)
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

                    // Fallback for demo data gaps
                    if (!rate && rateTable) {
                        let keys = Object.keys(rateTable).map(Number);
                        if(keys.length > 0) {
                            let closest = keys.reduce((prev, curr) => Math.abs(curr - anb) < Math.abs(prev - anb) ? curr : prev);
                            rate = rateTable[closest];
                        }
                    }

                    if (rate) {
                        // 2. Base Monthly Premium
                        let baseMonthly = (sa / 1000) * rate;
                        
                        // 3. Frequency Calculation with DISCOUNTS [Source: Analysis]
                        let freqPrem = 0;
                        
                        if (freqMode === 1) {
                            freqPrem = baseMonthly;
                        } else if (freqMode === 3) {
                            // Quarterly: No Discount (x3)
                            freqPrem = baseMonthly * 3;
                        } else if (freqMode === 6) {
                            // Half-Yearly: 1.5% Discount
                            // Logic: Round( Monthly * 6 * 0.985 )
                            freqPrem = Math.round(baseMonthly * 6 * 0.985);
                        } else if (freqMode === 12) {
                            // Yearly: 3% Discount
                            // Logic: Round( Monthly * 12 * 0.97 )
                            freqPrem = Math.round(baseMonthly * 12 * 0.97);
                        }

                        // 4. Rebate Logic
                        // Rule: ₹1 per ₹20k per MONTH. Total = MonthlyRebate * Freq.
                        let rebatePerMonth = 0;
                        if (sa >= data.rebate_step) {
                            rebatePerMonth = Math.floor(sa / data.rebate_step) * data.rebate_val;
                        }
                        let totalRebate = rebatePerMonth * freqMode;

                        // 5. Net Premium
                        let netPrem = freqPrem - totalRebate;
                        if(netPrem < 0) netPrem = 0;

                        // 6. Bonus
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

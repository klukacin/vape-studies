# Vuse, IQOS and temperature chart evidence

Reviewed 2026-10-05. Source IDs refer to `/studije/<id>/` on the site.

## Temperature instead of power

Source 192, Wang et al. 2017, DOI `10.1371/journal.pone.0169811`, supplies measured **reactor** temperatures and formaldehyde normalized to initially loaded solvent mass. It does not calibrate the coil of a commercial device.

| Solvent | Temperature °C | Formaldehyde µg/mg | SD |
|---|---:|---:|---:|
| PG | 215 | 0.03 | 0.03 |
| PG | 270 | 0.29 | 0.11 |
| PG | 318 | 2.03 | 0.80 |
| VG | 270 | 7.97 | 1.08 (Table 2) |
| VG | 318 | 21.10 | 3.80 |

The graph uses these explicitly reported numbers rather than digitizing additional figure points. Lines connect observed points; error marks are mean ± SD, not confidence intervals. The y-axis starts at zero. Watts and volts from Geiss/Gillman/Kosmider are not relabelled as temperatures. The companion chart shows measured PG/VG carbonyl yields at 318 °C; absent PG acrolein is null, not zero.

Source 193, Auer 2017, DOI `10.1001/jamainternmed.2017.1419`: older blade-heated IQOS temperature 330 ± 10 °C, n=2. Formaldehyde 3.2 ± 2.7 µg/stick, n=5, is a different denominator from solvent µg/mg and is described separately. The 320–340 mark is mean ± SD, not min–max. Source 201 reports the manufacturer's ILUMA/TEREA maximum of 350 °C separately; it is not an observed 0–350 range.

The first chart no longer presents unsupported generic-pod temperature ranges. Chen 2018, source 12, supplies the actual top-coil wet/dry test ranges. The reported JUUL atomizer mean <300 °C is a bound, not an invented 150–300 range.

## IQOS scope in other graphs

- Source 194, Haziza Data in Brief, DOI `10.1016/j.dib.2016.11.047`: Warsaw confinement trial; THS 2.2 n80, cigarettes n41, abstinence n39. Day5 geometric means and 95% CIs. This is a short switch by previous smokers, not long-term exclusive use or never-smoking controls.
- NNAL: 49.65 pg/mg creatinine (CI42.47–58.05). 3-HPMA: 402.26 ng/mg (CI366.55–441.45). Where included alongside older PATH series, the different cohort and statistic are labelled.
- CEMA in Haziza denotes an acrylonitrile metabolite; it cannot populate the acrolein-CEMA slot in the PATH plot. CEMA/AAMA IQOS slots stay null.
- COHb: 1.06% (CI1.03–1.08), compared in its own same-trial panel with continued smoking 4.51% and abstinence 0.99%.
- Switching uses arithmetic mean **change from baseline**, Table2, consistently for the IQOS rows: NNAL53.98%, COHb76.20%, S-PMA92.03%, MHBMA84.98%, 3-HPMA49.68%. These differ from adjusted between-arm ratios in Table3.
- Source60, SUR-VAPES2, DOI `10.1161/JAHA.118.010455`: 20 smokers, crossover. Separate acute FMD panel with IQOS/HEETS Amber, Blu Pro, Marlboro Gold; no chronic-user rank extrapolation. Serum cotinine61.0 ±16.7 ng/mL after IQOS is explicitly an acute serum result, not urine, saliva or nicotine Cmax.
- Source20, Stephens:0.024 is the modelled lifetime excess cancer-risk ratio, not a clinical overall-harm index. The HnB input is THS2.2 prototype blends, not ILUMA/TEREA.
- All ECharts instances have an endpoint-specific IQOS status and a local source link. Missing comparisons remain N/A; they are not estimated by multiplying another cohort's baseline. SVG marker plots also contain explicit IQOS N/A rows when absent from that source study.
- The unsupported composite 25/100 IQOS risk score and other composite scores were replaced with sourced qualitative conclusions.

## Vuse identity and ceramics

- Source162, Pinto 2022: **Vype ePod1.0**, ceramic wick plus NiCr heater, 18/57mg/mL Berry Blast. BAT-funded organic-emissions study, not an elemental-metal or ceramic-particle analysis and not Pro One. Corrected the previous description of five quantified HPHCs as five carbonyls.
- Source195, Gray et al. 2022, DOI `10.1093/jat/bkaa185`: liquid/aerosol metals in JUUL, myblu, Vuse **Alto**. No model transfer to Pro One.
- Source203, Pappas2024, DOI `10.3390/toxics12010065`: aerosol ICP-MS and component SEM-EDS, including Alto's metal heater embedded in ceramic. Formulation/salt and hardware both matter; no ProOne or long-term risk extrapolation. Licensed original PDF and media are stored locally.
- Sources196–197: official pod catalogue and BAT product history distinguish Classic/former Pro Pods from newer ceramic Intense pods and date Pro2023/ProOne2025. Compatibility does not prove identical heater construction.
- Source198: Inter Scientific/AYR Labs SR24227V2,10-Feb-2025. Comparator labelled VUSE Pro; Ni0.07/0.32µg per100puffs in two blocks. No precise SKU, n/SD, or complete comparator protocol. Not peer-reviewed; the inconsistent2000-puff projection is excluded.
- Source199: EP4483731A1, metal film on ceramic. Applicant's Ni/Cr results have inadequate elemental assay/LOD/n/protocol documentation. Patent does not identify a retail Vuse ProOne/Pro pod.
- Source200: US20150359262A1 / US9861129B2 porous-ceramic preparation patent. Starting-mixture recipe does not establish the finished composition or emitted particles of a commercial Vuse pod.
- Source202: manufacturer's ProOne99% claim averages nine selected constituents, with no linked public lab table. It is not99% lower health risk or an independently verified metal result.

## Original materials and validation

Wang, Haziza, SUR-VAPES2, Pinto and Pappas2024 have original local PDFs and available media from the official PMC Open Data archive. Licences and attribution are retained; each file has its source URL and verified MD5 in `provenance.json`. Sources without a verified redistribution licence retain original links and own summaries.

Validation: Astro build; all18 ECharts initialize without browser errors and have IQOS status notes; source-value/axis/null checks; desktop and390px mobile inspection, including light/L reading mode; local PDF modal open/close and PDF response signature; new DOI uniqueness and original-file MD5 verification.

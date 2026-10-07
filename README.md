# ProofVault demo

## Run (2 minutes)
1. Install Node.js 18+ from nodejs.org
2. In this folder: npm install, then npm start
3. Open http://localhost:5000

## Demo files (demo/ folder)
- alex_mercer_diploma.pdf         genuine, pre-anchored when the server starts
- alex_mercer_diploma_FORGED.pdf  same diploma with CGPA changed 8.7 -> 9.7

## 5-minute evaluator walkthrough
1. Overview: drag the 3D vault to rotate it.
2. Tamper Lab: change 8.7 to 9.7, watch the hash break.
3. QR Scanner: drop alex_mercer_diploma.pdf -> AUTHENTIC.
4. QR Scanner: drop alex_mercer_diploma_FORGED.pdf -> TAMPERED (audit alert raised).
5. Issuer Portal: anchor any new file (name + file), see the QR code, then verify that file in the scanner.
6. Issuer Portal: counters now include the new record and the tamper alert.

Ledger is simulated and saved to ledger.json. Delete it to reset the demo.

# ProofVault

### Blockchain-Based Document Verification & Tamper Detection

> **Don't Trust the Document. Verify It.**

ProofVault is a document verification platform designed to detect whether a digital credential has been modified after it was issued.

The current prototype uses **SHA-256 cryptographic hashing** to create a unique fingerprint for a document. When the document is verified again, a new hash is generated and compared with the registered hash. If the hashes are different, the document is flagged as **tampered**.

The platform also demonstrates document issuance, verification, QR-based lookup, record management, and credential revocation through a web interface and Express.js backend.

---

## 🎯 Problem

Digital certificates and credentials can be edited using common document-editing tools.

For example:

```text
Original Certificate
CGPA: 8.7

        ↓ Document Modified

Forged Certificate
CGPA: 9.7
```

A visually convincing document does not necessarily mean the information inside it is authentic.

Organizations such as universities, recruiters, certification authorities, and employers need a reliable way to verify whether a document is still identical to the version that was originally registered.

---

## 💡 Solution

ProofVault creates a cryptographic fingerprint of a document using **SHA-256**.

### Verification flow

```text
             DOCUMENT
                 │
                 ▼
          SHA-256 HASH
                 │
                 ▼
        REGISTERED RECORD
                 │
                 ▼
        ┌─────────────────┐
        │  Verify Later   │
        └─────────────────┘
                 │
                 ▼
          Generate Hash
                 │
                 ▼
        Compare Hashes
           /          \
          /            \
      MATCH          MISMATCH
        │                │
        ▼                ▼
     AUTHENTIC        TAMPERED
```

Even a small change to the document produces a completely different SHA-256 hash.

---

# ✨ Key Features

## 🔐 SHA-256 Document Fingerprinting

Every registered document receives a SHA-256 hash.

Example:

```text
Original:
7cfce00503784806b56cccfed62762eaec0a1a7343d8ac2e508229f446e8edd9

Modified:
fcdc11a836100df2d6236c4db7101a3fee3583b856837bb31fd4fafa478150d8
```

Because the hashes are different, the document can be identified as modified.

---

## 🛡️ Tamper Detection

ProofVault includes a dedicated Tamper Lab demonstrating how changing information such as:

```text
CGPA: 8.7 → 9.7
```

causes a hash mismatch.

The system displays the result as:

```text
HASH MISMATCH
DOCUMENT TAMPERED
```

This demonstrates the core security concept of the project.

---

## 📄 Document Issuing

Issuers can register a document through the backend.

The issuing workflow is:

```text
Upload Document
       ↓
Generate SHA-256 Hash
       ↓
Create ProofVault Record
       ↓
Store Document Metadata
       ↓
Generate Verification Reference
```

---

## 🔍 Document Verification

A document can be uploaded for verification.

The backend calculates its SHA-256 hash and compares it against the registered record.

Possible results include:

- ✅ Authentic
- ❌ Tampered
- 🚫 Revoked
- ⚠️ Record not found

---

## 📱 QR Verification

ProofVault supports QR-based credential lookup.

A registered credential can be associated with a verification reference, allowing a verifier to access the corresponding record without manually searching through documents.

---

## 🚫 Credential Revocation

Issuers can revoke a previously registered credential.

A revoked credential should no longer be treated as a valid credential even if the original file has not been modified.

---

## 📋 Record & Activity Management

The backend provides endpoints for:

- Viewing registered records
- Looking up individual records
- Viewing activity
- Checking system health
- Issuing credentials
- Verifying credentials
- Revoking credentials

---

# 🏗️ Project Architecture

```text
┌─────────────────────────────┐
│        ProofVault UI        │
│      HTML / CSS / JS        │
└──────────────┬──────────────┘
               │
               ▼
┌─────────────────────────────┐
│       Express.js API        │
│                             │
│  /api/issue                 │
│  /api/verify                │
│  /api/revoke                │
│  /api/records               │
│  /api/activity              │
│  /api/health                │
│  /api/record/:q             │
└──────────────┬──────────────┘
               │
               ▼
┌────────────────────────

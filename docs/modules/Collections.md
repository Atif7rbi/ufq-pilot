# NexusOS Pilot

# Collection DDL Specification v1

**Status:** `FROZEN`
**Target:** PostgreSQL
**Implementation:** Laravel 12 Migrations
**Architecture:** Multi-Tenant, Database-First
**Purpose:** Final executable database reference for Contract Currency preparation and Collections schema

---

# 1. Scope

تحدد هذه الوثيقة الحالة النهائية المطلوبة لتنفيذ:

```text
Contract Currency Preparation
Collections Table
Collection Constraints
Collection Foreign Keys
Collection Indexes
Collection Lifecycle Storage
```

وهي المرجع النهائي الذي تُكتب منه الـMigrations مباشرة دون قرارات تصميمية إضافية.

---

# 2. Verified Existing Schema

تم التحقق الفعلي من المخطط الحالي.

## 2.1 Tenant identifier

```text
tenants.id
Laravel definition: ulid('id')->primary()
PostgreSQL type: CHAR(26)
```

## 2.2 Contract identifier

```text
contracts.id
Laravel definition: ulid('id')->primary()
PostgreSQL type: CHAR(26)
UDT: bpchar
```

## 2.3 User identifier

```text
users.id
PostgreSQL type: BIGINT
```

## 2.4 Tenant currency

```text
tenants.currency
VARCHAR(3) NOT NULL DEFAULT 'SAR'
```

## 2.5 Business timestamps

النمط المعتمد في المشروع:

```text
TIMESTAMPTZ
```

Laravel:

```php
timestampTz()
timestampsTz()
```

---

# 3. Identifier Policy

جدول `collections` يمثل كيانًا تجاريًا، ولذلك يستخدم ULID.

```text
collections.id          → ULID / CHAR(26)
collections.tenant_id   → ULID / CHAR(26)
collections.contract_id → ULID / CHAR(26)
```

حقول الـActors فقط تستخدم:

```text
BIGINT
```

وهي:

```text
created_by
updated_by
scheduled_by
cancelled_by
```

مرتبطة بـ:

```text
users.id
```

Laravel definitions:

```php
$table->ulid('id')->primary();

$table->ulid('tenant_id');
$table->ulid('contract_id');

$table->unsignedBigInteger('created_by');
$table->unsignedBigInteger('updated_by')->nullable();
$table->unsignedBigInteger('scheduled_by')->nullable();
$table->unsignedBigInteger('cancelled_by')->nullable();
```

لا يستخدم:

```php
$table->id();
$table->foreignId('tenant_id');
$table->foreignId('contract_id');
```

---

# 4. Frozen Currency Policy

## 4.1 Supported currencies

العملات المدعومة في Pilot v1:

```text
SAR
USD
```

## 4.2 Tenant currency

```text
tenants.currency
VARCHAR(3) NOT NULL DEFAULT 'SAR'
```

القواعد:

```text
SAR is the default Tenant currency.
USD is implemented but used only when enabled for a customer.
No other currencies are supported in Pilot v1.
```

## 4.3 Contract currency

```text
contracts.currency
VARCHAR(3) NOT NULL
```

لا يحتوي على Database Default.

يحظر:

```text
DEFAULT 'SAR'
```

في `contracts.currency`.

السبب:

```text
Contract currency must be explicitly copied
from Tenant currency by CreateContractAction.
```

إذا لم يمرر الـAction العملة، يجب أن يفشل الإدخال بدل إنشاء عقد بعملة خاطئة.

## 4.4 Historical contracts

تم اعتماد:

```text
Confirmed Backfill
```

وجميع العقود القائمة تاريخيًا بالريال السعودي.

التعبئة الصريحة:

```sql
UPDATE contracts
SET currency = 'SAR'
WHERE currency IS NULL;
```

لا تعتمد Migration التاريخية على:

```text
tenants.currency
```

وقت التنفيذ.

## 4.5 Contract currency immutability

عملة العقد:

```text
Copied from Tenant at Contract creation.
Immutable after Contract creation.
```

تغيير:

```text
tenants.currency
```

لاحقًا لا يغير العقود القائمة.

## 4.6 Collection currency

لا يحتوي `collections` على:

```text
currency
```

عملة Collection موروثة دائمًا من:

```text
contracts.currency
```

## 4.7 Future Payment policy

عند بناء Payment Domain:

```text
Payment currency must equal Contract currency.
Payment Allocation must belong to the same Contract currency.
```

خارج نطاق Pilot v1:

```text
FX
Currency conversion
Mixed-currency Contracts
Multi-currency Contracts
Multi-currency accounting
```

---

# 5. Currency Database Constraints

تفرض قاعدة البيانات دعم:

```text
SAR
USD
```

فقط.

## 5.1 Existing Tenant data verification

قبل إضافة القيد:

```sql
SELECT currency, COUNT(*)
FROM tenants
GROUP BY currency
ORDER BY currency;
```

يجب ألا توجد أي قيمة خارج:

```text
SAR
USD
```

## 5.2 Tenant currency CHECK

```sql
ALTER TABLE tenants
ADD CONSTRAINT tenants_currency_check
CHECK (currency IN ('SAR', 'USD'));
```

يبقى Default الخاص بالـTenant:

```text
DEFAULT 'SAR'
```

## 5.3 Contract currency CHECK

```sql
ALTER TABLE contracts
ADD CONSTRAINT contracts_currency_check
CHECK (currency IN ('SAR', 'USD'));
```

لا يضاف Default إلى عقد.

---

# 6. Contract Currency Preparation

يجب تنفيذ هذه المرحلة قبل إنشاء `collections`.

## 6.1 Add nullable column temporarily

```sql
ALTER TABLE contracts
ADD COLUMN currency VARCHAR(3) NULL;
```

هذا السماح بـ`NULL` مؤقت للترحيل فقط.

## 6.2 Historical backfill

```sql
UPDATE contracts
SET currency = 'SAR'
WHERE currency IS NULL;
```

## 6.3 Verify zero NULL values

```sql
SELECT COUNT(*)
FROM contracts
WHERE currency IS NULL;
```

النتيجة المطلوبة:

```text
0
```

إذا كانت النتيجة أكبر من صفر:

```text
Migration must fail.
```

## 6.4 Enforce NOT NULL

```sql
ALTER TABLE contracts
ALTER COLUMN currency SET NOT NULL;
```

## 6.5 Add currency CHECK

```sql
ALTER TABLE contracts
ADD CONSTRAINT contracts_currency_check
CHECK (currency IN ('SAR', 'USD'));
```

## 6.6 No Contract default

الحالة النهائية:

```text
contracts.currency VARCHAR(3) NOT NULL
No default
```

---

# 7. Contract Currency Immutability Trigger

## 7.1 Function

```sql
CREATE OR REPLACE FUNCTION prevent_contract_currency_change()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.currency IS DISTINCT FROM OLD.currency THEN
        RAISE EXCEPTION
            'contracts.currency is immutable after contract creation';
    END IF;

    RETURN NEW;
END;
$$;
```

## 7.2 Trigger

```sql
CREATE TRIGGER contracts_currency_immutable
BEFORE UPDATE OF currency
ON contracts
FOR EACH ROW
EXECUTE FUNCTION prevent_contract_currency_change();
```

## 7.3 Trigger order

ينشأ Trigger فقط بعد:

```text
Backfill completed
Zero NULL verified
NOT NULL enforced
Currency CHECK installed
```

## 7.4 Domain protection

بالإضافة إلى Trigger، لا يسمح بعملة العقد ضمن:

```text
UpdateContractAction
UpdateContractRequest
Generic metadata updates
Mass-assignment update payloads
```

---

# 8. Composite Contract Reference

لإنشاء Composite FK من Collections يجب إضافة:

```text
UNIQUE (tenant_id, id)
```

إلى `contracts`.

```sql
ALTER TABLE contracts
ADD CONSTRAINT contracts_tenant_id_id_unique
UNIQUE (tenant_id, id);
```

يبقى:

```text
contracts.id
```

هو Primary Key.

الغرض من القيد المركب:

```text
Ensure the referenced Contract belongs to the same Tenant.
```

---

# 9. Collections Columns

الأعمدة النهائية:

```text
id

tenant_id
contract_id

sequence
title
amount
due_date
notes

status

scheduled_at
scheduled_by

cancelled_at
cancelled_by
cancellation_reason

created_by
updated_by

created_at
updated_at
```

لا تضاف:

```text
currency
paid_amount
remaining_amount
payment_status
paid_at
is_overdue
payment_id
```

---

# 10. Final Column Definitions

| Column                | Definition                             |
| --------------------- | -------------------------------------- |
| `id`                  | `CHAR(26) PRIMARY KEY`                 |
| `tenant_id`           | `CHAR(26) NOT NULL`                    |
| `contract_id`         | `CHAR(26) NOT NULL`                    |
| `sequence`            | `INTEGER NOT NULL`                     |
| `title`               | `VARCHAR(150) NOT NULL`                |
| `amount`              | `NUMERIC(12,2) NOT NULL`               |
| `due_date`            | `DATE NOT NULL`                        |
| `notes`               | `TEXT NULL`                            |
| `status`              | `VARCHAR(20) NOT NULL DEFAULT 'draft'` |
| `scheduled_at`        | `TIMESTAMPTZ NULL`                     |
| `scheduled_by`        | `BIGINT NULL`                          |
| `cancelled_at`        | `TIMESTAMPTZ NULL`                     |
| `cancelled_by`        | `BIGINT NULL`                          |
| `cancellation_reason` | `VARCHAR(500) NULL`                    |
| `created_by`          | `BIGINT NOT NULL`                      |
| `updated_by`          | `BIGINT NULL`                          |
| `created_at`          | `TIMESTAMPTZ NOT NULL`                 |
| `updated_at`          | `TIMESTAMPTZ NOT NULL`                 |

---

# 11. Laravel Table Definition

الهيكل المرجعي:

```php
Schema::create('collections', function (Blueprint $table) {
    $table->ulid('id')->primary();

    $table->ulid('tenant_id');
    $table->ulid('contract_id');

    $table->unsignedInteger('sequence');
    $table->string('title', 150);
    $table->decimal('amount', 12, 2);
    $table->date('due_date');
    $table->text('notes')->nullable();

    $table->string('status', 20)->default('draft');

    $table->timestampTz('scheduled_at')->nullable();
    $table->unsignedBigInteger('scheduled_by')->nullable();

    $table->timestampTz('cancelled_at')->nullable();
    $table->unsignedBigInteger('cancelled_by')->nullable();
    $table->string('cancellation_reason', 500)->nullable();

    $table->unsignedBigInteger('created_by');
    $table->unsignedBigInteger('updated_by')->nullable();

    $table->timestampsTz();
});
```

قيود PostgreSQL المركبة والـPartial Indexes يمكن إضافتها بواسطة:

```php
DB::statement(...)
```

عند عدم كفاية Laravel Schema Builder.

---

# 12. Collection Stored Lifecycle

القيم الوحيدة المخزنة:

```text
draft
scheduled
cancelled
```

لا تخزن:

```text
unpaid
partially_paid
paid
overdue
```

هذه حالات مشتقة لاحقًا من:

```text
Collections
Payments
Payment Allocations
Current date
```

---

# 13. Collection CHECK Constraints

## 13.1 Sequence

```sql
CONSTRAINT collections_sequence_positive_check
CHECK (sequence > 0)
```

## 13.2 Amount

```sql
CONSTRAINT collections_amount_positive_check
CHECK (amount > 0)
```

## 13.3 Title

```sql
CONSTRAINT collections_title_not_blank_check
CHECK (btrim(title) <> '')
```

التعريف:

```text
VARCHAR(150) NOT NULL
```

ولا يسمح بعنوان:

```text
''
'   '
```

## 13.4 Status

```sql
CONSTRAINT collections_status_check
CHECK (status IN ('draft', 'scheduled', 'cancelled'))
```

## 13.5 Lifecycle consistency

```sql
CONSTRAINT collections_lifecycle_fields_check
CHECK (
    (
        status = 'draft'
        AND scheduled_at IS NULL
        AND scheduled_by IS NULL
        AND cancelled_at IS NULL
        AND cancelled_by IS NULL
        AND cancellation_reason IS NULL
    )
    OR
    (
        status = 'scheduled'
        AND scheduled_at IS NOT NULL
        AND scheduled_by IS NOT NULL
        AND cancelled_at IS NULL
        AND cancelled_by IS NULL
        AND cancellation_reason IS NULL
    )
    OR
    (
        status = 'cancelled'
        AND cancelled_at IS NOT NULL
        AND cancelled_by IS NOT NULL
        AND cancellation_reason IS NOT NULL
        AND btrim(cancellation_reason) <> ''
    )
)
```

---

# 14. Cancellation Reason

التعريف:

```text
cancellation_reason VARCHAR(500) NULL
```

العمود يقبل `NULL` لأن السبب غير موجود في:

```text
draft
scheduled
```

ويصبح مطلوبًا فقط عندما:

```text
status = cancelled
```

قواعد الإلغاء:

```text
cancelled_at IS NOT NULL
cancelled_by IS NOT NULL
cancellation_reason IS NOT NULL
btrim(cancellation_reason) <> ''
```

سبب الإلغاء لا يتجاوز:

```text
500 characters
```

---

# 15. Scheduled and Cancelled Forms

## 15.1 Draft

```text
status = draft

scheduled_at = NULL
scheduled_by = NULL

cancelled_at = NULL
cancelled_by = NULL
cancellation_reason = NULL
```

## 15.2 Scheduled

```text
status = scheduled

scheduled_at IS NOT NULL
scheduled_by IS NOT NULL

cancelled_at = NULL
cancelled_by = NULL
cancellation_reason = NULL
```

## 15.3 Cancelled from Draft

```text
status = cancelled

scheduled_at = NULL
scheduled_by = NULL

cancelled_at IS NOT NULL
cancelled_by IS NOT NULL
cancellation_reason IS NOT NULL
```

هذا الانتقال يحدث فقط ضمن:

```text
CancelContractAction
```

## 15.4 Cancelled from Scheduled

```text
status = cancelled

scheduled_at IS NOT NULL
scheduled_by IS NOT NULL

cancelled_at IS NOT NULL
cancelled_by IS NOT NULL
cancellation_reason IS NOT NULL
```

يحتفظ السجل بتاريخ وجدولة الالتزام الأصلية.

---

# 16. Foreign Keys

جميع مفاتيح Collections تستخدم صراحةً:

```text
ON UPDATE RESTRICT
ON DELETE RESTRICT
```

---

## 16.1 Direct Tenant FK

```sql
ALTER TABLE collections
ADD CONSTRAINT collections_tenant_id_foreign
FOREIGN KEY (tenant_id)
REFERENCES tenants (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

---

## 16.2 Composite Contract FK

```sql
ALTER TABLE collections
ADD CONSTRAINT collections_tenant_contract_foreign
FOREIGN KEY (tenant_id, contract_id)
REFERENCES contracts (tenant_id, id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

هذا القيد يفرض:

```text
Collection Tenant = Contract Tenant
```

---

## 16.3 No standalone Contract FK

لا يضاف:

```sql
FOREIGN KEY (contract_id)
REFERENCES contracts (id)
```

القيد الرسمي للعقد هو فقط:

```text
(tenant_id, contract_id)
→ contracts (tenant_id, id)
```

---

## 16.4 Created Actor

```sql
ALTER TABLE collections
ADD CONSTRAINT collections_created_by_foreign
FOREIGN KEY (created_by)
REFERENCES users (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

## 16.5 Updated Actor

```sql
ALTER TABLE collections
ADD CONSTRAINT collections_updated_by_foreign
FOREIGN KEY (updated_by)
REFERENCES users (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

## 16.6 Scheduled Actor

```sql
ALTER TABLE collections
ADD CONSTRAINT collections_scheduled_by_foreign
FOREIGN KEY (scheduled_by)
REFERENCES users (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

## 16.7 Cancelled Actor

```sql
ALTER TABLE collections
ADD CONSTRAINT collections_cancelled_by_foreign
FOREIGN KEY (cancelled_by)
REFERENCES users (id)
ON UPDATE RESTRICT
ON DELETE RESTRICT;
```

---

# 17. Actor Semantics

## 17.1 created_by

```text
Required.
Represents the Collection creator.
Immutable after creation.
```

## 17.2 updated_by

```text
Nullable on initial creation.
Represents the Actor of the latest successful mutation.
```

يشمل:

```text
Draft edit
Metadata update
Finalization
Amendment cancellation
Contract cancellation
```

## 17.3 scheduled_by

Actor الذي نفذ:

```text
FinalizeCollectionScheduleAction
```

أو أنشأ replacement scheduled row ضمن:

```text
AmendCollectionScheduleAction
```

## 17.4 cancelled_by

Actor الذي نفذ الإلغاء ضمن:

```text
AmendCollectionScheduleAction
CancelContractAction
```

---

# 18. Amount Precision Boundary

نوع المبلغ:

```text
NUMERIC(12,2)
```

وهو مطابق لـ:

```text
contracts.total_amount
```

قاعدة البيانات تفرض:

```text
amount > 0
Storage scale = 2
Storage precision = 12
```

لكن PostgreSQL قد يقوم بتقريب قيمة مثل:

```text
1.234
```

إلى المقياس المحدد بدل رفضها.

لذلك رفض أكثر من منزلتين عند الإدخال هو مسؤولية:

```text
Request Validation
Domain Validation
```

ولا تعتبر الوثيقة ذلك Database-enforced invariant.

---

# 19. Sequence Rules

```text
sequence
```

يجب أن يكون:

```text
Integer
Greater than zero
```

ويكون فريدًا بين Collections الفعالة للعقد.

Collections الفعالة:

```text
draft
scheduled
```

السجلات الملغاة لا تشارك في uniqueness.

---

# 20. Partial Unique Index

```sql
CREATE UNIQUE INDEX collections_active_sequence_unique
ON collections (tenant_id, contract_id, sequence)
WHERE status <> 'cancelled';
```

يسمح ذلك بوجود:

```text
Cancelled historical Collection sequence = 1
Scheduled replacement Collection sequence = 1
```

بعد Amendment.

---

# 21. Operational Index

```sql
CREATE INDEX collections_tenant_contract_status_due_date_index
ON collections (
    tenant_id,
    contract_id,
    status,
    due_date
);
```

يدعم:

```text
Contract Collections
Lifecycle filtering
Due-date filtering
Due-date ordering
```

لا تضاف فهارس افتراضية إضافية دون Query فعلية وخطة تنفيذ تبررها.

---

# 22. Due Date Rules

نوع الحقل:

```text
DATE
```

لا يوجد حد أدنى مرتبط بـ:

```text
Contract creation date
Contract activation date
Reservation date
Current date
```

القاعدة الوحيدة بين صفوف الجدول:

```text
due_date must be non-decreasing by sequence
```

أي:

```text
sequence A < sequence B
→
A.due_date <= B.due_date
```

تفرض هذه القاعدة داخل الـDomain Actions، وليس بواسطة Row CHECK.

---

# 23. Draft Collections

تسمح Draft CRUD فقط عندما:

```text
Contract status = draft
AND
Derived Schedule State = absent OR draft
```

المسموح:

```text
Create
Edit
Hard delete
Resequence
Save draft schedule atomically
```

Action التجميعي:

```text
SaveDraftCollectionScheduleAction
```

لا ينفذ Finalization.

لا يطبق Total Invariant أثناء بناء Draft.

عند حذف آخر Draft:

```text
Derived Schedule State = absent
```

---

# 24. Finalization

Action الرسمي:

```text
FinalizeCollectionScheduleAction
```

العملية:

```text
Lock Contract

Validate Contract lifecycle

Lock active Collections

Validate Derived Schedule State = draft

Validate active sequence uniqueness

Validate due dates are non-decreasing

Validate:
SUM(draft Collection amounts)
=
contracts.total_amount

Convert every draft Collection to scheduled

Set scheduled_at

Set scheduled_by

Set updated_by

Write audit record

Commit
```

التحويل يتم Atomic.

بعد نجاح Finalization لا يسمح بحالة:

```text
active draft + active scheduled
```

---

# 25. Amendment

Action الرسمي:

```text
AmendCollectionScheduleAction
```

لا يعدل Scheduled financial fields مباشرة.

النمط الوحيد:

```text
Cancel old Collections
Create replacement Collections
```

داخل Transaction واحدة:

```text
Lock Contract
Lock Collections
Validate lifecycle
Validate amendment eligibility
Cancel replaced rows
Create replacements directly as scheduled
Validate sequence
Validate due-date order
Validate final total
Write audit
Commit
```

بعد كل Amendment:

```text
SUM(active scheduled Collection amounts)
=
contracts.total_amount
```

---

# 26. Financial Immutability

بعد انتقال Collection إلى:

```text
scheduled
```

الحقول المالية غير قابلة للتعديل:

```text
tenant_id
contract_id
sequence
amount
due_date
```

تعديلات الجدول المالي تتم فقط عبر:

```text
AmendCollectionScheduleAction
```

وبنمط:

```text
cancel and replace
```

الحقول الوصفية القابلة للتعديل بعد الجدولة:

```text
title
notes
```

فقط وفق Domain Action معتمد.

---

# 27. Contract Cancellation

Action الرسمي:

```text
CancelContractAction
```

يسمح بالإلغاء فقط إذا:

```text
No Payment Allocation exists
for any Collection under the Contract.
```

داخل Transaction:

```text
Lock Contract

Validate Contract lifecycle

Lock Collections

Check Payment Allocations

Reject if allocations exist

Cancel draft Collections

Cancel scheduled Collections

Leave cancelled Collections unchanged

Cancel Contract

Write audit

Commit
```

لا يوجد Action مستقل باسم:

```text
CancelDraftCollectionAction
```

---

# 28. Derived Schedule State

لا يخزن في قاعدة البيانات.

يشتق كالآتي:

```text
No Collections
→ absent

All active Collections are draft
→ draft

All active Collections are scheduled
→ scheduled

Collections exist and all are cancelled
→ cancelled

Any active draft and scheduled combination
→ invalid
```

إذا ألغي العقد قبل إنشاء أي Collection:

```text
absent
```

وليس:

```text
cancelled
```

---

# 29. Contract Lifecycle Matrix

| Contract state                  | Draft Edit | Finalize | Amend | Payment |
| ------------------------------- | ---------: | -------: | ----: | ------: |
| `draft` + absent/draft schedule |        Yes |      Yes |    No |      No |
| `draft` + scheduled schedule    |         No |       No |   Yes |      No |
| `active`                        |         No |       No |   Yes |     Yes |
| `completed`                     |         No |       No |   Yes |     Yes |
| `cancelled`                     |         No |       No |    No |      No |

Contract activation منفصل عن Finalization.

المدفوعات ممنوعة قبل Activation.

Operational completion لا يعني اكتمال التحصيل.

يمكن للعقد أن يصبح:

```text
completed
```

مع استمرار Collections وPayments.

---

# 30. Database-Enforced Invariants

تفرض قاعدة البيانات:

```text
ULID business identifiers
BIGINT Actor identifiers
Required columns
TIMESTAMPTZ business timestamps
Positive sequence
Positive amount
Non-blank title
Allowed Collection lifecycle values
Scheduling-field consistency
Cancellation-field consistency
Required non-blank cancellation reason when cancelled
Direct Tenant existence
Composite Tenant/Contract consistency
Actor existence
ON UPDATE RESTRICT
ON DELETE RESTRICT
Active sequence uniqueness
Contract currency required
SAR/USD currency limitation
Contract currency immutability
```

---

# 31. Domain-Enforced Invariants

تفرض داخل Domain Actions:

```text
Contract lifecycle eligibility
Derived Schedule State
No mixed active draft/scheduled schedule
Non-decreasing due dates
Final schedule total equals Contract total
Draft-only financial editing
Scheduled financial immutability
Cancel-and-replace Amendment
No Payment Allocation before Contract cancellation
Payment eligibility
Activation eligibility
Maximum two submitted decimal places
Correct Actor semantics
Audit generation
Locking order
Transaction atomicity
```

---

# 32. Final Migration Order

```text
1. Verify existing tenants.currency values.

2. Add tenants currency CHECK:
   SAR / USD.

3. Add contracts.currency as VARCHAR(3) nullable.

4. Backfill all existing Contracts explicitly:
   currency = 'SAR'.

5. Verify zero Contract currency NULL values.

6. Set contracts.currency NOT NULL.

7. Add contracts currency CHECK:
   SAR / USD.

8. Add Contract currency immutability function.

9. Add Contract currency immutability trigger.

10. Add UNIQUE:
    contracts (tenant_id, id).

11. Create collections using:
    ULID id
    ULID tenant_id
    ULID contract_id
    BIGINT Actors
    TIMESTAMPTZ timestamps.

12. Add Collection CHECK constraints.

13. Add direct Tenant FK.

14. Add composite Tenant/Contract FK.

15. Add Actor FKs.

16. Add partial active-sequence unique index.

17. Add operational index.

18. Run schema verification.

19. Run database tests.

20. Run Domain regression tests.
```

---

# 33. Required Verification

## 33.1 Contract identifier

Confirmed:

```text
contracts.id = CHAR(26)
```

## 33.2 Contract currency NULL check

```sql
SELECT COUNT(*)
FROM contracts
WHERE currency IS NULL;
```

Expected:

```text
0
```

## 33.3 Currency values

```sql
SELECT currency, COUNT(*)
FROM tenants
GROUP BY currency;

SELECT currency, COUNT(*)
FROM contracts
GROUP BY currency;
```

Only:

```text
SAR
USD
```

## 33.4 Cross-Tenant Collection

يجب أن يفشل:

```text
Collection tenant_id = Tenant A
Collection contract_id = Contract owned by Tenant B
```

## 33.5 Invalid title

يجب أن يفشل:

```text
title = ''
title = '   '
```

## 33.6 Invalid lifecycle

يجب أن يفشل:

```text
draft with scheduled_at
scheduled without scheduled_by
cancelled without cancelled_at
cancelled without cancelled_by
cancelled without cancellation_reason
cancelled with blank cancellation_reason
```

## 33.7 Sequence reuse

يجب أن يسمح بـ:

```text
Cancelled old row sequence = 1
Scheduled replacement row sequence = 1
```

ويجب أن يرفض صفين فعالين بالـsequence نفسها.

## 33.8 Currency immutability

يجب أن يفشل:

```sql
UPDATE contracts
SET currency = 'USD'
WHERE id = :existing_contract_id;
```

---

# 34. Required Test Coverage

## Contract currency

```text
Existing Contracts backfilled to SAR.
No Contract remains without currency.
New Contract copies Tenant currency.
Contract currency has no Database Default.
Tenant SAR creates SAR Contract.
Tenant USD creates USD Contract.
Missing Contract currency fails.
Unsupported currency fails.
Existing Contract currency update fails.
Tenant currency change does not modify old Contracts.
```

## Collections schema

```text
Collection id is ULID.
Tenant id is ULID.
Contract id is ULID.
Actors are BIGINT.
Business timestamps are TIMESTAMPTZ.
Title is required and non-blank.
Cancellation reason required only when cancelled.
Cross-Tenant Contract reference rejected.
Sequence must be positive.
Amount must be positive.
Invalid status rejected.
Lifecycle field combinations enforced.
Active sequence uniqueness enforced.
Cancelled sequence reuse allowed.
All FKs use UPDATE RESTRICT.
All FKs use DELETE RESTRICT.
```

## Domain

```text
Draft CRUD allowed only in draft schedule state.
Deleting final Draft returns absent state.
Finalize is atomic.
Finalize rejects total mismatch.
Finalize rejects invalid due-date order.
Amendment uses cancel-and-replace.
Scheduled financial mutation rejected.
Contract cancellation rejects existing allocations.
Contract cancellation cascades Draft and Scheduled Collections.
Successful Actions never leave mixed active states.
More than two submitted decimal places rejected before persistence.
```

---

# 35. Rollback Policy

Rollback dependency order:

```text
1. Drop Collection indexes.
2. Drop Collection Actor FKs.
3. Drop composite Contract FK.
4. Drop direct Tenant FK.
5. Drop collections table.
6. Drop contracts tenant/id unique constraint.
7. Drop Contract currency trigger.
8. Drop Contract currency trigger function.
9. Drop Contract currency CHECK if necessary.
10. Drop Tenant currency CHECK if necessary.
```

بعد استخدام `contracts.currency` في Production، إزالة العمود تعد فقدًا لبيانات تاريخية.

لذلك السياسة التشغيلية:

```text
Prefer forward-fix over destructive rollback.
```

---

# 36. Freeze Declaration

```text
Collection DDL Specification v1
Status: FROZEN
```

تم تجميد:

```text
Contract currency definition
Historical SAR backfill
No Contract currency default
SAR/USD Database constraints
Contract currency immutability
ULID Collection identifier
ULID Tenant ownership
ULID Contract reference
BIGINT Actors
TIMESTAMPTZ timestamps
Collection fields
Title length and non-blank rule
Cancellation reason length and conditional requirement
Collection lifecycle
Composite Contract FK
No standalone contract_id FK
Explicit UPDATE RESTRICT
Explicit DELETE RESTRICT
Partial active-sequence uniqueness
Operational index
Amount responsibility boundary
Migration order
Database/Domain invariant boundary
```

أي تغيير لاحق يعد:

```text
Collection DDL Specification Amendment
```

ويحتاج إلى قرار معماري صريح قبل التنفيذ.

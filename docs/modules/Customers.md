# Customers Module Specification

**Module:** Customers  
**Version:** 1.0  
**Status:** Frozen  
**Last Updated:** 2026-07-20

---

# 1. Purpose

Customers Module هو المرجع الرسمي لإدارة العملاء داخل النظام.

يدعم:

- العملاء الأفراد.
- الشركات.
- المشترين.
- الملاك.
- المستثمرين.
- الوسطاء.
- أي فئات مستقبلية.

لا يحتوي على أي منطق خاص بالمبيعات أو المشاريع.

يمثل الوحدة الرسمية ومصدر الحقيقة لبيانات العملاء داخل كل Tenant.

---

# 2. Scope

تشمل الوحدة:

- إنشاء العميل.
- تحديث بيانات العميل.
- عرض قائمة العملاء.
- عرض تفاصيل العميل.
- البحث.
- الفلاتر.
- الأرشفة.
- الاستعادة.

ولا تشمل:

- العقود.
- الحجوزات.
- الوحدات.
- المشاريع.
- الفواتير.
- الدفعات.
- العمليات المحاسبية.

---

# 3. Architecture

يتكون الموديول من الطبقات التالية:

    Customers
    │
    ├── Controller
    ├── Requests
    ├── Actions
    ├── Model
    ├── Enums
    ├── Routes
    └── Feature Tests

---

# 4. HTTP Layer

CustomerController مسؤول عن:

- Authentication.
- ResolveActiveMembership.
- Authorization.
- Request Validation.
- Action Invocation.
- HTTP Response Translation.

ولا يحتوي على Business Logic.

يتم تنفيذ ResolveActiveMembership داخل Controller فقط قبل استدعاء أي Action.

---

# 5. Application Layer

كل عملية تعديل مستقلة داخل Action خاص بها.

الوحدة الحالية تحتوي على:

- CreateCustomerAction.
- UpdateCustomerAction.
- ArchiveCustomerAction.
- RestoreCustomerAction.

كل Action مسؤول عن:

- بدء Database Transaction.
- تنفيذ Tenant-scoped lookup.
- استخدام lockForUpdate عند تعديل السجل.
- تطبيق قواعد العملية.
- حفظ التغييرات.
- إعادة النتيجة إلى Controller.

الـ Actions تستقبل قيمًا Scalar فقط، مثل:

- tenantId.
- actorId.
- customerId.
- validated data.

ولا تستقبل:

- HTTP Request.
- User Model.
- Active Membership Resolver.
- Route-bound Customer Model.

---

# 6. Frozen Architecture Decisions

## FD-CRM-HTTP-02

ResolveActiveMembership يتم داخل Controller فقط.

لا يتم استدعاء Membership Resolver داخل Actions.

الـ Actions تستقبل فقط القيم اللازمة لتنفيذ العملية.

---

## FD-CRM-HTTP-05

يحظر استخدام Route Model Binding في Customers Module.

يستقبل Controller معرف العميل بالشكل التالي:

    public function show(string $customer)

ولا يستخدم:

    public function show(Customer $customer)

يتم تحميل العميل داخل Action أو داخل Tenant-scoped query بالشكل التالي:

    Customer::query()
        ->where('tenant_id', $tenantId)
        ->whereKey($customerId)

---

## FD-HTTP-01

تعتمد الوحدة عقد HTTP التالي:

| Operation | HTTP Method |
|---|---|
| List | GET |
| Show | GET |
| Create | POST |
| Update | PATCH |
| Archive | PATCH |
| Restore | PATCH |

لا يوجد PUT لتحديث العميل.

ولا تستخدم POST لعمليات Archive أو Restore.

---

# 7. Tenant Isolation

جميع بيانات العملاء مرتبطة بالحقل:

    tenant_id

لا يسمح لأي Tenant بقراءة أو تعديل أو أرشفة أو استعادة بيانات Tenant آخر.

Tenant Isolation مطبق على:

- Index.
- Show.
- Update.
- Archive.
- Restore.

جميع عمليات تحميل عميل محدد تستخدم Tenant Scope:

    Customer::query()
        ->where('tenant_id', $tenantId)
        ->whereKey($customerId)

لا يستخدم find أو findOrFail لتحميل عميل دون Tenant Scope.

---

# 8. IDOR Protection

الحماية من Insecure Direct Object Reference جزء أساسي من تصميم الوحدة.

أي Customer ID لا ينتمي إلى Tenant الحالي يعامل على أنه غير موجود.

الاستجابة المتوقعة في حالة محاولة الوصول إلى عميل تابع لـ Tenant آخر:

    HTTP 404 Not Found

لا يعاد HTTP 403 في هذه الحالة حتى لا يتم كشف وجود السجل في Tenant آخر.

---

# 9. Customer Types

تدعم الوحدة نوعين من العملاء:

- individual.
- company.

## Individual

العميل الفرد:

- يسمح له باستخدام National ID.
- يمنع عنه Commercial Registration Number.

## Company

عميل الشركة:

- يسمح له باستخدام Commercial Registration Number.
- يمنع عنه National ID.

عند تغيير النوع، يتم مسح حقل الهوية غير المتوافق مع النوع الجديد.

مثال:

- التحويل من individual إلى company يمسح national_id.
- التحويل من company إلى individual يمسح commercial_registration_number.

---

# 10. Customer Categories

يدعم الإصدار الحالي الفئات التالية:

- buyer.
- owner.
- investor.
- broker.

التصنيف قابل للتوسع مستقبلًا دون تغيير الهوية الأساسية للعميل.

---

# 11. Customer Statuses

الحالات الحالية:

- lead.
- customer.
- inactive.
- archived.

الحالة archived تمثل حالة أرشفة منطقية وليست حذفًا فعليًا للسجل.

---

# 12. Archive Rules

عملية Archive:

- تغير status إلى archived.
- تعبئ archived_at.
- تعبئ archived_by.
- لا تحذف سجل العميل.
- لا تستخدم SoftDeletes.
- تحافظ على تاريخ العميل وارتباطاته المستقبلية.

العميل المؤرشف:

- لا يمكن تعديله.
- لا يمكن أرشفته مرة أخرى.

محاولة تعديل أو إعادة أرشفة عميل مؤرشف تعاد كخطأ Validation مناسب.

---

# 13. Restore Rules

عملية Restore:

- متاحة فقط للعميل المؤرشف.
- تزيل archived_at.
- تزيل archived_by.
- تحفظ restored_by.
- تعيد status إلى inactive.

لا يعاد العميل تلقائيًا إلى lead أو customer لأن النظام لا يفترض حالته التجارية السابقة بعد الاستعادة.

محاولة استعادة عميل غير مؤرشف تعاد كخطأ Validation مناسب.

---

# 14. Validation Rules

قواعد النوع:

- individual يمنع commercial_registration_number.
- company يمنع national_id.

الحقول الفريدة داخل Tenant:

- phone.
- national_id.
- commercial_registration_number.

يسمح بتكرار القيم نفسها بين Tenants مختلفة.

مثال:

- يمكن لعميل في Tenant A وعميل في Tenant B امتلاك رقم الهاتف نفسه.
- لا يمكن لعميلين داخل Tenant واحد امتلاك رقم الهاتف نفسه.

تطبق القواعد في Application Validation وتدعمها Database Constraints حيث يلزم.

---

# 15. API Endpoints

| Method | Endpoint | Operation |
|---|---|---|
| GET | /api/customers | List customers |
| POST | /api/customers | Create customer |
| GET | /api/customers/{customer} | Show customer |
| PATCH | /api/customers/{customer} | Update customer |
| PATCH | /api/customers/{customer}/archive | Archive customer |
| PATCH | /api/customers/{customer}/restore | Restore customer |

المسارات الفعلية المسجلة:

    GET|HEAD  api/customers
    POST      api/customers
    GET|HEAD  api/customers/{customer}
    PATCH     api/customers/{customer}
    PATCH     api/customers/{customer}/archive
    PATCH     api/customers/{customer}/restore

---

# 16. Authentication and Membership

جميع Customers API endpoints محمية بواسطة:

- auth:sanctum.
- tenant.active.

يتطلب الوصول:

- مستخدمًا مصادقًا عليه.
- عضوية فعالة داخل Tenant.
- Tenant فعالًا.

المستخدم غير المصادق عليه يحصل على:

    HTTP 401 Unauthorized

---

# 17. Security

تعتمد الوحدة على:

- Sanctum Authentication.
- Active Tenant Membership.
- Tenant Isolation.
- IDOR Protection.
- Explicit scalar identifiers.
- No Route Model Binding.
- Tenant-scoped database queries.
- Database transactions.
- lockForUpdate في عمليات التعديل.
- Database constraints.

لا توجد أي عملية تسمح بتجاوز Tenant الحالي.

---

# 18. Database Constraints

تعتمد الوحدة على التحقق داخل التطبيق وعلى قيود قاعدة البيانات.

تشمل القيود:

- Foreign Keys.
- Tenant-scoped Unique Constraints.
- CHECK Constraints.
- Archive-state consistency constraints.

عند status = archived يجب أن تكون بيانات الأرشفة متوافقة مع الحالة.

تعتبر قاعدة البيانات خط الدفاع الأخير.

---

# 19. Testing

تمت تغطية الوحدة باختبارات Feature فعلية.

نتيجة Customers Module Tests النهائية:

    Tests: 21 passed
    Assertions: 120
    Failures: 0
    Errors: 0

تشمل الاختبارات:

- Guest access rejection.
- Create individual customer.
- Create company customer.
- Business validation.
- Individual identity restrictions.
- Company identity restrictions.
- Tenant-scoped uniqueness.
- Cross-tenant uniqueness.
- Customer listing.
- Customer details.
- Search.
- Filters.
- Customer update.
- Customer type conversion.
- Clearing incompatible identity fields.
- Archive.
- Prevent duplicate archive.
- Prevent archived customer update.
- Restore.
- Prevent restoring non-archived customer.
- Cross-tenant show protection.
- Cross-tenant update protection.
- Cross-tenant archive protection.
- Cross-tenant restore protection.
- Index tenant isolation.

---

# 20. Frozen Decisions

تم اعتماد وتجميد القرارات التالية:

- FD-HTTP-01.
- FD-CRM-HTTP-02.
- FD-CRM-HTTP-05.
- ResolveActiveMembership داخل Controller فقط.
- Actions تستقبل Scalars فقط.
- عدم استخدام Route Model Binding.
- كل Customer lookup يجب أن يكون Tenant-scoped.
- السجل خارج Tenant يعامل كأنه غير موجود.
- Update يستخدم PATCH فقط.
- Archive يستخدم PATCH.
- Restore يستخدم PATCH.
- Archive هو Logical State وليس حذفًا.
- Restore يعيد العميل إلى inactive.
- Database هي خط الدفاع الأخير.
- نجاح Feature Tests شرط قبل تجميد الوحدة.

---

# 21. Module Status

    Module: Customers
    Version: 1.0
    Status: FROZEN
    Implementation: Completed
    Routes: Completed
    Feature Tests: 21 Passed
    Assertions: 120
    Failures: 0
    Errors: 0
    Documentation: Completed
    Production Ready: YES

---

# 22. Change Policy

بعد تجميد الإصدار 1.0:

- لا يتم تغيير عقد HTTP بصمت.
- لا يتم تغيير قواعد Tenant Isolation دون قرار معماري موثق.
- لا يتم إدخال Route Model Binding.
- لا يتم نقل ResolveActiveMembership إلى Actions.
- أي تغيير على Business Rules يجب توثيقه واختباره قبل اعتماده.
- أي توسع مستقبلي يجب أن يحافظ على التوافق مع القرارات المجمدة أو يسجل قرارًا معماريًا جديدًا يلغيها بوضوح.

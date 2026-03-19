<?php

namespace App\Utils;

class GlobalConstant
{

    // Status
    public const STATUS_ACTIVE = 1;
    public const STATUS_INACTIVE = 0;

    // Pagination
    public const DEFAULT_PAGINATION = 10;

    // Roles
    public const ROLE_ADMIN = 'admin';
    public const ROLE_USER = 'user';

    // Date formats
    public const DATE_FORMAT = 'Y-m-d';
    public const DATETIME_FORMAT = 'Y-m-d H:i:s';

    // UI
    public const FLASH_SUCCESS = 'success';
    public const FLASH_ERROR = 'error';

    // client type
    public const CLIENT_TYPE_RETAINER = 'retainer';
    public const CLIENT_TYPE_CONTINGENCY = 'contingency';

    // client category
    public const CLIENT_CATEGORY_CLIENT = 'client';
    public const CLIENT_CATEGORY_PROSPECT = 'prospect';
    public const CLIENT_CATEGORY_TARGET_ACCOUNT = 'target_account';

    // fee type
    public const JOB_FEE_TYPE_PERCENTAGE = 'percentage';
    public const JOB_FEE_TYPE_FIXED = 'fixed';
    public const JOB_FEE_TYPE_RETAINED = 'retained';


    //placement invoice status
    public const PLACEMENT_INVOICE_STATUS_NOT_INVOICED = 'not_invoiced';
    public const PLACEMENT_INVOICE_STATUS_INVOICED = 'invoiced';
    public const PLACEMENT_INVOICE_STATUS_PAID = 'paid';

    // invoice status
    public const INVOICE_STATUS_ISSUED = 'issued';
    public const INVOICE_STATUS_PAID = 'paid';
    public const INVOICE_STATUS_CANCELED = 'canceled';
}

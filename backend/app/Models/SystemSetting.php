<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'company_name_ar',
        'company_name_en',
        'short_name_ar',
        'short_name_en',
        'company_tagline_ar',
        'company_tagline_en',
        'logo_path',
        'favicon_path',
        'primary_color',
        'secondary_color',
        'language',
        'timezone',
        'currency',
        'date_format',
        'phone',
        'email',
        'website',
        'address',
        'commercial_registration',
        'vat_number',
    ];
}

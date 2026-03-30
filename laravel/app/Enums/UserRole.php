<?php

namespace App\Enums;

enum UserRole: string
{
    case Jobseeker = 'jobseeker';

    case Company = 'company';

    case Admin = 'admin';
}

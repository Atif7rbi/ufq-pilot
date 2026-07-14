<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Validator;

class CreateAdminUser extends Command
{
    protected $signature = 'ufq:create-admin';

    protected $description = 'Create the first administrator account safely';

    public function handle(): int
    {
        $name = trim((string) $this->ask('الاسم الكامل'));
        $email = mb_strtolower(trim((string) $this->ask('البريد الإلكتروني')));
        $phone = trim((string) $this->ask('رقم الجوال (اختياري)', ''));

        $password = (string) $this->secret('كلمة المرور');
        $passwordConfirmation = (string) $this->secret('تأكيد كلمة المرور');

        $validator = Validator::make(
            [
                'name' => $name,
                'email' => $email,
                'phone' => $phone !== '' ? $phone : null,
                'password' => $password,
                'password_confirmation' => $passwordConfirmation,
            ],
            [
                'name' => ['required', 'string', 'max:255'],
                'email' => [
                    'required',
                    'email',
                    'max:254',
                    'unique:users,email',
                ],
                'phone' => ['nullable', 'string', 'max:30'],
                'password' => [
                    'required',
                    'confirmed',
                    Password::min(12)
                        ->letters()
                        ->mixedCase()
                        ->numbers()
                        ->symbols(),
                ],
            ],
            [
                'name.required' => 'الاسم مطلوب.',
                'email.required' => 'البريد الإلكتروني مطلوب.',
                'email.email' => 'البريد الإلكتروني غير صحيح.',
                'email.unique' => 'البريد الإلكتروني مستخدم مسبقًا.',
                'password.confirmed' => 'تأكيد كلمة المرور غير مطابق.',
            ]
        );

        if ($validator->fails()) {
            foreach ($validator->errors()->all() as $error) {
                $this->error($error);
            }

            return self::FAILURE;
        }

        $user = User::query()->create([
            'name' => $name,
            'email' => $email,
            'phone' => $phone !== '' ? $phone : null,
            'role' => User::ROLE_ADMINISTRATOR,
            'status' => User::STATUS_ACTIVE,
            'email_verified_at' => now(),
            'password' => Hash::make($password),
        ]);

        $this->newLine();
        $this->info('تم إنشاء حساب المدير بنجاح.');
        $this->line('ID: '.$user->id);
        $this->line('Email: '.$user->email);

        return self::SUCCESS;
    }
}

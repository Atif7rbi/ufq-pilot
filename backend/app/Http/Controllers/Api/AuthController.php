<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\LoginRequest;
use App\Models\User;
use App\Modules\Shared\Exceptions\TenantMembershipMissingException;
use App\Modules\Shared\Exceptions\TenantMembershipPausedException;
use App\Modules\Shared\Exceptions\TenantMembershipRemovedException;
use App\Modules\Shared\Exceptions\TenantMembershipSuspendedException;
use App\Modules\Shared\Services\ResolveActiveMembership;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private readonly ResolveActiveMembership $resolver,
    ) {
    }

    public function login(LoginRequest $request): JsonResponse
    {
        $user = User::query()
            ->where('email', $request->string('email'))
            ->first();

        if (! $user || ! Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['بيانات الدخول غير صحيحة.'],
            ]);
        }

        if (! $user->isActive()) {
            throw ValidationException::withMessages([
                'email' => ['هذا الحساب غير نشط.'],
            ]);
        }

        try {
            $this->resolver->handle($user);
        } catch (TenantMembershipMissingException) {
            return $this->deny(
                'tenant_membership_missing',
                'missing',
                'لا توجد شركة مرتبطة بالحساب',
                'لا توجد عضوية شركة مرتبطة بهذا الحساب. يرجى التواصل مع مسؤول النظام.'
            );
        } catch (TenantMembershipPausedException) {
            return $this->deny(
                'tenant_membership_paused',
                'paused',
                'تم إيقاف عضويتك مؤقتًا',
                'تم إيقاف عضويتك مؤقتًا في هذه الشركة. يرجى التواصل مع مدير الشركة لإعادة تفعيل حسابك.'
            );
        } catch (TenantMembershipSuspendedException) {
            return $this->deny(
                'tenant_membership_suspended',
                'suspended',
                'تم تعليق عضويتك',
                'تم تعليق عضويتك في هذه الشركة. يرجى التواصل مع مسؤول الشركة لمزيد من المعلومات.'
            );
        } catch (TenantMembershipRemovedException) {
            return $this->deny(
                'tenant_membership_removed',
                'removed',
                'انتهت عضويتك',
                'لم تعد عضوًا في هذه الشركة.'
            );
        }

        $user->forceFill([
            'last_login_at' => now(),
        ])->save();

        $token = $user->createToken('ufq-pilot')->plainTextToken;

        return response()->json([
            'message' => 'تم تسجيل الدخول بنجاح.',
            'data' => [
                'token' => $token,
                'user' => $user->fresh(),
            ],
        ]);
    }

    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'data' => [
                'user' => $request->user(),
            ],
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        $request->user()
            ->currentAccessToken()
            ?->delete();

        return response()->json([
            'message' => 'تم تسجيل الخروج بنجاح.',
        ]);
    }

    private function deny(
        string $code,
        string $status,
        string $title,
        string $message,
    ): JsonResponse {
        return response()->json([
            'message' => $message,
            'error' => [
                'code' => $code,
                'status' => $status,
                'title' => $title,
                'message' => $message,
            ],
        ], 403);
    }
}

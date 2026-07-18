<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use App\Modules\Shared\Exceptions\TenantMembershipMissingException;
use App\Modules\Shared\Exceptions\TenantMembershipPausedException;
use App\Modules\Shared\Exceptions\TenantMembershipRemovedException;
use App\Modules\Shared\Exceptions\TenantMembershipSuspendedException;
use App\Modules\Shared\Services\ResolveActiveMembership;
use Closure;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

final class EnsureActiveTenantMembership
{
    public function __construct(
        private readonly ResolveActiveMembership $resolver,
    ) {
    }

    public function handle(
        Request $request,
        Closure $next,
    ): Response {
        $user = $request->user();

        if ($user === null) {
            return $next($request);
        }

        try {
            $membership = $this->resolver->handle($user);

            $request->attributes->set(
                'tenant_membership',
                $membership,
            );

            return $next($request);
        } catch (TenantMembershipMissingException) {
            return $this->deny(
                code: 'tenant_membership_missing',
                status: 'missing',
                title: 'لا توجد شركة مرتبطة بالحساب',
                message: 'لا توجد عضوية شركة مرتبطة بهذا الحساب. يرجى التواصل مع مسؤول النظام.',
            );
        } catch (TenantMembershipPausedException) {
            return $this->deny(
                code: 'tenant_membership_paused',
                status: 'paused',
                title: 'تم إيقاف عضويتك مؤقتًا',
                message: 'تم إيقاف عضويتك مؤقتًا في هذه الشركة. يرجى التواصل مع مدير الشركة لإعادة تفعيل حسابك.',
            );
        } catch (TenantMembershipSuspendedException) {
            return $this->deny(
                code: 'tenant_membership_suspended',
                status: 'suspended',
                title: 'تم تعليق عضويتك',
                message: 'تم تعليق عضويتك في هذه الشركة. يرجى التواصل مع مسؤول الشركة لمزيد من المعلومات.',
            );
        } catch (TenantMembershipRemovedException) {
            return $this->deny(
                code: 'tenant_membership_removed',
                status: 'removed',
                title: 'انتهت عضويتك',
                message: 'لم تعد عضوًا في هذه الشركة. يرجى التواصل مع مسؤول الشركة عند الحاجة.',
            );
        }
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

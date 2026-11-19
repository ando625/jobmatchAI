<?php

namespace Tests\Feature;

use App\Enums\UserRole;
use App\Models\Application;
use App\Models\Company;
use App\Models\JobPosting;
use App\Models\Message;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

// 権限まわりのテスト（自分の会社・自分の応募のデータだけを扱えるか）
class AuthorizationTest extends TestCase
{
    use RefreshDatabase;

    private User $seeker;

    private User $companyUser;

    private User $otherCompanyUser;

    private JobPosting $job;

    private Application $application;

    protected function setUp(): void
    {
        parent::setUp();

        $this->seeker = $this->makeUser(UserRole::Jobseeker, 'seeker@example.test');
        $this->seeker->profile()->create(['bio' => 'Laravelが得意', 'skills' => ['PHP']]);

        $this->companyUser = $this->makeUser(UserRole::Company, 'company@example.test');
        $company = Company::create(['user_id' => $this->companyUser->id, 'company_name' => '株式会社A', 'location' => '東京']);

        $this->otherCompanyUser = $this->makeUser(UserRole::Company, 'other@example.test');
        Company::create(['user_id' => $this->otherCompanyUser->id, 'company_name' => '株式会社B', 'location' => '大阪']);

        $this->job = JobPosting::create([
            'title' => 'PHPエンジニア', 'description' => 'Laravel開発', 'required_skills' => ['PHP', 'Laravel'],
            'company_id' => $company->id, 'company_name' => $company->company_name, 'status' => 'open',
        ]);
        $this->application = Application::create([
            'user_id' => $this->seeker->id, 'job_posting_id' => $this->job->id, 'status' => 'applying', 'match_score' => 70,
        ]);
    }

    private function makeUser(UserRole $role, string $email): User
    {
        return User::create(['name' => $email, 'email' => $email, 'password' => 'password123', 'role' => $role]);
    }

    private function as(User $user): static
    {
        $this->app['auth']->forgetGuards();

        return $this->actingAs($user, 'sanctum');
    }

    public function test_register_cannot_create_admin(): void
    {
        $this->postJson('/api/auth/register', [
            'name' => '侵入者', 'email' => 'evil@example.test', 'password' => 'password123',
            'password_confirmation' => 'password123', 'role' => 'admin',
        ])->assertUnprocessable()->assertJsonValidationErrors('role');

        $this->assertDatabaseMissing('users', ['email' => 'evil@example.test']);
    }

    public function test_register_allows_jobseeker_and_company(): void
    {
        foreach (['jobseeker', 'company'] as $role) {
            $this->postJson('/api/auth/register', [
                'name' => $role, 'email' => "{$role}-new@example.test", 'password' => 'password123',
                'password_confirmation' => 'password123', 'role' => $role,
            ])->assertCreated()->assertJsonPath('role', $role);
        }
    }

    public function test_company_cannot_delete_other_company_job(): void
    {
        $this->as($this->otherCompanyUser)->deleteJson("/api/company/jobs/{$this->job->id}")->assertForbidden();
        $this->assertNotNull($this->job->fresh());

        $this->as($this->companyUser)->deleteJson("/api/company/jobs/{$this->job->id}")->assertOk();
        $this->assertNull($this->job->fresh());
    }

    public function test_company_cannot_view_other_company_applicant(): void
    {
        $this->as($this->otherCompanyUser)->getJson("/api/company/applicants/{$this->application->id}")->assertForbidden();

        $this->as($this->companyUser)->getJson("/api/company/applicants/{$this->application->id}")
            ->assertOk()->assertJsonPath('data.user.profile.bio', 'Laravelが得意');
    }

    public function test_company_ai_analysis_is_limited_and_sends_job_info(): void
    {
        Http::fake(['python:8000/*' => Http::response(['score' => 70, 'reason' => '企業向けコメント'])]);

        $this->as($this->otherCompanyUser)->postJson("/api/company/applications/{$this->application->id}/ai-analysis")->assertForbidden();
        Http::assertNothingSent();

        $this->as($this->companyUser)->postJson("/api/company/applications/{$this->application->id}/ai-analysis")
            ->assertOk()->assertJsonPath('comment', '企業向けコメント');

        // 求人の必須スキルと仕事内容が Python に送られている
        Http::assertSent(fn ($r) => $r->url() === 'http://python:8000/match/company'
            && $r['job_skills'] === ['PHP', 'Laravel'] && $r['job_description'] === 'Laravel開発'
            && $r['user_skills'] === ['PHP'] && $r['score'] === 70);
    }

    public function test_messages_are_visible_only_to_applicant_and_company(): void
    {
        Message::create(['application_id' => $this->application->id, 'sender_id' => $this->companyUser->id, 'content' => '面接の日程です', 'is_read' => false]);
        $outsider = $this->makeUser(UserRole::Jobseeker, 'outsider@example.test');

        $this->as($outsider)->getJson("/api/messages/{$this->application->id}")->assertForbidden();
        $this->as($this->otherCompanyUser)->getJson("/api/messages/{$this->application->id}")->assertForbidden();
        // 見られなかった人のアクセスで、既読にならない
        $this->assertFalse((bool) Message::first()->is_read);

        $this->as($this->seeker)->getJson("/api/messages/{$this->application->id}")
            ->assertOk()->assertJsonPath('messages.0.content', '面接の日程です');
        $this->assertTrue((bool) Message::first()->is_read);

        $this->as($this->companyUser)->getJson("/api/messages/{$this->application->id}")->assertOk()->assertJsonCount(1, 'messages');

        $this->as($this->seeker)->getJson('/api/messages/999')->assertNotFound();
    }
}

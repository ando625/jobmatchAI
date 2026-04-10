<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class TrendController extends Controller
{
    // 最新のトレンドを分析する
    public function analyze(Request $request)
    {
        $request->validate([
            'skill_name' => 'required | string | max:50',
        ]);

        try{
            $response = Http::timeout(120)
                ->post('http://python:8000/analyze-trend', [
                    'skill_name' => $request->skill_name,
                ]);

            if ($response->failed()){
                throw new \Exception('Pythonサーバーからの応答がありません');
            }
            return response()->json($response->json());
        }catch (\Exception $e){
            Log::error('Trend Analysis Error: ' . $e->getMessage());
            return response()->json([
                'error' => 'AIエージェントが調査に失敗しました。少し時間を置いて試してください。'
            ], 500);
        }
    }
}

<?php

namespace App\Http\Controllers;

use App\Http\Resources\ProductResource;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    public function index(): AnonymousResourceCollection
    {
        $products = Product::all()->sortByDesc('created_at');
        return ProductResource::collection($products);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:products',
            'price' => 'required|numeric|min:1',
            'date' => 'required|date',
        ]);
        $product = Product::query()->create($validated);
        return response()->json(new ProductResource($product), 201);
    }
}
